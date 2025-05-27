import { Size, Position, ResizeDirection } from '@/types';
import { eventBus, Events } from '@/lib/EventBus';

export interface ResizeOptions {
  minSize?: Size;
  maxSize?: Size;
  snapToGrid?: number;
  preserveAspectRatio?: boolean;
  onResizeStart?: (size: Size) => void;
  onResizeMove?: (size: Size) => void;
  onResizeEnd?: (size: Size) => void;
  handles?: ResizeDirection[];
}

interface ResizeHandle {
  element: HTMLElement;
  direction: ResizeDirection;
}

export class ResizeHandler {
  private element: HTMLElement;
  private options: ResizeOptions;
  private handles: ResizeHandle[] = [];
  private isResizing = false;
  private activeHandle: ResizeHandle | null = null;
  private startSize: Size = { width: 0, height: 0 };
  private startPosition: Position = { x: 0, y: 0 };
  private currentSize: Size = { width: 0, height: 0 };
  private elementStartPosition: Position = { x: 0, y: 0 };
  private pointerStart: Position = { x: 0, y: 0 };
  private aspectRatio = 1;

  // Bound event handlers
  private boundHandlePointerDown: (e: PointerEvent) => void;
  private boundHandlePointerMove: (e: PointerEvent) => void;
  private boundHandlePointerUp: (e: PointerEvent) => void;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  constructor(element: HTMLElement, options: ResizeOptions = {}) {
    this.element = element;
    this.options = {
      minSize: { width: 100, height: 100 },
      maxSize: { width: Infinity, height: Infinity },
      snapToGrid: 0,
      preserveAspectRatio: false,
      handles: [
        ResizeDirection.TOP,
        ResizeDirection.RIGHT,
        ResizeDirection.BOTTOM,
        ResizeDirection.LEFT,
        ResizeDirection.TOP_LEFT,
        ResizeDirection.TOP_RIGHT,
        ResizeDirection.BOTTOM_LEFT,
        ResizeDirection.BOTTOM_RIGHT,
      ],
      ...options,
    };

    // Bind event handlers
    this.boundHandlePointerDown = this.handlePointerDown.bind(this);
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);

