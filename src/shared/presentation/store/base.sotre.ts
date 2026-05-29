export interface BaseStore<TState, TActions> {
  state: TState;
  actions: TActions;
}
