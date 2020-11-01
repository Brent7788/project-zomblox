import {UserInputService} from "@rbxts/services";
import InventoryService from "./InventoryService";


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
                        this.inventoryService.refreshInventory();
                        this.inventoryService.toggleInventory();
                        break;
                    case Enum.KeyCode.Space:
                        break;
                    case Enum.KeyCode.Q:
                        break;
                }
            }
        });

        UserInputService.InputEnded.Connect((input: InputObject, gameProcessedEvent) => {

            if (!gameProcessedEvent && input.UserInputType === Enum.UserInputType.Keyboard) {

                switch (input.KeyCode) {
                    //TODO Maybe Remove this
                    case Enum.KeyCode.E:
                        print("Close");
                        this.inventoryService.onInventoryOpen();
                        break;
                    case Enum.KeyCode.Space:
                        print('Test scpae');
                        break;
                }
            }
        });
    }
}