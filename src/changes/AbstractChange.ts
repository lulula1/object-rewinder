export default abstract class AbstractChange {
    protected readonly prevValue: string;
    protected readonly property: string | symbol;

    constructor(prevValue: any, property: string | symbol) {
        this.prevValue = JSON.stringify(prevValue);
        this.property = property;
    }

    public abstract forward(dataset: any): any;

    public abstract back(dataset: any): any;
}
