interface Store {
  getItem?: (key: string) => string | null | Promise<string | null>,
  setItem?: (key: string, value: string) => void,
  removeItem?: (key: string) => void
}


class CommonStore {
  private store: Store

  constructor() {
    const state: { [key: string]: string } = {};

    // this.store = {
    //   getItem(key: string) {
    //     return state[key];
    //   },
    //   setItem(key: string, value: string) {
    //     return state[key] = value;
    //   },
    //   removeItem(key: string) {
    //     return delete state[key];
    //   }
    // }
    this.store = {}
  }

  setStore(store: Store) {
    this.store = store
  }

  setItem(key: string, value: string) {
    if (!this.store.setItem) {
      return;
    }
    this.store.setItem(key, value);
  }
  getItem(key: string): string | null | Promise<string | null> {
    if (!this.store.getItem) {
      return null;
    }
    const value = this.store.getItem(key)
    return value;
  }
  removeItem(key: string): void | null {
    if (!this.store.removeItem) {
      return null;
    };
    this.store.removeItem(key)
  }
}

export default new CommonStore