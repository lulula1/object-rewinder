import AbstractChange from './AbstractChange';

export default class SetChange extends AbstractChange {
    private value: any;

    constructor(target: any, property: string | symbol, value: any) {
        super(target, property);
        this.value = value;
    }

    public forward(dataset: any): any {
        dataset[this.property] = this.value;
        return dataset;
    }
}
