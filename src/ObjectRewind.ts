import IObjectRewind, { State } from './IObjectRewind';
import AbstractChange from './changes/AbstractChange';
import SetChange from './changes/SetChange';
import DeleteChange from './changes/DeleteChange';

export default class ObjectRewind implements IObjectRewind {
    private readonly dataset: any;
    private readonly proxy: ProxyConstructor;
    private state: State = 0;
    private maxState: State = 0;
    private readonly changeStack: AbstractChange[] = [];

    constructor(dataset: object) {
        this.dataset = dataset;
        this.proxy = new Proxy(this.dataset, this.handler)
    }

    private get handler(): ProxyHandler<any> {
        return {
            get: this.handleGet.bind(this),
            set: this.handleSet.bind(this),
            deleteProperty: this.handleDelete.bind(this),
        };
    }

    private pushChange(newChange: AbstractChange): void {
        this.changeStack[this.state++] = newChange;
        this.maxState = this.state;
    }

    private forwardSteps(changes: AbstractChange[]) {
        for (let change of changes)
            change.forward(this.dataset);
        this.state += changes.length;
        if (this.state > this.maxState)
            throw new Error('invalid state value')
    }

    private rewindSteps(changes: AbstractChange[]) {
        for (let change of changes)
            change.back(this.dataset);
        this.state -= changes.length;
        if (this.state < 0)
            throw new Error('invalid state value')
    }

    private handleGet(target: any, property: string | symbol): any {
        let value = target[property];
        if (typeof value !== 'object')
            return value;
        return new Proxy(value, this.handler);
    }

    private handleSet(target: any, property: string | symbol, value: any): boolean {
        this.pushChange(new SetChange(target[property], property, value));
        target[property] = JSON.parse(JSON.stringify(value));
        return true;
    }

    private handleDelete(target: any, property: string | symbol): boolean {
        this.pushChange(new DeleteChange(target[property], property));
        delete target[property];
        return true;
    }

    public getObject(): ProxyConstructor {
        return this.proxy;
    }

    public back(): void {
        this.go(-1);
    }

    public forward(): void {
        this.go(1);
    }

    public go(delta: number): void {
        let newState = Math.max(0, Math.min(this.state + delta, this.maxState));
        if (newState > this.state) { // Forward
            this.forwardSteps(this.changeStack.slice(this.state, newState));
        } else if (newState < this.state) { // Back
            this.rewindSteps(this.changeStack.slice(newState, this.state).reverse());
        }
        this.state = newState;
    }

    public saveState(): State {
        return this.state;
    }

    public loadState(state: State): void {
        if (state >= 0 && state <= this.maxState)
            this.go(state - this.state);
    }
}
