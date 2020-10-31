import ItemGeneratorService from "../shared/Service/ItemGeneratorService";
import InventoryService from "./ServerServices/InventoryService";
import {Workspace} from "@rbxts/services";

export default class ServerStartUp {
    private readonly itemGenerator: ItemGeneratorService;
    private readonly inventoryService: InventoryService;

    constructor() {
        this.itemGenerator = new ItemGeneratorService();
        this.inventoryService = new InventoryService();
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
    }
}