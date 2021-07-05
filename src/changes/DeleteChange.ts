import AbstractChange from './AbstractChange';

export default class DeleteChange extends AbstractChange {
    constructor(target: any, property: string | symbol) {
        super(target, property);
    }

    public forward(dataset: any): any {
        delete dataset[this.property];
        return dataset;
    }
}
