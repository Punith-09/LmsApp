import { Action, action } from "easy-peasy";

export interface LoadingModel {
  isLoading: boolean;
  setLoading: Action<LoadingModel, boolean>;
}

export const loadingModel: LoadingModel = {
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
};
