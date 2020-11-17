import PlayerInventory from "../LocalModules/Inventory/PlayerInventory";
import OtherInventory from "../LocalModules/Inventory/OtherInventory";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import Item from "../LocalModules/Inventory/Item";
import RegionService from "../../shared/Service/RegionService";
import {Players, Workspace, ReplicatedStorage} from "@rbxts/services";
import OtherContainers from "../LocalModules/Inventory/OtherContainers";
import Container from "../LocalModules/Inventory/Container";
import ContainerItem from "../LocalModules/Inventory/ContainerItem";


export default class InventoryService {

    private playerInventory: PlayerInventory;
    private otherInventory: OtherInventory;
    private otherContainers: OtherContainers;
    private readonly regionService: RegionService;
    private inventoryItemEvents: RemoteEvent;
    //Item Pop Up
    public itemPopUpDescFrame: Frame;
    //TODO Maybe don't use this, is Hacky solution
    public isItemLoading = false;

    constructor() {
        this.playerInventory = new PlayerInventory(Players.LocalPlayer);
        this.otherInventory = new OtherInventory(Players.LocalPlayer);
        this.otherContainers = new OtherContainers(Players.LocalPlayer);
        const testRegPart = Workspace.WaitForChild("Reg") as Part;
        this.regionService = new RegionService(testRegPart);
        this.inventoryItemEvents = ReplicatedStorage.WaitForChild(FileNames.INVENTORY_ITEM_EVENTS) as RemoteEvent;
        this.itemPopUpDescFrame = this.playerInventory.playerInventoryScreen.FindFirstChild(FileNames.ITEM_POP_UP_DESC) as Frame;
    }

    //TODO Find better name and implementations, maybe also disconnect
    public initUIMouseEL() {
        //Mouse Enter
        this.playerInventory.playerInventoryFrame.MouseEnter.Connect(() => {
            this.itemPopUpDescFrame.Visible = false;
        });
        this.otherInventory.otherInventoryScreen.MouseEnter.Connect(() => {
            this.itemPopUpDescFrame.Visible = false;
        });
        //Mouse Leave
        this.playerInventory.playerInventoryFrame.MouseLeave.Connect(() => {
            this.itemPopUpDescFrame.Visible = false;
        });
        this.otherInventory.otherInventoryScreen.MouseLeave.Connect(() => {
            this.itemPopUpDescFrame.Visible = false;
        });
    }

    public toggleInventory(): void {
        this.playerInventory.playerInventoryScreen.Enabled = !this.playerInventory.playerInventoryScreen.Enabled;
    }

    public onInventoryOpen() {
        let containerParts: BasePart[] = [];
        this.otherContainers.currentContainerIdPlayerIsViewing = undefined;

        while (this.playerInventory.playerInventoryScreen.Enabled) {
            wait(0.1);

            if (containerParts.size() === 0) {
                containerParts = this.findContainerPartInRegion();
            } else {
                this.testRegionGenerateItem(containerParts);
            }
        }
    }

