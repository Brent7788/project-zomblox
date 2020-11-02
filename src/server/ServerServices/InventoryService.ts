import {HttpService, ReplicatedStorage, Workspace} from "@rbxts/services";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../shared/Utils/InstanceGenerator";
import ItemValue from "../../shared/Modules/ItemValue";


export default class InventoryService {

    private readonly inventoryItemEvents: RemoteEvent;
    private readonly testContainers: Instance[] | undefined;

    constructor() {
        this.inventoryItemEvents = ReplicatedStorage.WaitForChild(FileNames.INVENTORY_ITEM_EVENTS) as RemoteEvent;
        this.testContainers = Workspace.WaitForChild("TestParts")
            .FindFirstChild("TestContainers")?.GetChildren();
    }

    public containerIdGenerator(): void {

        if (this.testContainers === undefined) {
            print("Container parts in sever inventory service is null");
        } else {
            this.testContainers.forEach(container => {
                InstanceGenerator.generateId(container, FileNames.ID, HttpService.GenerateGUID());
            });
        }
    }

    public initServerEvent(): void {
        this.inventoryItemEvents.OnServerEvent.Connect((player, args) => {
            const values = args as Array<string>;
            this.AddOrRemoveItem(values[0], values[1], values[2], tonumber(values[3]), values[4]);
        });
    }

    private AddOrRemoveItem(actionType: string,
                            itemId: string,
                            itemUIValues: string,
                            itemQuantity: number | undefined,
                            playerViewingWaitContainer: string): void {

        if (this.testContainers === undefined) {
            print("Container parts in sever inventory service is null");
        } else {

            const itemValue = new ItemValue(itemQuantity, itemUIValues);

            for (const testContainer of this.testContainers) {
                const containerId = testContainer.FindFirstChild(FileNames.ID) as StringValue;

                if (containerId !== undefined && containerId.Value === playerViewingWaitContainer) {
                    const containerItems = testContainer.GetChildren();
                    let addItem = true;

                    for (const containerItem of containerItems) {
                        const containerItemId = containerItem.FindFirstChild(FileNames.ID) as StringValue;

                        if (containerItemId !== undefined && actionType === "Remove" &&
                            containerItemId.Value === itemId) {
                            containerItem.Destroy();
                            break;
                        } else if (containerItemId !== undefined && actionType === "Add" &&
                            containerItemId.Value === itemId) {
                            const quantity = containerItem.FindFirstChild(FileNames.ITEM_QUANTITY) as IntValue;
                            quantity.Value = quantity.Value + ((itemQuantity !== undefined) ? itemQuantity : 0);
                            addItem = false;
                            break;
                        }
                    }

                    if (addItem && actionType === "Add") {
                        itemValue.createContainerItem(testContainer);
                    }
                    break;
                }
            }
        }
    }

    //TODO This mit not be a good idee;
    private getItemId(itemValue: string): string {
        return itemValue.split(";")[1].split(",")[0].gsub("rbxassetid://", "")[0];
    }
}