import { Component } from '../../base/Component';
import { EventBus } from '../../../lib/EventBus';
import { Store } from '../../../lib/Store';
import { Character, InitiativeState } from '../../../types';
import styles from './InitiativeTracker.module.scss';

export interface InitiativeTrackerProps {
  eventBus: EventBus;
  store: Store;
  panelId: string;
}

export class InitiativeTracker extends Component {
  private eventBus: EventBus;
  private store: Store;
  private panelId: string;
  private characters: Character[] = [];
  private currentTurn: number = 0;
  private round: number = 1;
  private isRunning: boolean = false;

  constructor(props: InitiativeTrackerProps) {
    super();
    this.eventBus = props.eventBus;
    this.store = props.store;
    this.panelId = props.panelId;
    
    this.loadState();
    this.setupEventListeners();
  }

  private loadState(): void {
    const state = this.store.getState();
    const initiativeState = state.panels[this.panelId]?.data as InitiativeState;
    
    if (initiativeState) {
      this.characters = initiativeState.characters || [];
      this.currentTurn = initiativeState.currentTurn || 0;
      this.round = initiativeState.round || 1;
      this.isRunning = initiativeState.isRunning || false;
    }
  }

  private saveState(): void {
    const initiativeState: InitiativeState = {
      characters: this.characters,
      currentTurn: this.currentTurn,
      round: this.round,
      isRunning: this.isRunning
    };

    this.store.dispatch({
      type: 'UPDATE_PANEL_DATA',
      payload: {
        panelId: this.panelId,
        data: initiativeState
      }
    });
  }

  private setupEventListeners(): void {
    this.eventBus.on('theme:changed', () => this.render());
  }

