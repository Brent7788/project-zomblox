import PlayerInventory from "../LocalModules/Inventory/PlayerInventory";
import OtherInventory from "../LocalModules/Inventory/OtherInventory";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import {ItemEnum} from "../../shared/Modules/Enums/ItemEnum";
import Item from "../LocalModules/Inventory/Item";
import RegionService from "../../shared/Service/RegionService";
import {Players, Workspace} from "@rbxts/services";
import ItemGeneratorService from "../../shared/Service/ItemGeneratorService";
import InstanceGenerator from "../../shared/Utils/InstanceGenerator";
import OtherContainers from "../LocalModules/Inventory/OtherContainers";
import Container from "../LocalModules/Inventory/Container";
import {ContainerEnum} from "../../shared/Modules/Enums/ContainerEnum";


export default class InventoryService {

    private playerInventory: PlayerInventory;
    private otherInventory: OtherInventory;
    private otherContainers: OtherContainers;
    private readonly regionService: RegionService;

    constructor() {
        this.playerInventory = new PlayerInventory(Players.LocalPlayer);
        this.otherInventory = new OtherInventory(Players.LocalPlayer);
        this.otherContainers = new OtherContainers(Players.LocalPlayer);
        this.regionService = new RegionService();
    }

    public toggleInventory(): void {
        this.playerInventory.playerInventoryScreen.Enabled = !this.playerInventory.playerInventoryScreen.Enabled;
    }

    public onInventoryOpen() {
        let baseParts: BasePart[] = [];
        while (this.playerInventory.playerInventoryScreen.Enabled) {
            wait(0.1);
            const baseItemParts = this.testRegionGenerateItem(baseParts);
            if (baseItemParts.size() > 0) {
                baseItemParts.forEach(b => baseParts.push(b));
            }
            baseParts = this.destroyItemIfOutRange(baseParts);
        }
    }

    public testRegionGenerateItem(itemsNotToAdd: BasePart[] = []): BasePart[] {
        const baseParts = this.regionService.FindPartsInRegion3(1000);
        let player: Player | undefined = undefined;
        const parts: Array<BasePart> = [];
        const partsItemsAdded: BasePart[] = [];

        baseParts.forEach((p) => {
            const h = p.Parent?.FindFirstChild(FileNames.HUMANOID)
            const isPart = p.IsA(FileNames.PART);
            if (h !== undefined) {
                player = Players.GetPlayerFromCharacter(p.Parent);
            } else if (isPart) {
                parts.push(p);
            }
        });

        if (player !== undefined) {
            parts.forEach((basePart) => {
                const distanceFromCharacter = player?.DistanceFromCharacter(basePart.Position);
                const container = basePart.FindFirstChild(FileNames.CONTAINER) as StringValue;
                const id = basePart.FindFirstChild(FileNames.ID) as StringValue;
                let addItem = true;

                itemsNotToAdd.forEach((item) => {
                    const idNotToInclude = item.FindFirstChild(FileNames.ID) as StringValue;
                    if (id !== undefined && idNotToInclude !== undefined &&
                        id.Value === idNotToInclude.Value) {
                        addItem = false;
                    }
                });

                if (addItem && container !== undefined &&
                    distanceFromCharacter !== undefined &&
                    distanceFromCharacter <= 10) {

                    let containerGUID: string;

                    if (id === undefined) {
                        containerGUID = InstanceGenerator.generateGUID();
                        InstanceGenerator.generateId(basePart, FileNames.ID, containerGUID);
                    } else {
                        containerGUID = id.Value;
                    }

                    const d = new Container(this.otherContainers.baseContainer, ContainerEnum.FRIDGE);

                    const itemValues = ItemGeneratorService.toItemValueArray(container.Value);
                    itemValues.forEach(itemValue => {
                        const newItem = new Item(
                            this.otherInventory.baseItem,
                            itemValue.itemUIValues,
                            containerGUID,
                            itemValue.itemCount);
                        this.onArrowMoveItem(newItem);
                    });
                    partsItemsAdded.push(basePart);
                }
            });
        }
        return partsItemsAdded;
    }

