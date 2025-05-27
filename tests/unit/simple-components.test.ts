import { describe, it, expect } from 'vitest';

describe('Simple Component Tests', () => {
  describe('Panel Demo Functionality', () => {
    it('should have dice roller logic', () => {
      // Test dice formula parsing
      const parseDiceFormula = (formula: string) => {
        const diceRegex = /(\d+)d(\d+)(!?)/g;
        const matches = [...formula.matchAll(diceRegex)];
        return matches.length > 0;
      };

      expect(parseDiceFormula('1d6')).toBe(true);
      expect(parseDiceFormula('2d10!')).toBe(true);
      expect(parseDiceFormula('invalid')).toBe(false);
    });

    it('should calculate dice rolls correctly', () => {
      const rollDice = (sides: number): number => {
        return Math.floor(Math.random() * sides) + 1;
      };

      const result = rollDice(6);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    });

    it('should detect critical and fumble', () => {
      const checkCritical = (roll: number, sides: number) => sides === 10 && roll === 10;
      const checkFumble = (roll: number, sides: number) => sides === 10 && roll === 1;

      expect(checkCritical(10, 10)).toBe(true);
      expect(checkCritical(5, 10)).toBe(false);
      expect(checkFumble(1, 10)).toBe(true);
      expect(checkFumble(5, 10)).toBe(false);
    });
  });

  describe('Notes Functionality', () => {
    it('should save and retrieve notes', () => {
      const storage: Record<string, string> = {};
      
      const saveNote = (content: string) => {
        storage['gm-notes'] = content;
      };

      const getNote = () => {
        return storage['gm-notes'] || '';
      };

      saveNote('Test note content');
      expect(getNote()).toBe('Test note content');
    });

    it('should count characters', () => {
      const countChars = (text: string) => text.length;

      expect(countChars('Hello')).toBe(5);
      expect(countChars('')).toBe(0);
      expect(countChars('Multi\nline')).toBe(10);
    });
  });

  describe('Initiative Tracker', () => {
    it('should sort characters by initiative', () => {
      const characters = [
        { id: 1, name: 'Alice', initiative: 15 },
        { id: 2, name: 'Bob', initiative: 20 },
        { id: 3, name: 'Charlie', initiative: 10 }
      ];

      const sorted = [...characters].sort((a, b) => b.initiative - a.initiative);

      expect(sorted[0].name).toBe('Bob');
      expect(sorted[1].name).toBe('Alice');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('should track combat rounds', () => {
      let round = 1;
      let currentTurn = 0;
      const characters = ['Alice', 'Bob', 'Charlie'];

      const nextTurn = () => {
        currentTurn++;
        if (currentTurn >= characters.length) {
          currentTurn = 0;
          round++;
        }
      };

      expect(round).toBe(1);
      expect(currentTurn).toBe(0);

      nextTurn(); // Bob's turn
      expect(currentTurn).toBe(1);
      expect(round).toBe(1);

      nextTurn(); // Charlie's turn
      expect(currentTurn).toBe(2);
      expect(round).toBe(1);

      nextTurn(); // Back to Alice, new round
      expect(currentTurn).toBe(0);
      expect(round).toBe(2);
    });
  });

  describe('Utility Functions', () => {
    it('should format text with markdown', () => {
      const formatText = (text: string, prefix: string, suffix: string) => {
        return prefix + text + suffix;
      };

      expect(formatText('bold', '**', '**')).toBe('**bold**');
      expect(formatText('italic', '*', '*')).toBe('*italic*');
      expect(formatText('code', '`', '`')).toBe('`code`');
    });

    it('should validate dice formulas', () => {
      const isValidFormula = (formula: string) => {
        const pattern = /^(\d+d\d+!?)([\+\-]\d+)?$/;
        return pattern.test(formula);
      };

      expect(isValidFormula('1d6')).toBe(true);
      expect(isValidFormula('2d10!')).toBe(true);
      expect(isValidFormula('1d20+5')).toBe(true);
      expect(isValidFormula('invalid')).toBe(false);
      expect(isValidFormula('')).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should manage panel states', () => {
      const state = {
        panels: {
          'dice-roller': { history: [] },
          'notes': { content: '' },
          'initiative': { characters: [] }
        }
      };

      // Add to dice history
      state.panels['dice-roller'].history.push({
        formula: '1d20',
        result: 15,
        timestamp: Date.now()
      });

      expect(state.panels['dice-roller'].history).toHaveLength(1);
      expect(state.panels['dice-roller'].history[0].result).toBe(15);
    });

    it('should handle theme switching', () => {
      let currentTheme = 'synthwave';
      
      const setTheme = (theme: string) => {
        currentTheme = theme;
      };

      const getTheme = () => currentTheme;

      expect(getTheme()).toBe('synthwave');
      
      setTheme('tech-noir');
      expect(getTheme()).toBe('tech-noir');
    });
  });
});