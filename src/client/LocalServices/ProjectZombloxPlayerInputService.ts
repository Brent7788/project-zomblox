import {Players, UserInputService} from "@rbxts/services";
import InventoryService from "./InventoryService";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import U from "../../shared/Utils/CommonUtil";


export default class ProjectZombloxPlayerInputService {

    private readonly inventoryService: InventoryService;
    //TODO Use enum for this.
    private readonly OPEN_INVENTORY = "Open Inventory";

    constructor() {
        this.inventoryService = new InventoryService();
    }

    public began(): void {
        this.inventoryService.initUIMouseEL();

        const player = Players.LocalPlayer;
        const playerHumanoid = player.Character?.FindFirstChild(FileNames.HUMANOID) as Humanoid;
        let buttonHold = true;
        //TODO us to override key press
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
                        if (!this.inventoryService.isItemLoading) {
                            this.inventoryService.refreshInventory();
                            this.inventoryService.toggleInventory();
                        }
                        break;
                    case Enum.KeyCode.Space:
                        break;
                    case Enum.KeyCode.LeftShift:
                        buttonHold = true;
                        if (U.isNotNull(playerHumanoid)) {
                            //TODO This should be in the player service
                            playerHumanoid.WalkSpeed = 16;
                            while (buttonHold) {
                                wait(0.1);
                                if (playerHumanoid.WalkSpeed >= 1 && playerHumanoid.WalkSpeed < 26) {
                                    playerHumanoid.WalkSpeed = playerHumanoid.WalkSpeed + 3;
                                }
                            }
                        }
                        break;
                }
            }
        });

        UserInputService.InputEnded.Connect((input: InputObject, gameProcessedEvent) => {

            if (!gameProcessedEvent && input.UserInputType === Enum.UserInputType.Keyboard) {

                switch (input.KeyCode) {
                    //TODO Maybe Remove this
                    case Enum.KeyCode.E:
                        if (!this.inventoryService.isItemLoading) {
                            print("Close");
                            this.inventoryService.onInventoryOpen();
                        }
                        break;
                    case Enum.KeyCode.LeftShift:
                        buttonHold = false;
                        if (U.isNotNull(playerHumanoid)) {
                            //TODO This should be in the player service
                            while (!buttonHold) {
                                wait(0.2);
                                if (playerHumanoid.WalkSpeed > 16) {
                                    playerHumanoid.WalkSpeed = playerHumanoid.WalkSpeed - 2;
                                } else if (playerHumanoid.WalkSpeed <= 16) {
                                    playerHumanoid.WalkSpeed = 16;
                                    break;
                                }
                            }
                        }
                        break;
                }
            }
        });
    }
}