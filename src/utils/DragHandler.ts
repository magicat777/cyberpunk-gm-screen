import { Position } from '@/types';
import { eventBus, Events } from '@/lib/EventBus';

export interface DragOptions {
  constrainToParent?: boolean;
  snapToGrid?: number;
  handle?: HTMLElement;
  onDragStart?: (position: Position) => void;
  onDragMove?: (position: Position) => void;
  onDragEnd?: (position: Position) => void;
  threshold?: number;
}

export class DragHandler {
  private element: HTMLElement;
  private handle: HTMLElement;
  private options: DragOptions;
  private isDragging = false;
  private startPosition: Position = { x: 0, y: 0 };
  private currentPosition: Position = { x: 0, y: 0 };
  private elementStartPosition: Position = { x: 0, y: 0 };
  private pointerOffset: Position = { x: 0, y: 0 };
  private moveThreshold: number;
  private hasMovedBeyondThreshold = false;
  
  // Bound event handlers
  private boundHandlePointerDown: (e: PointerEvent) => void;
  private boundHandlePointerMove: (e: PointerEvent) => void;
  private boundHandlePointerUp: (e: PointerEvent) => void;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;
  private boundHandleTouchMove: (e: TouchEvent) => void;

  constructor(element: HTMLElement, options: DragOptions = {}) {
    this.element = element;
    this.handle = options.handle || element;
    this.options = {
      constrainToParent: true,
      snapToGrid: 0,
      threshold: 3,
      ...options,
    };
    this.moveThreshold = this.options.threshold || 3;

    // Bind event handlers
    this.boundHandlePointerDown = this.handlePointerDown.bind(this);
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleTouchMove = this.handleTouchMove.bind(this);

    this.init();
  }

  private init(): void {
    // Make element draggable
    this.element.style.position = 'absolute';
    this.element.style.touchAction = 'none';
    
    // Add cursor style
    this.handle.style.cursor = 'move';
    
    // Add event listeners
    this.handle.addEventListener('pointerdown', this.boundHandlePointerDown);
    
    // Accessibility
    this.element.setAttribute('role', 'application');
    this.element.setAttribute('aria-grabbed', 'false');
    this.element.tabIndex = 0;
  }

  private handlePointerDown(e: PointerEvent): void {
    // Ignore right clicks
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.hasMovedBeyondThreshold = false;

    // Capture pointer
    this.handle.setPointerCapture(e.pointerId);

    // Get element position
    const rect = this.element.getBoundingClientRect();
    const parentRect = this.element.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

    this.elementStartPosition = {
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
    };

    // Calculate pointer offset from element
    this.pointerOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    this.startPosition = { x: e.clientX, y: e.clientY };
    this.currentPosition = { ...this.startPosition };

    // Update element state
    this.element.classList.add('dragging');
    this.element.setAttribute('aria-grabbed', 'true');

    // Add document listeners
    document.addEventListener('pointermove', this.boundHandlePointerMove);
    document.addEventListener('pointerup', this.boundHandlePointerUp);
    document.addEventListener('keydown', this.boundHandleKeyDown);
    document.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });

    // Emit event
    eventBus.emit(Events.DRAG_START, {
      elementId: this.element.id,
      position: this.elementStartPosition,
    });

    // Callback
    this.options.onDragStart?.(this.elementStartPosition);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDragging) return;

    e.preventDefault();

    // Check if we've moved beyond threshold
    if (!this.hasMovedBeyondThreshold) {
      const deltaX = Math.abs(e.clientX - this.startPosition.x);
      const deltaY = Math.abs(e.clientY - this.startPosition.y);
      
      if (deltaX < this.moveThreshold && deltaY < this.moveThreshold) {
        return;
      }
      
      this.hasMovedBeyondThreshold = true;
    }

    this.currentPosition = { x: e.clientX, y: e.clientY };

    // Calculate new position
    let newX = e.clientX - this.pointerOffset.x;
    let newY = e.clientY - this.pointerOffset.y;

    // Get parent bounds for constraints
    const parentRect = this.element.offsetParent?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Apply constraints
    if (this.options.constrainToParent) {
      const elementRect = this.element.getBoundingClientRect();
      
      newX = Math.max(0, Math.min(newX - parentRect.left, parentRect.width - elementRect.width));
      newY = Math.max(0, Math.min(newY - parentRect.top, parentRect.height - elementRect.height));
    } else {
      newX = newX - parentRect.left;
      newY = newY - parentRect.top;
    }

    // Apply grid snapping
    if (this.options.snapToGrid && this.options.snapToGrid > 0) {
      newX = Math.round(newX / this.options.snapToGrid) * this.options.snapToGrid;
      newY = Math.round(newY / this.options.snapToGrid) * this.options.snapToGrid;
    }

    // Update position
    const position = { x: newX, y: newY };
    this.updatePosition(position);

    // Emit event
    eventBus.emit(Events.DRAG_MOVE, {
      elementId: this.element.id,
      position,
    });

    // Callback
    this.options.onDragMove?.(position);
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.isDragging) return;

    e.preventDefault();

    this.isDragging = false;

    // Release pointer capture
    this.handle.releasePointerCapture(e.pointerId);

    // Remove document listeners
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    document.removeEventListener('touchmove', this.boundHandleTouchMove);

    // Update element state
    this.element.classList.remove('dragging');
    this.element.setAttribute('aria-grabbed', 'false');

    // Get final position
    const rect = this.element.getBoundingClientRect();
    const parentRect = this.element.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
    const finalPosition = {
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
    };

    // Emit event
    eventBus.emit(Events.DRAG_END, {
      elementId: this.element.id,
      position: finalPosition,
    });

    // Callback
    this.options.onDragEnd?.(finalPosition);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isDragging && e.key === 'Escape') {
      this.cancelDrag();
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    // Prevent scrolling while dragging
    if (this.isDragging) {
      e.preventDefault();
    }
  }

  private updatePosition(position: Position): void {
    this.element.style.left = `${position.x}px`;
    this.element.style.top = `${position.y}px`;
  }

  private cancelDrag(): void {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Restore original position
    this.updatePosition(this.elementStartPosition);

    // Clean up
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    document.removeEventListener('touchmove', this.boundHandleTouchMove);

    this.element.classList.remove('dragging');
    this.element.setAttribute('aria-grabbed', 'false');
  }

  public setPosition(position: Position): void {
    this.updatePosition(position);
  }

  public getPosition(): Position {
    return {
      x: parseInt(this.element.style.left || '0', 10),
      y: parseInt(this.element.style.top || '0', 10),
    };
  }

  public enable(): void {
    this.handle.addEventListener('pointerdown', this.boundHandlePointerDown);
    this.handle.style.cursor = 'move';
    this.element.setAttribute('aria-grabbed', 'false');
  }

  public disable(): void {
    this.handle.removeEventListener('pointerdown', this.boundHandlePointerDown);
    this.handle.style.cursor = 'default';
    this.element.removeAttribute('aria-grabbed');
    
    if (this.isDragging) {
      this.cancelDrag();
    }
  }

  public destroy(): void {
    this.disable();
    
    // Remove all event listeners
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    document.removeEventListener('touchmove', this.boundHandleTouchMove);
  }
}