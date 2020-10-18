import {ReplicatedStorage, UserInputService} from "@rbxts/services";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import InventoryService from "./InventoryService";

//TODO Put in a class
const remote = ReplicatedStorage.WaitForChild(FileNames.PICK_UP_EXAMPLE) as RemoteEvent;

export default class ProjectZombloxPlayerInputService {

    private readonly inventoryService: InventoryService;

    constructor() {
        this.inventoryService = new InventoryService();
    }

    public began(): void {
        UserInputService.InputBegan.Connect((input: InputObject) => {

            if (input.UserInputType === Enum.UserInputType.Keyboard) {

                switch (input.KeyCode) {
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