export default class Example {
    private readonly prString: string;
    private prNumber: number | undefined;
    public puString: string | undefined;

    constructor(prString: string) {
        this.prString = prString;
    }

    public getPrString(): string {
        return this.prString;
    }

    public getPuString(): string {
        return <string>this.puString;
    }

    public setPuString(puString: string): void {
        this.puString = puString;
    }

    public getPrNumber(): number {
        return <number>this.prNumber;
    }

    public setPrNumber(prNumber: number): void {
        this.prNumber = prNumber;
    }
}