export default abstract class AbstractChange {
    protected readonly prevValue: string;
    protected readonly prevValueExists: boolean;
    protected readonly property: string | symbol;

    constructor(target: any, property: string | symbol) {
        this.prevValue = JSON.stringify(target[property]);
        this.prevValueExists = property in target;
        this.property = property;
    }

    public abstract forward(dataset: any): any;

    public back(dataset: any): any {
        if (!this.prevValueExists)
            delete dataset[this.property];
        else
            dataset[this.property] = this.prevValue ? JSON.parse(this.prevValue) : undefined;
        return dataset;
    }
}
