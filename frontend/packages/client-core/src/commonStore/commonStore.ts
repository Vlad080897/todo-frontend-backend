interface Store<T> {
  getItem?: (key: string) => T | null | Promise<T | null>;
  setItem?: (key: string, value: T) => void;
  removeItem?: (key: string) => void;
}

class CommonStore<T> {
  private store: Store<T>;

  constructor() {
    const state: { [key: string]: any } = {};

    this.store = {
      getItem: (key) => state[key] || null,
      setItem: (key, val) => {
        state[key] = val;
      },
      removeItem: (key) => {
        delete state[key];
      },
    };
  }

  setStore(newStore: Store<T>) {
    this.store = newStore;
  }

  getItem(key: string): T | null | Promise<T | null> {
    if (!this.store?.getItem) {
      return null;
    }

    return this.store.getItem(key) || null;
  }

  setItem(key: string, value: T) {
    if (!this.store?.setItem) {
      return;
    }

    this.store.setItem(key, value);
  }

  removeItem(key: string) {
    if (!this.store?.removeItem) {
      return;
    }

    this.store.removeItem(key);
  }
}

export default new CommonStore<string>();
