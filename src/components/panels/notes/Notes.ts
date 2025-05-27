import { Component, ComponentOptions } from '@/components/common/Component';
import { saveToLocalStorage, loadFromLocalStorage, debounce } from '@/utils';
import { eventBus } from '@/lib/EventBus';
import styles from './Notes.module.scss';

export interface NotesProps {
  autoSave?: boolean;
  autoSaveDelay?: number;
  maxLength?: number;
  placeholder?: string;
}

export class Notes extends Component<NotesProps> {
  private textarea: HTMLTextAreaElement | null = null;
  private content: string = '';
  private storageKey: string;
  private saveDebounced: () => void;
  private characterCount: HTMLElement | null = null;
  private lastSaved: HTMLElement | null = null;

  constructor(options: ComponentOptions<NotesProps> = {}) {
    super(options);
    this._props = {
      autoSave: true,
      autoSaveDelay: 1000,
      maxLength: 10000,
      placeholder: 'Enter your notes here...',
      ...this._props,
    };

    this.storageKey = `notes-${this._id}`;
    this.saveDebounced = debounce(() => this.save(), this._props.autoSaveDelay!);
  }

  protected init(): void {
    super.init();
    // Load saved content
    this.content = loadFromLocalStorage(this.storageKey, '');
  }

  render(): HTMLElement {
    const container = this.createElement('div', {
      className: styles.notes,
    });

    // Header with tools
    const header = this.renderHeader();
    container.appendChild(header);

    // Textarea
    this.textarea = this.createElement('textarea', {
      className: styles.textarea,
      attributes: {
        placeholder: this._props.placeholder,
        maxlength: this._props.maxLength?.toString(),
        'aria-label': 'Notes content',
        spellcheck: 'true',
      },
    }) as HTMLTextAreaElement;
    this.textarea.value = this.content;

    container.appendChild(this.textarea);

    // Footer with info
    const footer = this.renderFooter();
    container.appendChild(footer);

    return container;
  }

  private renderHeader(): HTMLElement {
    const header = this.createElement('div', {
      className: styles.header,
    });

    // Formatting buttons
    const formatButtons = [
      { label: 'Bold', command: 'bold', icon: 'B' },
      { label: 'Italic', command: 'italic', icon: 'I' },
      { label: 'List', command: 'list', icon: '☰' },
      { label: 'Clear', command: 'clear', icon: '🗑' },
    ];

    const buttonGroup = this.createElement('div', {
      className: styles.buttonGroup,
      attributes: {
        role: 'toolbar',
        'aria-label': 'Text formatting',
      },
    });

    formatButtons.forEach(({ label, command, icon }) => {
      const button = this.createElement('button', {
        className: styles.formatButton,
        text: icon,
        attributes: {
          type: 'button',
          'data-command': command,
          'aria-label': label,
          title: label,
        },
      });

      button.addEventListener('click', () => this.handleCommand(command));
      buttonGroup.appendChild(button);
    });

    header.appendChild(buttonGroup);

    // Save indicator
    this.lastSaved = this.createElement('span', {
      className: styles.saveIndicator,
      text: 'Saved',
    });
    header.appendChild(this.lastSaved);

    return header;
  }

  private renderFooter(): HTMLElement {
    const footer = this.createElement('div', {
      className: styles.footer,
    });

    // Character count
    this.characterCount = this.createElement('span', {
      className: styles.characterCount,
      text: `${this.content.length} / ${this._props.maxLength}`,
    });

    footer.appendChild(this.characterCount);

    return footer;
  }

  protected setupEventListeners(): void {
    if (!this.textarea) return;

    // Auto-save on input
    this.textarea.addEventListener('input', () => {
      this.content = this.textarea!.value;
      this.updateCharacterCount();
      
      if (this._props.autoSave) {
        this.saveDebounced();
        this.updateSaveIndicator('Saving...');
      }
    });

    // Save on blur
    this.textarea.addEventListener('blur', () => {
      if (this._props.autoSave) {
        this.save();
      }
    });

    // Keyboard shortcuts
    this.textarea.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            this.save();
            break;
          case 'b':
            e.preventDefault();
            this.handleCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            this.handleCommand('italic');
            break;
        }
      }
    });
  }

  private handleCommand(command: string): void {
    if (!this.textarea) return;

    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const selectedText = this.content.substring(start, end);

    switch (command) {
      case 'bold':
        this.insertText(`**${selectedText}**`, start, end);
        break;
      case 'italic':
        this.insertText(`*${selectedText}*`, start, end);
        break;
      case 'list':
        const lines = selectedText.split('\n');
        const listText = lines.map(line => `- ${line}`).join('\n');
        this.insertText(listText, start, end);
        break;
      case 'clear':
        if (confirm('Clear all notes? This cannot be undone.')) {
          this.clear();
        }
        break;
    }
  }

  private insertText(text: string, start: number, end: number): void {
    if (!this.textarea) return;

    const before = this.content.substring(0, start);
    const after = this.content.substring(end);
    
    this.content = before + text + after;
    this.textarea.value = this.content;
    
    // Set cursor position
    const newPosition = start + text.length;
    this.textarea.setSelectionRange(newPosition, newPosition);
    this.textarea.focus();
    
    // Trigger save
    if (this._props.autoSave) {
      this.saveDebounced();
    }
    
    this.updateCharacterCount();
  }

  private updateCharacterCount(): void {
    if (this.characterCount) {
      const count = this.content.length;
      const max = this._props.maxLength!;
      this.characterCount.textContent = `${count} / ${max}`;
      
      // Add warning class if near limit
      if (count > max * 0.9) {
        this.characterCount.classList.add(styles.warning);
      } else {
        this.characterCount.classList.remove(styles.warning);
      }
    }
  }

  private updateSaveIndicator(text: string): void {
    if (this.lastSaved) {
      this.lastSaved.textContent = text;
    }
  }

  private save(): void {
    try {
      saveToLocalStorage(this.storageKey, this.content);
      this.updateSaveIndicator(`Saved ${new Date().toLocaleTimeString()}`);
      
      // Emit save event
      this.emit('notes:saved', { content: this.content });
      eventBus.emit('notes:saved', {
        panelId: this._parent?.id,
        content: this.content,
      });
    } catch (error) {
      this.updateSaveIndicator('Save failed');
      console.error('Failed to save notes:', error);
    }
  }

  private clear(): void {
    this.content = '';
    if (this.textarea) {
      this.textarea.value = '';
    }
    this.save();
    this.updateCharacterCount();
  }

  update(): void {
    // Update UI based on state changes
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
    if (this.textarea) {
      this.textarea.value = content;
    }
    this.updateCharacterCount();
    if (this._props.autoSave) {
      this.save();
    }
  }

  public exportAsMarkdown(): string {
    return this.content;
  }

  public exportAsText(): string {
    // Simple markdown to text conversion
    return this.content
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1')     // Remove italic
      .replace(/^- /gm, '• ');         // Convert list markers
  }
}