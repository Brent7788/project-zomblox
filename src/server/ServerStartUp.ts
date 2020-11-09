import ItemGeneratorService from "../shared/Service/ItemGeneratorService";
import InventoryService from "./ServerServices/InventoryService";
import ZombieBehaviourService from "./ServerServices/Zombie/ZombieBehaviourService";

export default class ServerStartUp {
    private readonly itemGenerator: ItemGeneratorService;
    private readonly inventoryService: InventoryService;
    private readonly zombieBehaviourService: ZombieBehaviourService;

    constructor() {
        this.itemGenerator = new ItemGeneratorService();
        this.inventoryService = new InventoryService();
        this.zombieBehaviourService = new ZombieBehaviourService();
    }

    public start(): void {
        this.itemGenerator.initTestItems2();
        this.inventoryService.containerIdGenerator();
        this.inventoryService.initServerEvent();
        this.zombieBehaviourService.initZombie();
    }
}