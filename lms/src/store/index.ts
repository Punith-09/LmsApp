import { createStore, action, Action, StoreProvider, persist } from 'easy-peasy';

type AuthModel = {
  user: any | null;
  setUser: Action<AuthModel, any>;
};

type LoadingModel = {
  isLoading: boolean;
  setLoading: Action<LoadingModel, boolean>;
};

type CartModel = {
  items: string[]; 
  addToCart: Action<CartModel, string>;
  removeFromCart: Action<CartModel, string>;
  clearCart: Action<CartModel, void>;
};


type StoreModel = {
  auth: AuthModel;
  loading: LoadingModel;
  cart: CartModel;
};

const model: StoreModel = {
  auth: persist({
    user: null,
    setUser: action((state, payload) => {
      state.user = payload;
    }),
  }),
  loading: {
    isLoading: false,
    setLoading: action((state, payload) => {
      state.isLoading = payload;
    }),
  },
  cart: persist({
    items: [],
    addToCart: action((state, courseId) => {
      if (!state.items.includes(courseId)) {
        state.items.push(courseId);
      }
    }),
    removeFromCart: action((state, courseId) => {
      state.items = state.items.filter((id) => id !== courseId);
    }),
    clearCart: action((state) => {
      state.items = [];
    }),
  }),
};

const store = createStore(model);

export { store, StoreProvider };
