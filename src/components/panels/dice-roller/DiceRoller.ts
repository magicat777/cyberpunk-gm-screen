import { Component, ComponentOptions } from '@/components/common/Component';
import { DiceRoll } from '@/types';
import { generateId } from '@/utils';
import { eventBus } from '@/lib/EventBus';
import styles from './DiceRoller.module.scss';

export interface DiceRollerProps {
  maxHistory?: number;
  soundEnabled?: boolean;
}

interface DiceRollerState {
  rolls: DiceRoll[];
  currentFormula: string;
  isRolling: boolean;
}

export class DiceRoller extends Component<DiceRollerProps> {
  private rollHistory: DiceRoll[] = [];
  private formulaInput: HTMLInputElement | null = null;
  private quickDiceButtons = [
    { label: 'd4', formula: '1d4' },
    { label: 'd6', formula: '1d6' },
    { label: 'd8', formula: '1d8' },
    { label: 'd10', formula: '1d10' },
    { label: 'd12', formula: '1d12' },
    { label: 'd20', formula: '1d20' },
    { label: 'd100', formula: '1d100' },
    { label: '2d6', formula: '2d6' },
    { label: '3d6', formula: '3d6' },
  ];

  constructor(options: ComponentOptions<DiceRollerProps> = {}) {
    super(options);
    this._props = {
      maxHistory: 20,
      soundEnabled: true,
      ...this._props,
    };
  }

  render(): HTMLElement {
    const container = this.createElement('div', {
      className: styles.diceRoller,
    });

    // Formula input section
    const inputSection = this.renderInputSection();
    container.appendChild(inputSection);

    // Quick dice buttons
    const quickButtons = this.renderQuickButtons();
    container.appendChild(quickButtons);

    // Roll history
    const history = this.renderHistory();
    container.appendChild(history);

    return container;
  }

