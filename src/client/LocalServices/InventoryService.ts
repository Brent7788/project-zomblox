import PlayerInventory from "../LocalModules/Inventory/PlayerInventory";
import OtherInventory from "../LocalModules/Inventory/OtherInventory";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import Item from "../LocalModules/Inventory/Item";
import RegionService from "../../shared/Service/RegionService";
import {Players, ReplicatedStorage} from "@rbxts/services";
import ItemGeneratorService from "../../shared/Service/ItemGeneratorService";
import OtherContainers from "../LocalModules/Inventory/OtherContainers";
import Container from "../LocalModules/Inventory/Container";
import ItemValue from "../../shared/Modules/ItemValue";
import ContainerItem from "../LocalModules/Inventory/ContainerItem";


export default class InventoryService {

    private playerInventory: PlayerInventory;
    private otherInventory: OtherInventory;
    private otherContainers: OtherContainers;
    private readonly regionService: RegionService;
    private inventoryItemEvents: RemoteEvent;
    private playerViewingWaitContainer: string | undefined;
    private disconnectInventoryItemEvents: RBXScriptConnection | undefined;

    constructor() {
        this.playerInventory = new PlayerInventory(Players.LocalPlayer);
        this.otherInventory = new OtherInventory(Players.LocalPlayer);
        this.otherContainers = new OtherContainers(Players.LocalPlayer);
        this.regionService = new RegionService();
        this.inventoryItemEvents = ReplicatedStorage.WaitForChild(FileNames.INVENTORY_ITEM_EVENTS) as RemoteEvent;
    }

    public toggleInventory(): void {
        this.playerInventory.playerInventoryScreen.Enabled = !this.playerInventory.playerInventoryScreen.Enabled;
    }

    public onInventoryOpen() {
        //TODO baseParts must be all container parts
        let baseParts: BasePart[] = [];
        const basePartAdded: BasePart[] = [];
        const basePartPreAdded: BasePart[] = [];
        const firstTimeCreate = true;

        while (this.playerInventory.playerInventoryScreen.Enabled) {
            wait(0.1);

            if (baseParts.size() === 0) {
                baseParts = this.findBasePartInRegion();
            } else {
                this.testRegionGenerateItem(baseParts);
            }
        }
    }

    // TODO Find only container base parts
    private findBasePartInRegion(): BasePart[] {
        const allInstanceInRegion = this.regionService.FindPartsInRegion3(1000);
        let player: Player | undefined = undefined;
        const baseParts: Array<BasePart> = [];
        allInstanceInRegion.forEach((basePart) => {
            const human = basePart.Parent?.FindFirstChild(FileNames.HUMANOID)
            const isPart = basePart.IsA(FileNames.PART);
            if (human !== undefined) {
                player = Players.GetPlayerFromCharacter(basePart.Parent);
            } else if (isPart) {
                const containerId = basePart.FindFirstChild(FileNames.ID) as StringValue;

                //Add only container parts
                if (this.isNotNull(containerId)) {
                    baseParts.push(basePart);
                }
            }
        });
        return player !== undefined ? baseParts : [];
    }

    private destroyAllItemIfOutRange(baseParts: BasePart[]): void {
        let destroyAllItems = true;

        baseParts.forEach((basePart) => {
            const distanceFromCharacter = Players.LocalPlayer?.DistanceFromCharacter(basePart.Position);
            const containerId = basePart.FindFirstChild(FileNames.ID) as StringValue;
            if (containerId !== undefined &&
                distanceFromCharacter !== undefined &&
                distanceFromCharacter <= 10) {
                destroyAllItems = false;
            }
        });

        if (baseParts.size() > 0 && destroyAllItems) {
            this.playerInventory.destroy(this.otherInventory.otherInventoryScreen.GetChildren());
        }
    }

