import {Players, ReplicatedStorage, UserInputService} from "@rbxts/services";
import {FileNames} from "../shared/Modules/Enums/FileNames";

//TODO Put in a class
const remote = ReplicatedStorage.WaitForChild(FileNames.PICK_UP_EXAMPLE) as RemoteEvent;
const player = Players.WaitForChild("RyzingBlob") as Player;
const playerGui = player.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
const inventoryGui = playerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;

export default class PlayerInputs {

    public began(): void {
        UserInputService.InputBegan.Connect((input: InputObject) => {

            if (input.UserInputType === Enum.UserInputType.Keyboard) {

                switch (input.KeyCode) {
                    case Enum.KeyCode.E:
                        inventoryGui.Enabled = !inventoryGui.Enabled;
                        break;
                    case Enum.KeyCode.Space:
                        remote.FireServer("testtt");
                        break;
                }
            }
        });
    }
}