  private renderInputSection(): HTMLElement {
    const section = this.createElement('div', {
      className: styles.inputSection,
    });

    // Formula input
    this.formulaInput = this.createElement('input', {
      className: styles.formulaInput,
      attributes: {
        type: 'text',
        placeholder: 'Enter dice formula (e.g., 2d6+3)',
        'aria-label': 'Dice formula',
      },
    }) as HTMLInputElement;

    // Roll button
    const rollButton = this.createElement('button', {
      className: styles.rollButton,
      text: 'Roll',
      attributes: {
        type: 'button',
        'aria-label': 'Roll dice',
      },
    });

    section.appendChild(this.formulaInput);
    section.appendChild(rollButton);

    // Event listeners
    rollButton.addEventListener('click', () => this.rollFromInput());
    this.formulaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.rollFromInput();
      }
    });

    return section;
  }

  private renderQuickButtons(): HTMLElement {
    const container = this.createElement('div', {
      className: styles.quickButtons,
      attributes: {
        role: 'group',
        'aria-label': 'Quick dice buttons',
      },
    });

    this.quickDiceButtons.forEach(({ label, formula }) => {
      const button = this.createElement('button', {
        className: styles.quickButton,
        text: label,
        attributes: {
          type: 'button',
          'data-formula': formula,
          'aria-label': `Roll ${formula}`,
        },
      });

      button.addEventListener('click', () => this.roll(formula));
      container.appendChild(button);
    });

    return container;
  }

  private renderHistory(): HTMLElement {
    const container = this.createElement('div', {
      className: styles.history,
      attributes: {
        role: 'log',
        'aria-label': 'Dice roll history',
        'aria-live': 'polite',
      },
    });

    const header = this.createElement('h4', {
      className: styles.historyHeader,
      text: 'Roll History',
    });

    const list = this.createElement('div', {
      className: styles.historyList,
      attributes: {
        id: `dice-history-${this._id}`,
      },
    });

    container.appendChild(header);
    container.appendChild(list);

    return container;
  }

  private rollFromInput(): void {
    if (!this.formulaInput) return;

    const formula = this.formulaInput.value.trim();
    if (formula) {
      this.roll(formula);
      this.formulaInput.value = '';
    }
  }

  private roll(formula: string): void {
    if (this._state.isRolling) return;

    this.setState({ isRolling: true });

    try {
      const result = this.evaluateDiceFormula(formula);
      const roll: DiceRoll = {
        id: generateId('roll'),
        formula,
        results: result.rolls,
        total: result.total,
        timestamp: new Date(),
        critical: result.critical,
        fumble: result.fumble,
      };

      // Add to history
      this.rollHistory.unshift(roll);
      if (this.rollHistory.length > this._props.maxHistory!) {
        this.rollHistory = this.rollHistory.slice(0, this._props.maxHistory);
      }

      // Update display
      this.updateHistory();

      // Play sound if enabled
      if (this._props.soundEnabled) {
        this.playDiceSound();
      }

      // Emit event
      this.emit('dice:rolled', roll);
      eventBus.emit('dice:rolled', roll);

      // Animate result
      this.animateRoll(roll);

    } catch (error) {
      this.showError(`Invalid dice formula: ${formula}`);
    }

    this.setState({ isRolling: false });
  }

  private evaluateDiceFormula(formula: string): {
    rolls: number[];
    total: number;
    critical?: boolean;
    fumble?: boolean;
  } {
    // Parse dice formula (e.g., "2d6+3", "1d20-2", "3d8")
    const regex = /(\d+)d(\d+)([+-]\d+)?/gi;
    const matches = formula.matchAll(regex);
    
    let totalRolls: number[] = [];
    let total = 0;
    let hasCritical = false;
    let hasFumble = false;

    for (const match of matches) {
      const count = parseInt(match[1], 10);
      const sides = parseInt(match[2], 10);
      const modifier = match[3] ? parseInt(match[3], 10) : 0;

      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        totalRolls.push(roll);
        total += roll;

        // Check for critical/fumble on d20
        if (sides === 20) {
          if (roll === 20) hasCritical = true;
          if (roll === 1) hasFumble = true;
        }
      }

      total += modifier;
    }

    // If no dice formula found, try to evaluate as a constant
    if (totalRolls.length === 0) {
      const constantValue = parseInt(formula, 10);
      if (!isNaN(constantValue)) {
        totalRolls.push(constantValue);
        total = constantValue;
      } else {
        throw new Error('Invalid formula');
      }
    }

    return {
      rolls: totalRolls,
      total,
      critical: hasCritical,
      fumble: hasFumble,
    };
  }

  private updateHistory(): void {
    const historyList = this.query(`#dice-history-${this._id}`);
    if (!historyList) return;

    historyList.innerHTML = '';

    this.rollHistory.forEach((roll, index) => {
      const entry = this.createElement('div', {
        className: `${styles.historyEntry} ${
          roll.critical ? styles.critical : ''
        } ${roll.fumble ? styles.fumble : ''}`,
        attributes: {
          'data-roll-id': roll.id,
        },
      });

      // Timestamp
      const time = this.createElement('span', {
        className: styles.timestamp,
        text: roll.timestamp.toLocaleTimeString(),
      });

      // Formula
      const formula = this.createElement('span', {
        className: styles.formula,
        text: roll.formula,
      });

      // Results
      const results = this.createElement('span', {
        className: styles.results,
        text: `[${roll.results.join(', ')}]`,
      });

      // Total
      const total = this.createElement('span', {
        className: styles.total,
        text: `= ${roll.total}`,
      });

      entry.appendChild(time);
      entry.appendChild(formula);
      entry.appendChild(results);
      entry.appendChild(total);

      if (roll.critical) {
        const critLabel = this.createElement('span', {
          className: styles.critLabel,
          text: 'CRIT!',
        });
        entry.appendChild(critLabel);
      }

      if (roll.fumble) {
        const fumbleLabel = this.createElement('span', {
          className: styles.fumbleLabel,
          text: 'FUMBLE!',
        });
        entry.appendChild(fumbleLabel);
      }

      // Add click to reroll
      entry.addEventListener('click', () => {
        if (this.formulaInput) {
          this.formulaInput.value = roll.formula;
          this.formulaInput.focus();
        }
      });

      historyList.appendChild(entry);
    });
  }

  private animateRoll(roll: DiceRoll): void {
    const historyList = this.query(`#dice-history-${this._id}`);
    if (!historyList) return;

    const firstEntry = historyList.firstElementChild;
    if (firstEntry) {
      firstEntry.classList.add(styles.newRoll);
      setTimeout(() => {
        firstEntry.classList.remove(styles.newRoll);
      }, 1000);
    }
  }

  private playDiceSound(): void {
    // In a real implementation, this would play an audio file
    // For now, we'll just use the Web Audio API for a simple sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Could not play dice sound:', error);
    }
  }

  private showError(message: string): void {
    // Create error notification
    const error = this.createElement('div', {
      className: styles.error,
      text: message,
    });

    if (this._element) {
      this._element.appendChild(error);
      setTimeout(() => error.remove(), 3000);
    }
  }

  update(): void {
    // Update UI based on state changes
  }

  public clearHistory(): void {
    this.rollHistory = [];
    this.updateHistory();
  }

  public exportHistory(): string {
    return JSON.stringify(this.rollHistory, null, 2);
  }
}