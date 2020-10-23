import ItemGenerator from "../shared/Service/ItemGenerator";


export default class ServerStartUp {
    private readonly itemGenerator: ItemGenerator;

    constructor() {
        this.itemGenerator = new ItemGenerator();
    }

    public start(): void {
        this.itemGenerator.initTestItems();
    }
}