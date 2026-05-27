export interface IStore<TState, TActions> {
  state: TState;
  actions: TActions;
}