    public testRegionGenerateItem(baseParts: BasePart[]): void {

        const partsItemsAdded: BasePart[] = [];

        let partDistanceFormCharacter = 10;
        let closesPartToCharacter: BasePart | undefined;

        //TODO Use normal for loop for breack
        baseParts.forEach((basePart) => {
            const distanceFromCharacter = Players.LocalPlayer.DistanceFromCharacter(basePart.Position);
            const containerId = basePart.FindFirstChild(FileNames.ID) as StringValue;

            if (this.isNull(this.playerViewingWaitContainer) &&
                distanceFromCharacter <= partDistanceFormCharacter) {
                closesPartToCharacter = basePart;
                partDistanceFormCharacter = distanceFromCharacter;

            } else if (this.isNotNull(containerId) &&
                this.isNotNull(this.playerViewingWaitContainer) &&
                this.playerViewingWaitContainer === containerId.Value) {
                print("DIT IT weork");
                closesPartToCharacter = basePart;
                partDistanceFormCharacter = 0;
            }
        });

        const uiContainers = this.otherContainers.otherContainerScreen.GetChildren();
        let removeItems = true;

        print(uiContainers.size());
        //Create ui containers
        baseParts.forEach((basePart) => {
            print(basePart.Name);
            const distanceFromCharacter = Players.LocalPlayer.DistanceFromCharacter(basePart.Position);
            const containerId = basePart.FindFirstChild(FileNames.ID) as StringValue;
            let containerExist = false;
            let destroyContainer = false;
            print(basePart.Name, containerId);
            if (this.isNotNull(containerId)) {
                if (this.isNotNull(containerId) && distanceFromCharacter <= 10) {
                    removeItems = false;
                }

                uiContainers.forEach(container => {
                    if (this.isNotNull(containerId) && container.Name === "Container") {
                        const uiContainerId = container.FindFirstChild(FileNames.CONTAINER_ID) as StringValue;
                        print("IN");
                        if (this.isNotNull(uiContainerId) &&
                            uiContainerId.Value === containerId.Value && distanceFromCharacter <= 10) {
                            containerExist = true;
                        } else if (this.isNotNull(uiContainerId) &&
                            uiContainerId.Value === containerId.Value && distanceFromCharacter > 10) {
                            destroyContainer = true;
                        }
                    }
                });


                if (this.isNotNull(containerId) && !containerExist && distanceFromCharacter <= 10) {
                    const containerType = basePart.FindFirstChild(FileNames.CONTAINER_TYPE) as StringValue;

                    const containerObject = new Container(
                        this.otherContainers.baseContainer,
                        containerId.Value,
                        containerType?.Value);

                    containerObject.containerButton.MouseButton1Click.Connect(() => {
                        this.playerViewingWaitContainer = containerId.Value;
                        //Remove ALL items in other inventory
                        const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
                        this.playerInventory.destroy(otherInventoryItems);
                    });
                } else if (this.isNotNull(containerId) && destroyContainer && distanceFromCharacter > 10) {
                    const uiContainer = this.otherContainers.getUIContainerById(containerId.Value);
                    uiContainer?.Destroy();
                    this.playerViewingWaitContainer = undefined;
                }
            }
        });


        if (this.isNotNull(closesPartToCharacter)) {
            const id = (closesPartToCharacter as BasePart).FindFirstChild(FileNames.ID) as StringValue;

            if (this.isNotNull(id)) {
                const basePartChildren = (closesPartToCharacter as BasePart).GetChildren();
                const otherInventoryChildren = this.otherInventory.otherInventoryScreen.GetChildren();
                const itemToCreate: Instance[] = [];
                const uiItemsToRemove: Frame[] = [];

                const containerId = id.Value;


                // UI Item to add
                basePartChildren.forEach((basePartChild) => {
                    if (basePartChild.Name === FileNames.CONTAINER_ITEM) {

                        const containerItemId = basePartChild.FindFirstChild(FileNames.ID) as StringValue;
                        let uiItemExist = false;

                        //TODO Make normal for loop to brack
                        otherInventoryChildren.forEach(otherInventoryChild => {
                            if (otherInventoryChild.Name === FileNames.UI_ITEM) {
                                const uiItem = otherInventoryChild as Frame;
                                const uiItemId = uiItem.FindFirstChild(FileNames.ID) as StringValue;
                                if (uiItemId.Value === containerItemId.Value) {
                                    uiItemExist = true;
                                }
                            }
                        });

                        if (!uiItemExist) {
                            itemToCreate.push(basePartChild);
                        }
                    }
                });

                //UI Item to remove
                otherInventoryChildren.forEach((otherInventoryChild) => {
                    if (otherInventoryChild.Name === FileNames.UI_ITEM) {

                        const uiItem = otherInventoryChild as Frame;
                        const uiItemId = uiItem.FindFirstChild(FileNames.ID) as StringValue;

                        let containerItemExist = false;

                        //TODO Make normal for loop to brack
                        basePartChildren.forEach(basePartChild => {
                            if (basePartChild.Name === FileNames.CONTAINER_ITEM) {
                                const containerItemId = basePartChild.FindFirstChild(FileNames.ID) as StringValue;
                                if (uiItemId.Value === containerItemId.Value) {
                                    containerItemExist = true;
                                }
                            }
                        });

                        if (!containerItemExist) {
                            uiItemsToRemove.push(uiItem);
                        }
                    }
                });

                print(itemToCreate.size(), uiItemsToRemove.size(), otherInventoryChildren.size());

                itemToCreate.forEach(value => {
                    const containerItemBool = value as BoolValue;
                    const containerItem = new ContainerItem(containerItemBool);

                    const newItem = new Item(
                        this.otherInventory.baseItem,
                        containerId,
                        containerItem.getItemValue());
                    this.onArrowMoveItem(newItem);
                });

                uiItemsToRemove.forEach((item) => {
                    item.Destroy();
                });
            }
        }

        if (removeItems) {
            const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren();
            this.playerInventory.destroy(otherInventoryItems);
        }
    }