    private destroyItemIfOutRange(itemsToRemove: BasePart[]): BasePart[] {

        const newBasePart: BasePart[] = [];
        itemsToRemove.forEach((basePart) => {
            const distanceFromCharacter = Players.LocalPlayer?.DistanceFromCharacter(basePart.Position);
            const containerId = basePart.FindFirstChild(FileNames.ID) as StringValue;
            if (containerId !== undefined &&
                distanceFromCharacter !== undefined &&
                distanceFromCharacter > 10) {
                this.destroyItemByContainerId(containerId.Value);
            } else if (containerId !== undefined &&
                distanceFromCharacter !== undefined &&
                distanceFromCharacter <= 10) {
                newBasePart.push(basePart);
            }
        });

        return newBasePart;
    }

    public destroyItemOutOtherInventoryIfEnable() {
        print(this.playerInventory.playerInventoryScreen.Enabled);
        if (!this.playerInventory.playerInventoryScreen.Enabled) {
            const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
            Item.destroyItems(otherInventoryItems);
        }
    }

    public destroyItemByContainerId(containerId: string): void {
        const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
        Item.destroyItems(otherInventoryItems, (index) => {
            const id = otherInventoryItems[index].FindFirstChild(FileNames.CONTAINER_ID) as StringValue;
            if (id !== undefined && id.Value === containerId) {
                otherInventoryItems[index].Destroy();
            }
        });
    }

    public createItem(itemEnum: ItemEnum) {

        const newItem = new Item(this.playerInventory.baseItem, itemEnum, InstanceGenerator.generateGUID());

        newItem.itemArrowButton.Rotation = 0;

        this.onArrowMoveItem(newItem);
    }

    public addAnyItem() {

        const newItem = new Item(this.playerInventory.baseItem, ItemEnum.BLOCK_FRYING_PAN, InstanceGenerator.generateGUID());

        newItem.itemArrowButton.Rotation = 0;

        this.createItem(ItemEnum.HUNTING_KNIFE);

        this.onArrowMoveItem(newItem);
    }

    public onArrowMoveItem(item: Item): void {

        // TODO Put in own class, this need more testing
        const con = Workspace.WaitForChild("TestParts")
            .FindFirstChild("TestContainers")?.GetChildren();

        item.itemArrowButton.MouseButton1Click.Connect(() => {
            if (item && item.getItemParent() && item.getItemParent().Name === FileNames.PLAYER_INVENTORY) {
                item.setItemParent(this.otherInventory.otherInventoryScreen);
                item.itemArrowButton.Rotation = 180;

                print(con?.size(), item.containerId.Value);
                con?.forEach((c) => {
                    const dis = Players.LocalPlayer.DistanceFromCharacter((c as Part).Position);
                    const container = c.FindFirstChild(FileNames.CONTAINER) as StringValue;
                    const containerId = c.FindFirstChild(FileNames.ID) as StringValue;
                    print(container, containerId);
                    if (container !== undefined &&
                        containerId !== undefined &&
                        dis <= 10) {
                        container.Value = container.Value + item.itemValue.Value;
                    }
                });
            } else if ((item && item.getItemParent() && item.getItemParent().Name === FileNames.OTHER_INVENTORY)) {
                item.setItemParent(this.playerInventory.playerInventoryFrame);
                item.itemArrowButton.Rotation = 0;

                print(con?.size(), item.containerId.Value);
                con?.forEach((c) => {
                    const container = c.FindFirstChild(FileNames.CONTAINER) as StringValue;
                    const containerId = c.FindFirstChild(FileNames.ID) as StringValue;
                    print(container, containerId);
                    if (container !== undefined &&
                        containerId !== undefined &&
                        containerId.Value === item.containerId.Value) {
                        container.Value = container.Value.gsub(item.itemValue.Value, "")[0];
                    }
                });
            } else {
                print("In addAnyItem, the itemClone is null!");
            }
        });
    }
}