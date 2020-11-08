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
        // This is how to load catalog item by id. I can build humanoid
        // by getting all the part(catalog) ids.
/*        const t = InsertService.LoadAsset(3064931584) as Model;
        t.Parent = Workspace;*/
        //this.itemGenerator.initTestItems();
        this.itemGenerator.initTestItems2();
        this.inventoryService.containerIdGenerator();
        this.inventoryService.initServerEvent();
        this.zombieBehaviourService.startZombie();
    }
}