    private findContainerPartInRegion(): BasePart[] {
        //TODO VERY IMPORTANT make FindPartsInRegion3WithWhiteList include humanoid
        //     Max Parts should pe pre-calculated
        const allInstanceInRegion = this.regionService.FindPartsInRegion3(10000);
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

    //TODO This method is to big, should not be test region
    public testRegionGenerateItem(containerParts: BasePart[]): void {

        let partDistanceFormCharacter = 10;
        let closesContainerPartToCharacter: BasePart | undefined;

        for (const containerPart of containerParts) {
            const distanceFromCharacter = Players.LocalPlayer.DistanceFromCharacter(containerPart.Position);
            const containerId = containerPart.FindFirstChild(FileNames.ID) as StringValue;

            if (this.isNull(this.otherContainers.currentContainerIdPlayerIsViewing) &&
                distanceFromCharacter <= partDistanceFormCharacter) {
                closesContainerPartToCharacter = containerPart;
                partDistanceFormCharacter = distanceFromCharacter;

            } else if (this.isNotNull(containerId) &&
                this.isNotNull(this.otherContainers.currentContainerIdPlayerIsViewing) &&
                this.otherContainers.currentContainerIdPlayerIsViewing === containerId.Value) {
                closesContainerPartToCharacter = containerPart;
                break;
            }
        }

        if (this.isNotNull(closesContainerPartToCharacter)) {
            const id = (closesContainerPartToCharacter as BasePart).FindFirstChild(FileNames.ID) as StringValue;
            if (this.isNotNull(id)) {
                this.otherContainers.currentContainerIdPlayerIsViewing = id.Value;
            }
        }

        const uiContainers = this.otherContainers.otherContainerScreen.GetChildren();
        let removeItems = true;

        //Create ui containers
        containerParts.forEach((basePart) => {

            const containerId = basePart.FindFirstChild(FileNames.ID) as StringValue;

            if (this.isNotNull(containerId)) {
                const distanceFromCharacter = Players.LocalPlayer.DistanceFromCharacter(basePart.Position);
                let containerExist = false;
                let destroyContainer = false;

                if (distanceFromCharacter <= 10) {
                    removeItems = false;
                }

                uiContainers.forEach(container => {
                    if (container.Name === "Container") {
                        const uiContainerId = container.FindFirstChild(FileNames.CONTAINER_ID) as StringValue;
                        if (this.isNotNull(uiContainerId) &&
                            uiContainerId.Value === containerId.Value && distanceFromCharacter <= 10) {
                            containerExist = true;
                        } else if (this.isNotNull(uiContainerId) &&
                            uiContainerId.Value === containerId.Value && distanceFromCharacter > 10) {
                            destroyContainer = true;
                        }
                    }
                });


                if (!containerExist && distanceFromCharacter <= 10) {
                    const containerType = basePart.FindFirstChild(FileNames.CONTAINER_TYPE) as StringValue;

                    const containerObject = new Container(
                        this.otherContainers.baseContainer,
                        containerId.Value,
                        containerType?.Value);

                    containerObject.containerButton.MouseButton1Click.Connect(() => {
                        if (!this.isItemLoading) {
                            this.otherContainers.currentContainerIdPlayerIsViewing = containerId.Value;
                            //Remove ALL items in other inventory
                            const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
                            this.playerInventory.destroy(otherInventoryItems);
                        }
                    });
                } else if (destroyContainer && distanceFromCharacter > 10 && !this.isItemLoading) {
                    const uiContainer = this.otherContainers.getUIContainerById(containerId.Value);
                    uiContainer?.Destroy();
                    this.otherContainers.currentContainerIdPlayerIsViewing = undefined;
                }
            }
        });


        if (!removeItems && this.isNotNull(closesContainerPartToCharacter)) {
            const id = (closesContainerPartToCharacter as BasePart).FindFirstChild(FileNames.ID) as StringValue;

            if (this.isNotNull(id)) {
                const basePartChildren = (closesContainerPartToCharacter as BasePart).GetChildren();
                const otherInventoryChildren = this.otherInventory.otherInventoryScreen.GetChildren();

                const containerId = id.Value;


                // UI Item to add
                basePartChildren.forEach((basePartChild) => {
                    if (basePartChild.Name === FileNames.CONTAINER_ITEM) {

                        const containerItemId = basePartChild.FindFirstChild(FileNames.ID) as StringValue;
                        let uiItemExist = false;

                        for (const otherInventoryChild of otherInventoryChildren) {
                            if (otherInventoryChild.Name === FileNames.UI_ITEM) {
                                const uiItem = otherInventoryChild as Frame;
                                const uiItemId = uiItem.FindFirstChild(FileNames.ID) as StringValue;
                                if (uiItemId.Value === containerItemId.Value) {
                                    //Update UI item quantity
                                    const itemQuantity = basePartChild.FindFirstChild(FileNames.ITEM_QUANTITY) as IntValue;
                                    const quantity = otherInventoryChild.FindFirstChild(FileNames.ITEM_QUANTITY) as IntValue;
                                    quantity.Value = itemQuantity.Value;
                                    //Trigger add item if not exist
                                    uiItemExist = true;
                                    break;
                                }
                            }
                        }

                        if (!uiItemExist) {
                            const containerItemBool = basePartChild as BoolValue;
                            const containerItem = new ContainerItem(containerItemBool);

                            const newItem = new Item(
                                this.otherInventory.baseItem,
                                containerId,
                                containerItem.getItemValue());
                            this.onArrowMoveItem(newItem);
                        }
                    }
                });

                //UI Item to remove
                otherInventoryChildren.forEach((otherInventoryChild) => {
                    if (otherInventoryChild.Name === FileNames.UI_ITEM) {

                        const uiItem = otherInventoryChild as Frame;
                        const uiItemId = uiItem.FindFirstChild(FileNames.ID) as StringValue;
                        const uiItemLoader = uiItem.FindFirstChild(FileNames.UI_ITEM_LOADER) as TextLabel;

                        let containerItemExist = false;

                        for (const basePartChild of basePartChildren) {
                            if (basePartChild.Name === FileNames.CONTAINER_ITEM) {
                                const containerItemId = basePartChild.FindFirstChild(FileNames.ID) as StringValue;
                                if (uiItemId.Value === containerItemId.Value) {
                                    containerItemExist = true;
                                    break;
                                }
                            }
                        }

                        // uiItemLoader.Visible Don't destroy ui item if the loader is visible
                        if (!containerItemExist && !uiItemLoader.Visible) {
                            uiItem.Destroy();
                        }
                    }
                });
            }
        }

        //Remove all items if out of range
        if (removeItems && !this.isItemLoading) {
            const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren();
            this.playerInventory.destroy(otherInventoryItems);
        }
    }

    public refreshInventory() {
        this.itemPopUpDescFrame.Visible = false;
        if (!this.playerInventory.playerInventoryScreen.Enabled) {
            const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
            const otherContainers = this.otherContainers.otherContainerScreen.GetChildren() as Instance[];
            this.playerInventory.destroy(otherInventoryItems);
            this.playerInventory.destroy(otherContainers);
        }
    }

    public onArrowMoveItem(item: Item): void {

        // Add to Other Inventory and remove form Player Inventory
        item.itemArrowButton.MouseButton1Click.Connect(() => {
            if (item && item.getItemParent() && item.getItemParent().Name === FileNames.PLAYER_INVENTORY) {

                if (!this.isItemLoading) {
                    this.isItemLoading = true;
                    item.displayItemLoader();
                    this.inventoryItemEvents.FireServer([
                        "Add",
                        item.itemValue.id,
                        item.itemValue.itemUIValues,
                        item.itemQuantityValue.Value,
                        this.otherContainers.currentContainerIdPlayerIsViewing
                    ]);

                    this.playerInventory.removeItemById(item.itemValue.id);
                    item.itemFrame.Destroy();
                    this.isItemLoading = false;
                }
                //Add to Player Inventory and remove from Other Inventory
            } else if ((item && item.getItemParent() && item.getItemParent().Name === FileNames.OTHER_INVENTORY)) {

                if (!this.isItemLoading) {
                    this.isItemLoading = true;
                    item.itemArrowButton.Rotation = 0;
                    this.inventoryItemEvents.FireServer([
                        "Remove",
                        item.itemValue.id,
                        item.itemValue.itemUIValues,
                        item.itemQuantityValue.Value,
                        this.otherContainers.currentContainerIdPlayerIsViewing
                    ]);
                    item.displayItemLoader();
                    this.playerInventory.setAndMergeDuplicateItems(item);
                    this.isItemLoading = false;
                }
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