    public destroyItemOutOtherInventoryIfEnable() {
        if (!this.playerInventory.playerInventoryScreen.Enabled) {
            const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
            const otherContainers = this.otherContainers.otherContainerScreen.GetChildren() as Instance[];
            this.playerInventory.destroy(otherInventoryItems);
            this.playerInventory.destroy(otherContainers);
        }
    }

    public destroyFrameByContainerId(containerId: string, screenFrame: Frame): void {
        const instances = screenFrame.GetChildren() as Instance[];
        this.playerInventory.destroy(instances, (index) => {
            const id = instances[index].FindFirstChild(FileNames.CONTAINER_ID) as StringValue;
            if (id !== undefined && id.Value === containerId) {
                instances[index].Destroy();
            }
        });
    }

    public onArrowMoveItem(item: Item): void {

        // Add to Other Inventory
        item.itemArrowButton.MouseButton1Click.Connect(() => {
            if (item && item.getItemParent() && item.getItemParent().Name === FileNames.PLAYER_INVENTORY) {
                item.setItemParent(this.otherInventory.otherInventoryScreen);
                item.itemArrowButton.Rotation = 180;
                this.inventoryItemEvents.FireServer(
                    `Remove^${item.itemValue.id}^${item.itemValue.toObjectString()}^${this.playerViewingWaitContainer}`);

                //Add to Player Inventory
            } else if ((item && item.getItemParent() && item.getItemParent().Name === FileNames.OTHER_INVENTORY)) {
                item.setItemParent(this.playerInventory.playerInventoryFrame);
                item.itemArrowButton.Rotation = 0;
                this.inventoryItemEvents.FireServer(
                    `Add^${item.containerId.Value}^${item.itemValue.toObjectString()}^${this.playerViewingWaitContainer}`);
            } else {
                print("In addAnyItem, the itemClone is null!");
            }
        });
    }

    private isNull(object: unknown): boolean {
        return object === undefined;
    }

    private isNotNull(object: unknown): boolean {
        return object !== undefined;
    }
}