    this.init();
  }

  private init(): void {
    // Create resize handles
    this.createHandles();
    
    // Calculate initial aspect ratio
    const rect = this.element.getBoundingClientRect();
    this.aspectRatio = rect.width / rect.height;
  }

  private createHandles(): void {
    const handleClasses: Record<ResizeDirection, string> = {
      [ResizeDirection.TOP]: 'resize-handle-top',
      [ResizeDirection.RIGHT]: 'resize-handle-right',
      [ResizeDirection.BOTTOM]: 'resize-handle-bottom',
      [ResizeDirection.LEFT]: 'resize-handle-left',
      [ResizeDirection.TOP_LEFT]: 'resize-handle-top-left',
      [ResizeDirection.TOP_RIGHT]: 'resize-handle-top-right',
      [ResizeDirection.BOTTOM_LEFT]: 'resize-handle-bottom-left',
      [ResizeDirection.BOTTOM_RIGHT]: 'resize-handle-bottom-right',
    };

    const cursors: Record<ResizeDirection, string> = {
      [ResizeDirection.TOP]: 'ns-resize',
      [ResizeDirection.RIGHT]: 'ew-resize',
      [ResizeDirection.BOTTOM]: 'ns-resize',
      [ResizeDirection.LEFT]: 'ew-resize',
      [ResizeDirection.TOP_LEFT]: 'nw-resize',
      [ResizeDirection.TOP_RIGHT]: 'ne-resize',
      [ResizeDirection.BOTTOM_LEFT]: 'sw-resize',
      [ResizeDirection.BOTTOM_RIGHT]: 'se-resize',
    };

    this.options.handles?.forEach(direction => {
      const handle = document.createElement('div');
      handle.className = `resize-handle ${handleClasses[direction]}`;
      handle.style.position = 'absolute';
      handle.style.cursor = cursors[direction];
      handle.style.touchAction = 'none';
      handle.setAttribute('aria-label', `Resize ${direction}`);
      handle.setAttribute('role', 'separator');
      handle.setAttribute('aria-orientation', 
        [ResizeDirection.LEFT, ResizeDirection.RIGHT].includes(direction) ? 'vertical' : 'horizontal'
      );

      // Position handles
      this.positionHandle(handle, direction);

      // Add event listener
      handle.addEventListener('pointerdown', this.boundHandlePointerDown);

      this.element.appendChild(handle);
      this.handles.push({ element: handle, direction });
    });
  }

  private positionHandle(handle: HTMLElement, direction: ResizeDirection): void {
    const styles: Partial<CSSStyleDeclaration> = {
      position: 'absolute',
    };

    switch (direction) {
      case ResizeDirection.TOP:
        Object.assign(styles, {
          top: '-4px',
          left: '0',
          right: '0',
          height: '8px',
        });
        break;
      case ResizeDirection.RIGHT:
        Object.assign(styles, {
          top: '0',
          right: '-4px',
          bottom: '0',
          width: '8px',
        });
        break;
      case ResizeDirection.BOTTOM:
        Object.assign(styles, {
          bottom: '-4px',
          left: '0',
          right: '0',
          height: '8px',
        });
        break;
      case ResizeDirection.LEFT:
        Object.assign(styles, {
          top: '0',
          left: '-4px',
          bottom: '0',
          width: '8px',
        });
        break;
      case ResizeDirection.TOP_LEFT:
        Object.assign(styles, {
          top: '-4px',
          left: '-4px',
          width: '12px',
          height: '12px',
        });
        break;
      case ResizeDirection.TOP_RIGHT:
        Object.assign(styles, {
          top: '-4px',
          right: '-4px',
          width: '12px',
          height: '12px',
        });
        break;
      case ResizeDirection.BOTTOM_LEFT:
        Object.assign(styles, {
          bottom: '-4px',
          left: '-4px',
          width: '12px',
          height: '12px',
        });
        break;
      case ResizeDirection.BOTTOM_RIGHT:
        Object.assign(styles, {
          bottom: '-4px',
          right: '-4px',
          width: '12px',
          height: '12px',
        });
        break;
    }

    Object.assign(handle.style, styles);
  }

  private handlePointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    // Find which handle was clicked
    const handle = this.handles.find(h => h.element === e.target);
    if (!handle) return;

    this.isResizing = true;
    this.activeHandle = handle;

    // Capture pointer
    handle.element.setPointerCapture(e.pointerId);

    // Get initial sizes and positions
    const rect = this.element.getBoundingClientRect();
    this.startSize = {
      width: rect.width,
      height: rect.height,
    };
    this.currentSize = { ...this.startSize };

    const parentRect = this.element.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
    this.elementStartPosition = {
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
    };

    this.pointerStart = {
      x: e.clientX,
      y: e.clientY,
    };

    // Update element state
    this.element.classList.add('resizing');
    handle.element.setAttribute('aria-valuenow', `${this.startSize.width}`);

    // Add document listeners
    document.addEventListener('pointermove', this.boundHandlePointerMove);
    document.addEventListener('pointerup', this.boundHandlePointerUp);
    document.addEventListener('keydown', this.boundHandleKeyDown);

    // Emit event
    eventBus.emit(Events.RESIZE_START, {
      elementId: this.element.id,
      size: this.startSize,
      direction: handle.direction,
    });

    // Callback
    this.options.onResizeStart?.(this.startSize);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isResizing || !this.activeHandle) return;

    e.preventDefault();

    const deltaX = e.clientX - this.pointerStart.x;
    const deltaY = e.clientY - this.pointerStart.y;

    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;
    let newX = this.elementStartPosition.x;
    let newY = this.elementStartPosition.y;

    // Calculate new size based on handle direction
    switch (this.activeHandle.direction) {
      case ResizeDirection.RIGHT:
        newWidth = this.startSize.width + deltaX;
        break;
      case ResizeDirection.LEFT:
        newWidth = this.startSize.width - deltaX;
        newX = this.elementStartPosition.x + deltaX;
        break;
      case ResizeDirection.BOTTOM:
        newHeight = this.startSize.height + deltaY;
        break;
      case ResizeDirection.TOP:
        newHeight = this.startSize.height - deltaY;
        newY = this.elementStartPosition.y + deltaY;
        break;
      case ResizeDirection.TOP_LEFT:
        newWidth = this.startSize.width - deltaX;
        newHeight = this.startSize.height - deltaY;
        newX = this.elementStartPosition.x + deltaX;
        newY = this.elementStartPosition.y + deltaY;
        break;
      case ResizeDirection.TOP_RIGHT:
        newWidth = this.startSize.width + deltaX;
        newHeight = this.startSize.height - deltaY;
        newY = this.elementStartPosition.y + deltaY;
        break;
      case ResizeDirection.BOTTOM_LEFT:
        newWidth = this.startSize.width - deltaX;
        newHeight = this.startSize.height + deltaY;
        newX = this.elementStartPosition.x + deltaX;
        break;
      case ResizeDirection.BOTTOM_RIGHT:
        newWidth = this.startSize.width + deltaX;
        newHeight = this.startSize.height + deltaY;
        break;
    }

    // Apply constraints
    newWidth = Math.max(this.options.minSize!.width, Math.min(newWidth, this.options.maxSize!.width));
    newHeight = Math.max(this.options.minSize!.height, Math.min(newHeight, this.options.maxSize!.height));

    // Preserve aspect ratio if needed
    if (this.options.preserveAspectRatio) {
      const currentRatio = newWidth / newHeight;
      if (currentRatio > this.aspectRatio) {
        newWidth = newHeight * this.aspectRatio;
      } else {
        newHeight = newWidth / this.aspectRatio;
      }
    }

    // Apply grid snapping
    if (this.options.snapToGrid && this.options.snapToGrid > 0) {
      newWidth = Math.round(newWidth / this.options.snapToGrid) * this.options.snapToGrid;
      newHeight = Math.round(newHeight / this.options.snapToGrid) * this.options.snapToGrid;
      newX = Math.round(newX / this.options.snapToGrid) * this.options.snapToGrid;
      newY = Math.round(newY / this.options.snapToGrid) * this.options.snapToGrid;
    }

    // Update size and position
    this.currentSize = { width: newWidth, height: newHeight };
    this.updateSize(this.currentSize);

    // Update position for handles that move the element
    if ([ResizeDirection.LEFT, ResizeDirection.TOP, ResizeDirection.TOP_LEFT, 
         ResizeDirection.TOP_RIGHT, ResizeDirection.BOTTOM_LEFT].includes(this.activeHandle.direction)) {
      this.element.style.left = `${newX}px`;
      this.element.style.top = `${newY}px`;
    }

    // Update ARIA
    this.activeHandle.element.setAttribute('aria-valuenow', `${newWidth}`);

    // Emit event
    eventBus.emit(Events.RESIZE_MOVE, {
      elementId: this.element.id,
      size: this.currentSize,
      direction: this.activeHandle.direction,
    });

    // Callback
    this.options.onResizeMove?.(this.currentSize);
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.isResizing || !this.activeHandle) return;

    e.preventDefault();

    this.isResizing = false;

    // Release pointer capture
    this.activeHandle.element.releasePointerCapture(e.pointerId);

    // Remove document listeners
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('keydown', this.boundHandleKeyDown);

    // Update element state
    this.element.classList.remove('resizing');

    // Emit event
    eventBus.emit(Events.RESIZE_END, {
      elementId: this.element.id,
      size: this.currentSize,
      direction: this.activeHandle.direction,
    });

    // Callback
    this.options.onResizeEnd?.(this.currentSize);

    this.activeHandle = null;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isResizing && e.key === 'Escape') {
      this.cancelResize();
    }
  }

  private updateSize(size: Size): void {
    this.element.style.width = `${size.width}px`;
    this.element.style.height = `${size.height}px`;
  }

  private cancelResize(): void {
    if (!this.isResizing) return;

    this.isResizing = false;

    // Restore original size
    this.updateSize(this.startSize);
    this.element.style.left = `${this.elementStartPosition.x}px`;
    this.element.style.top = `${this.elementStartPosition.y}px`;

    // Clean up
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('keydown', this.boundHandleKeyDown);

    this.element.classList.remove('resizing');
    this.activeHandle = null;
  }

  public setSize(size: Size): void {
    this.updateSize(size);
  }

  public getSize(): Size {
    const rect = this.element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
    };
  }

  public setMinSize(size: Size): void {
    this.options.minSize = size;
  }

  public setMaxSize(size: Size): void {
    this.options.maxSize = size;
  }

  public enable(): void {
    this.handles.forEach(handle => {
      handle.element.addEventListener('pointerdown', this.boundHandlePointerDown);
      handle.element.style.display = 'block';
    });
  }

  public disable(): void {
    this.handles.forEach(handle => {
      handle.element.removeEventListener('pointerdown', this.boundHandlePointerDown);
      handle.element.style.display = 'none';
    });
    
    if (this.isResizing) {
      this.cancelResize();
    }
  }

  public destroy(): void {
    this.disable();
    
    // Remove handles
    this.handles.forEach(handle => {
      handle.element.remove();
    });
    this.handles = [];
    
    // Remove all event listeners
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
  }
}