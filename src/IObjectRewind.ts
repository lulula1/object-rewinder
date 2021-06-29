export type State = number;

export default interface IObjectRewind {
    getObject(): ProxyConstructor;
    back(): void;
    forward(): void;
    go(delta: number): void;
    saveState(): State;
    loadState(state: State): void;
}
