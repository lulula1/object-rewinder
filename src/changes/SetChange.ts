import AbstractChange from './AbstractChange';

export default class SetChange extends AbstractChange {
    private value: any;

    constructor(prevValue: any, property: string | symbol, value: any) {
        super(prevValue, property);
        this.value = value;
    }

    public forward(dataset: any): any {
        dataset[this.property] = this.value;
        return dataset;
    }

    public back(dataset: any): any {
        dataset[this.property] = this.prevValue ? JSON.parse(this.prevValue) : undefined;
        return dataset;
    }
}
