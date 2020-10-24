import ItemGeneratorService from "../shared/Service/ItemGeneratorService";


export default class ServerStartUp {
    private readonly itemGenerator: ItemGeneratorService;

    constructor() {
        this.itemGenerator = new ItemGeneratorService();
    }

    public start(): void {
        this.itemGenerator.initTestItems();
    }
}