import ItemGeneratorService from "../shared/Service/ItemGeneratorService";
import InventoryService from "./ServerServices/InventoryService";
import ZombieBehaviourService from "./ServerServices/Zombie/ZombieBehaviourService";
import {Players} from "@rbxts/services";

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

    public playerSetup(): void {
        Players.PlayerAdded.Connect(player => {
            print(player);
            this.zombieBehaviourService.initZombieDetectionBehaviour(player);
        });
    }
}