  private handleAddCharacter = (): void => {
    const dialog = this.element?.querySelector(`.${styles.addDialog}`) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  private handleConfirmAdd = (): void => {
    const nameInput = this.element?.querySelector(`#character-name`) as HTMLInputElement;
    const initiativeInput = this.element?.querySelector(`#character-initiative`) as HTMLInputElement;
    const typeSelect = this.element?.querySelector(`#character-type`) as HTMLSelectElement;
    
    if (nameInput && initiativeInput) {
      const name = nameInput.value.trim();
      const initiative = parseInt(initiativeInput.value);
      const type = (typeSelect?.value || 'pc') as 'pc' | 'npc';
      
      if (name && !isNaN(initiative)) {
        const newCharacter: Character = {
          id: Date.now().toString(),
          name,
          initiative,
          type,
          conditions: [],
          notes: ''
        };
        
        this.characters.push(newCharacter);
        this.sortCharacters();
        this.saveState();
        this.render();
        
        // Reset form
        nameInput.value = '';
        initiativeInput.value = '';
        typeSelect.value = 'pc';
        
        // Close dialog
        const dialog = this.element?.querySelector(`.${styles.addDialog}`) as HTMLDialogElement;
        dialog?.close();
      }
    }
  };

  private handleCancelAdd = (): void => {
    const dialog = this.element?.querySelector(`.${styles.addDialog}`) as HTMLDialogElement;
    dialog?.close();
  };

  private handleRemoveCharacter = (id: string): void => {
    this.characters = this.characters.filter(char => char.id !== id);
    
    // Adjust current turn if necessary
    if (this.currentTurn >= this.characters.length && this.characters.length > 0) {
      this.currentTurn = 0;
    }
    
    this.saveState();
    this.render();
  };

  private handleUpdateInitiative = (id: string, value: string): void => {
    const initiative = parseInt(value);
    if (!isNaN(initiative)) {
      const character = this.characters.find(char => char.id === id);
      if (character) {
        character.initiative = initiative;
        this.sortCharacters();
        this.saveState();
        this.render();
      }
    }
  };

  private handleToggleCondition = (id: string, condition: string): void => {
    const character = this.characters.find(char => char.id === id);
    if (character) {
      const index = character.conditions.indexOf(condition);
      if (index > -1) {
        character.conditions.splice(index, 1);
      } else {
        character.conditions.push(condition);
      }
      this.saveState();
      this.render();
    }
  };

  private handleUpdateNotes = (id: string, notes: string): void => {
    const character = this.characters.find(char => char.id === id);
    if (character) {
      character.notes = notes;
      this.saveState();
    }
  };

  private handleStartCombat = (): void => {
    if (this.characters.length > 0) {
      this.isRunning = true;
      this.currentTurn = 0;
      this.round = 1;
      this.saveState();
      this.render();
      
      this.eventBus.emit('combat:started', {
        round: this.round,
        currentCharacter: this.characters[this.currentTurn]
      });
    }
  };

  private handleNextTurn = (): void => {
    if (!this.isRunning || this.characters.length === 0) return;
    
    this.currentTurn++;
    
    if (this.currentTurn >= this.characters.length) {
      this.currentTurn = 0;
      this.round++;
      
      this.eventBus.emit('combat:round-ended', {
        round: this.round - 1
      });
      
      this.eventBus.emit('combat:round-started', {
        round: this.round
      });
    }
    
    this.saveState();
    this.render();
    
    this.eventBus.emit('combat:turn-changed', {
      round: this.round,
      currentCharacter: this.characters[this.currentTurn]
    });
  };

  private handleEndCombat = (): void => {
    this.isRunning = false;
    this.currentTurn = 0;
    this.round = 1;
    this.saveState();
    this.render();
    
    this.eventBus.emit('combat:ended');
  };

  private handleClearAll = (): void => {
    if (confirm('Clear all characters? This cannot be undone.')) {
      this.characters = [];
      this.currentTurn = 0;
      this.round = 1;
      this.isRunning = false;
      this.saveState();
      this.render();
    }
  };

  private sortCharacters(): void {
    this.characters.sort((a, b) => b.initiative - a.initiative);
  }

  render(): string {
    const conditions = ['Stunned', 'Seriously Wounded', 'Mortally Wounded', 'Unconscious', 'Dead'];
    
    return `
      <div class="${styles.initiativeTracker}">
        <div class="${styles.header}">
          <h3 class="${styles.title}">Initiative Tracker</h3>
          <div class="${styles.combatStatus}">
            ${this.isRunning ? `
              <span class="${styles.round}">Round ${this.round}</span>
              <button class="${styles.actionButton} ${styles.nextTurn}" data-action="next-turn">
                Next Turn →
              </button>
              <button class="${styles.actionButton} ${styles.endCombat}" data-action="end-combat">
                End Combat
              </button>
            ` : `
              <button class="${styles.actionButton} ${styles.startCombat}" data-action="start-combat" 
                      ${this.characters.length === 0 ? 'disabled' : ''}>
                Start Combat
              </button>
            `}
          </div>
        </div>

        <div class="${styles.controls}">
          <button class="${styles.addButton}" data-action="add-character">
            + Add Character
          </button>
          <button class="${styles.clearButton}" data-action="clear-all" 
                  ${this.characters.length === 0 ? 'disabled' : ''}>
            Clear All
          </button>
        </div>

        <div class="${styles.characterList}">
          ${this.characters.length === 0 ? `
            <div class="${styles.emptyState}">
              <p>No characters added yet.</p>
              <p>Click "Add Character" to begin.</p>
            </div>
          ` : this.characters.map((char, index) => `
            <div class="${styles.character} ${index === this.currentTurn && this.isRunning ? styles.active : ''} ${styles[char.type]}">
              <div class="${styles.characterHeader}">
                <div class="${styles.characterInfo}">
                  <span class="${styles.characterName}">${char.name}</span>
                  <span class="${styles.characterType}">${char.type.toUpperCase()}</span>
                </div>
                <div class="${styles.initiativeControl}">
                  <label class="${styles.initiativeLabel}">Initiative:</label>
                  <input type="number" 
                         class="${styles.initiativeInput}" 
                         value="${char.initiative}"
                         data-action="update-initiative"
                         data-id="${char.id}">
                </div>
                <button class="${styles.removeButton}" 
                        data-action="remove-character" 
                        data-id="${char.id}">
                  ×
                </button>
              </div>
              
              <div class="${styles.characterBody}">
                <div class="${styles.conditions}">
                  ${conditions.map(condition => `
                    <label class="${styles.condition}">
                      <input type="checkbox" 
                             data-action="toggle-condition"
                             data-id="${char.id}"
                             data-condition="${condition}"
                             ${char.conditions.includes(condition) ? 'checked' : ''}>
                      <span>${condition}</span>
                    </label>
                  `).join('')}
                </div>
                
                <textarea class="${styles.notes}" 
                          placeholder="Notes..."
                          data-action="update-notes"
                          data-id="${char.id}">${char.notes || ''}</textarea>
              </div>
            </div>
          `).join('')}
        </div>

        <dialog class="${styles.addDialog}">
          <form class="${styles.addForm}">
            <h4>Add Character</h4>
            
            <div class="${styles.formGroup}">
              <label for="character-name">Name:</label>
              <input type="text" id="character-name" required>
            </div>
            
            <div class="${styles.formGroup}">
              <label for="character-initiative">Initiative:</label>
              <input type="number" id="character-initiative" required>
            </div>
            
            <div class="${styles.formGroup}">
              <label for="character-type">Type:</label>
              <select id="character-type">
                <option value="pc">PC</option>
                <option value="npc">NPC</option>
              </select>
            </div>
            
            <div class="${styles.dialogActions}">
              <button type="button" class="${styles.cancelButton}" data-action="cancel-add">
                Cancel
              </button>
              <button type="button" class="${styles.confirmButton}" data-action="confirm-add">
                Add
              </button>
            </div>
          </form>
        </dialog>
      </div>
    `;
  }

  mount(element: HTMLElement): void {
    super.mount(element);
    
    // Add character button
    const addButton = element.querySelector('[data-action="add-character"]');
    addButton?.addEventListener('click', this.handleAddCharacter);
    
    // Dialog buttons
    const confirmButton = element.querySelector('[data-action="confirm-add"]');
    confirmButton?.addEventListener('click', this.handleConfirmAdd);
    
    const cancelButton = element.querySelector('[data-action="cancel-add"]');
    cancelButton?.addEventListener('click', this.handleCancelAdd);
    
    // Combat controls
    const startButton = element.querySelector('[data-action="start-combat"]');
    startButton?.addEventListener('click', this.handleStartCombat);
    
    const nextButton = element.querySelector('[data-action="next-turn"]');
    nextButton?.addEventListener('click', this.handleNextTurn);
    
    const endButton = element.querySelector('[data-action="end-combat"]');
    endButton?.addEventListener('click', this.handleEndCombat);
    
    const clearButton = element.querySelector('[data-action="clear-all"]');
    clearButton?.addEventListener('click', this.handleClearAll);
    
    // Character controls
    element.querySelectorAll('[data-action="remove-character"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id;
        if (id) this.handleRemoveCharacter(id);
      });
    });
    
    element.querySelectorAll('[data-action="update-initiative"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const id = target.dataset.id;
        if (id) this.handleUpdateInitiative(id, target.value);
      });
    });
    
    element.querySelectorAll('[data-action="toggle-condition"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const id = target.dataset.id;
        const condition = target.dataset.condition;
        if (id && condition) this.handleToggleCondition(id, condition);
      });
    });
    
    element.querySelectorAll('[data-action="update-notes"]').forEach(textarea => {
      textarea.addEventListener('input', (e) => {
        const target = e.target as HTMLTextAreaElement;
        const id = target.dataset.id;
        if (id) this.handleUpdateNotes(id, target.value);
      });
    });
  }

  unmount(): void {
    // Event listeners are automatically cleaned up by replacing innerHTML
    super.unmount();
  }
}