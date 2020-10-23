import {ReplicatedStorage, UserInputService, ContextActionService} from "@rbxts/services";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import InventoryService from "./InventoryService";

//TODO Put in a class
const remote = ReplicatedStorage.WaitForChild(FileNames.PICK_UP_EXAMPLE) as RemoteEvent;

export default class ProjectZombloxPlayerInputService {

    private readonly inventoryService: InventoryService;
    //TODO Use enum for this.
    private readonly OPEN_INVENTORY = "Open Inventory";

    constructor() {
        this.inventoryService = new InventoryService();
    }

    public began(): void {

        //TODO us to overide key press
        /*ContextActionService.BindAction(this.OPEN_INVENTORY,
            (actionName, state, inputObject) => {
                if (actionName === this.OPEN_INVENTORY && state === Enum.UserInputState.Begin) {
                    ///this.inventoryService.toggleInventory();
                }
            }, false, Enum.KeyCode.E);*/

        UserInputService.InputBegan.Connect((input: InputObject, gameProcessedEvent) => {

            if (!gameProcessedEvent && input.UserInputType === Enum.UserInputType.Keyboard) {

                switch (input.KeyCode) {
                    //TODO Maybe Remove this
                    case Enum.KeyCode.E:
                        this.inventoryService.toggleInventory();
                        break;
                    case Enum.KeyCode.Space:
                        remote.FireServer("Exampel test");
                        break;
                    case Enum.KeyCode.Q:
                        this.inventoryService.addAnyItem();
                        break;
                }
            }
        });
    }
}