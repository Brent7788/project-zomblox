import {HttpService, ReplicatedStorage, Workspace} from "@rbxts/services";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../shared/Utils/InstanceGenerator";


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
            print("THE PPLAYER",player, player.UserId);
            const splitArgs = (args as string).split("^");
            this.AddOrRemoveItem(splitArgs[0], splitArgs[1], splitArgs[2], player, splitArgs[3]);
        });
    }

    private AddOrRemoveItem(actionType: string,
                            itemContainerId: string,
                            itemValue: string,
                            player: Player,
                            playerViewingWaitContainer: string): void {

        if (this.testContainers === undefined) {
            print("Container parts in sever inventory service is null");
        } else {

            this.testContainers.forEach((c) => {
                const distanceFromPlayer = player.DistanceFromCharacter((c as Part).Position);
                const container = c.FindFirstChild(FileNames.CONTAINER) as StringValue;
                const containerId = c.WaitForChild(FileNames.ID) as StringValue;
                if (actionType === "Add" && container !== undefined &&
                    containerId !== undefined && containerId.Value === itemContainerId) {

                    container.Value = container.Value.gsub(itemValue, "")[0];
                    //player
                    this.inventoryItemEvents.FireAllClients(`Remove^${player.UserId}^${itemContainerId}^${this.getItemId(itemValue)}`);
                } else if (actionType === "Remove" && container !== undefined &&
                    containerId !== undefined && distanceFromPlayer <= 10 && containerId.Value === playerViewingWaitContainer) {

                    this.inventoryItemEvents.FireAllClients(`Add^${player.UserId}^${playerViewingWaitContainer}^${this.getItemId(itemValue)}^${itemValue}`);
                    //TODO Fix multy has
                    container.Value = `${container.Value}${itemValue}#`;
                }
            });
        }
    }

    //TODO This mit not be a good idee;
    private getItemId(itemValue: string): string {
        return itemValue.split(";")[1].split(",")[0].gsub("rbxassetid://", "")[0];
    }
}