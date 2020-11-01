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
            this.AddOrRemoveItem(values[0], values[1], values[2], values[3]);
        });
    }

    private AddOrRemoveItem(actionType: string,
                            itemId: string,
                            itemUIValues: string,
                            playerViewingWaitContainer: string): void {

        if (this.testContainers === undefined) {
            print("Container parts in sever inventory service is null");
        } else {

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
                            addItem = false;
                            break;
                        }
                    }

                    if (addItem && actionType === "Add") {
                        //TODO Get item count
                        const itemValue = new ItemValue(1, itemUIValues);
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