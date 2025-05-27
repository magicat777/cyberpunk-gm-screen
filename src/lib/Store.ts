import { DeepPartial, Unsubscribe } from '@/types';
import { eventBus, Events } from './EventBus';

export type StateListener<T> = (state: T, prevState: T) => void;
export type Selector<T, R> = (state: T) => R;
export type Reducer<T> = (state: T, action: Action) => T;
export type Middleware<T> = (store: Store<T>) => (next: Dispatch) => (action: Action) => any;
export type Dispatch = (action: Action) => void;

export interface Action {
  type: string;
  payload?: any;
}

export interface StoreOptions<T> {
  initialState: T;
  reducer?: Reducer<T>;
  middleware?: Middleware<T>[];
  persist?: PersistOptions;
}

export interface PersistOptions {
  key: string;
  storage?: Storage;
  serialize?: (state: any) => string;
  deserialize?: (data: string) => any;
  whitelist?: string[];
  blacklist?: string[];
}

export class Store<T = any> {
  private state: T;
  private prevState: T;
  private listeners: Set<StateListener<T>> = new Set();
  private reducer?: Reducer<T>;
  private middleware: Middleware<T>[] = [];
  private dispatch: Dispatch;
  private persistOptions?: PersistOptions;

  constructor(options: StoreOptions<T>) {
    this.state = { ...options.initialState };
    this.prevState = { ...options.initialState };
    this.reducer = options.reducer;
    this.middleware = options.middleware || [];
    this.persistOptions = options.persist;

    // Set up dispatch with middleware
    this.dispatch = this.createDispatch();

    // Load persisted state
    if (this.persistOptions) {
      this.loadPersistedState();
    }
  }

  /**
   * Get the current state
   */
  getState(): T {
    return { ...this.state };
  }

  /**
   * Set state directly (use with caution)
   */
  setState(updates: DeepPartial<T> | ((state: T) => DeepPartial<T>)): void {
    this.prevState = { ...this.state };

    if (typeof updates === 'function') {
      const newUpdates = updates(this.state);
      this.state = this.deepMerge(this.state, newUpdates);
    } else {
      this.state = this.deepMerge(this.state, updates);
    }

    this.notifyListeners();
    this.persistState();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener<T>): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to specific state slice
   */
  subscribeToSlice<R>(
    selector: Selector<T, R>,
    listener: (slice: R, prevSlice: R) => void
  ): Unsubscribe {
    let previousSlice = selector(this.state);

    const wrappedListener: StateListener<T> = (state, prevState) => {
      const currentSlice = selector(state);
      const prevSlice = selector(prevState);

      if (!this.shallowEqual(currentSlice, prevSlice)) {
        listener(currentSlice, previousSlice);
        previousSlice = currentSlice;
      }
    };

    return this.subscribe(wrappedListener);
  }

  /**
   * Dispatch an action (if reducer is provided)
   */
  dispatchAction(action: Action): void {
    if (!this.reducer) {
      throw new Error('No reducer provided to handle actions');
    }
    this.dispatch(action);
  }

  /**
   * Create dispatch function with middleware
   */
  private createDispatch(): Dispatch {
    let dispatch: Dispatch = (action: Action) => {
      if (this.reducer) {
        this.prevState = { ...this.state };
        this.state = this.reducer(this.state, action);
        this.notifyListeners();
        this.persistState();
      }
    };

    // Apply middleware
    this.middleware.reverse().forEach(mw => {
      dispatch = mw(this)(dispatch);
    });

    return dispatch;
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state, this.prevState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });

    // Emit state change event
    eventBus.emit('store:stateChange', {
      state: this.state,
      prevState: this.prevState,
    });
  }

  /**
   * Persist state to storage
   */
  private persistState(): void {
    if (!this.persistOptions) return;

    const { key, storage = localStorage, serialize = JSON.stringify, whitelist, blacklist } =
      this.persistOptions;

    try {
      let stateToPersist = this.state;

      // Apply whitelist/blacklist
      if (whitelist) {
        stateToPersist = whitelist.reduce((acc, key) => {
          if (key in this.state) {
            (acc as any)[key] = this.state[key];
          }
          return acc;
        }, {} as T);
      } else if (blacklist) {
        stateToPersist = { ...this.state };
        blacklist.forEach(key => {
          delete (stateToPersist as any)[key];
        });
      }

      storage.setItem(key, serialize(stateToPersist));
    } catch (error) {
      console.error('Error persisting state:', error);
    }
  }

  /**
   * Load persisted state from storage
   */
  private loadPersistedState(): void {
    if (!this.persistOptions) return;

    const { key, storage = localStorage, deserialize = JSON.parse } = this.persistOptions;

    try {
      const persistedData = storage.getItem(key);
      if (persistedData) {
        const persistedState = deserialize(persistedData);
        this.state = this.deepMerge(this.state, persistedState);
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  }

  /**
   * Deep merge objects
   */
  private deepMerge(target: any, source: any): any {
    if (!source) return target;

    const output = { ...target };

    Object.keys(source).forEach(key => {
      if (source[key] === undefined) return;

      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] !== null &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        output[key] = this.deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    });

    return output;
  }

  /**
   * Shallow equality check
   */
  private shallowEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => a[key] === b[key]);
  }
}

// Middleware examples

/**
 * Logger middleware
 */
export const loggerMiddleware: Middleware<any> = store => next => action => {
  console.group(`Action: ${action.type}`);
  console.log('Prev State:', store.getState());
  console.log('Action:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};

/**
 * Thunk middleware for async actions
 */
export const thunkMiddleware: Middleware<any> = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatchAction.bind(store), store.getState.bind(store));
  }
  return next(action as Action);
};

/**
 * Event emitter middleware
 */
export const eventMiddleware: Middleware<any> = store => next => action => {
  const result = next(action);
  eventBus.emit(`action:${action.type}`, {
    action,
    state: store.getState(),
  });
  return result;
};