import AbstractChange from './AbstractChange';

export default class DeleteChange extends AbstractChange {
    constructor(prevValue: any, property: string | symbol) {
        super(prevValue, property);
    }

    public forward(dataset: any): any {
        delete dataset[this.property];
        return dataset;
    }

    public back(dataset: any): any {
        dataset[this.property] = this.prevValue ? JSON.parse(this.prevValue) : undefined;
        return dataset;
    }
}
