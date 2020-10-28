import PlayerInventory from "../LocalModules/Inventory/PlayerInventory";
import OtherInventory from "../LocalModules/Inventory/OtherInventory";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import Item from "../LocalModules/Inventory/Item";
import RegionService from "../../shared/Service/RegionService";
import {Players, Workspace, ReplicatedStorage} from "@rbxts/services";
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
    private testtt: RemoteEvent;

    constructor() {
        this.playerInventory = new PlayerInventory(Players.LocalPlayer);
        this.otherInventory = new OtherInventory(Players.LocalPlayer);
        this.otherContainers = new OtherContainers(Players.LocalPlayer);
        this.regionService = new RegionService();
        //TODO Change the name PICK_UP_EXAMPLE
        this.testtt = ReplicatedStorage.WaitForChild(FileNames.PICK_UP_EXAMPLE) as RemoteEvent;
    }

    public toggleInventory(): void {
        this.playerInventory.playerInventoryScreen.Enabled = !this.playerInventory.playerInventoryScreen.Enabled;
    }

    public onInventoryOpen() {
        let baseParts: BasePart[] = [];
        let basePartAdded: BasePart[] = [];
        let basePartPreAdded: BasePart[] = [];
        let firstTimeCreate = true;
        while (this.playerInventory.playerInventoryScreen.Enabled) {
            wait(0.1);

            if (baseParts.size() === 0) {
                baseParts = this.findBasePartInRegion();
            }

            const baseItemParts = this.testRegionGenerateItem(
                basePartAdded,
                firstTimeCreate,
                baseParts);

            firstTimeCreate = false;

            if (baseItemParts.size() > 0) {
                baseItemParts.forEach(b => basePartAdded.push(b));
            }

            basePartAdded = this.destroyItemIfOutRange(basePartAdded);

            this.reAddItems(basePartPreAdded, basePartAdded);

            basePartPreAdded = basePartAdded;

            firstTimeCreate = basePartAdded.size() === 0;
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
                baseParts.push(basePart);
            }
        });
        return player !== undefined ? baseParts : [];
    }

    public testRegionGenerateItem(itemsNotToAdd: BasePart[] = [],
                                  firstTimeCreate: boolean,
                                  parts: BasePart[]): BasePart[] {

        const partsItemsAdded: BasePart[] = [];

        parts.forEach((basePart) => {
            const distanceFromCharacter = Players.LocalPlayer.DistanceFromCharacter(basePart.Position);
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

                const containerObject = new Container(
                    this.otherContainers.baseContainer,
                    ContainerEnum.FRIDGE,
                    containerGUID);

                if (firstTimeCreate) {
                    const itemValues = ItemGeneratorService.toItemValueArray(container.Value);
                    itemValues.forEach(itemValue => {
                        const newItem = new Item(
                            this.otherInventory.baseItem,
                            containerGUID,
                            itemValue);
                        this.onArrowMoveItem(newItem);
                    });

                    firstTimeCreate = false;
                }

                containerObject.containerButton.MouseButton1Click.Connect(() => {
                    const itemValues = ItemGeneratorService.toItemValueArray(container.Value);
                    print("Clickeddddd", itemValues.size());

                    const otherInventoryItems = this.otherInventory.otherInventoryScreen.GetChildren() as Instance[];
                    this.playerInventory.destroy(otherInventoryItems);

                    itemValues.forEach(itemValue => {
                        const newItem = new Item(
                            this.otherInventory.baseItem,
                            containerGUID,
                            itemValue);
                        this.onArrowMoveItem(newItem);
                    });
                });

                partsItemsAdded.push(basePart);
            }
        });
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
                this.destroyFrameByContainerId(containerId.Value, this.otherInventory.otherInventoryScreen);
                this.destroyFrameByContainerId(containerId.Value, this.otherContainers.otherContainerScreen);
            } else if (containerId !== undefined &&
                distanceFromCharacter !== undefined &&
                distanceFromCharacter <= 10) {
                newBasePart.push(basePart);
            }
        });

        return newBasePart;
    }

    private reAddItems(basePartPreAdded: BasePart[], basePartAdded: BasePart[]) {

        print(basePartPreAdded.size(), basePartAdded.size());
        let stop = false;
        if (basePartAdded.size() > 0 && basePartPreAdded.size() !== basePartAdded.size()) {
            basePartAdded.forEach((basePart) => {
                const distanceFromCharacter = Players.LocalPlayer.DistanceFromCharacter(basePart.Position);
                const container = basePart.FindFirstChild(FileNames.CONTAINER) as StringValue;
                const id = basePart.FindFirstChild(FileNames.ID) as StringValue;

                if (this.isNotNull(container) && this.isNotNull(id) && distanceFromCharacter <= 10) {
                    let addItems = false;

                    basePartPreAdded.forEach((addedPart) => {
                        const idNotToInclude = addedPart.FindFirstChild(FileNames.ID) as StringValue;
                        if (this.isNotNull(id) && this.isNotNull(idNotToInclude) &&
                            id.Value === idNotToInclude.Value) {
                            addItems = true;
                        }
                    });

                    if (addItems && !stop) {
                        print("Add Items", stop);
                        stop = true;
                        this.destroyFrameByContainerId(id.Value, this.otherInventory.otherInventoryScreen);
                        const itemValues = ItemGeneratorService.toItemValueArray(container.Value);
                        itemValues.forEach(itemValue => {
                            const newItem = new Item(
                                this.otherInventory.baseItem,
                                id.Value,
                                itemValue);
                            this.onArrowMoveItem(newItem);
                        });
                    }
                }
            });
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

        // TODO Put in own class, this need more testing
        const con = Workspace.WaitForChild("TestParts")
            .FindFirstChild("TestContainers")?.GetChildren();

        //TODO Implement connection to server here
        this.testtt.FireServer()

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
                        container.Value = container.Value + item.itemValue.toObjectString();
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
                        container.Value = container.Value.gsub(item.itemValue.toObjectString(), "")[0];
                    }
                });
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