import {Players, ReplicatedStorage, UserInputService} from "@rbxts/services";

const remote = ReplicatedStorage.WaitForChild("PIckUp") as RemoteEvent;

const player = Players.WaitForChild("RyzingBlob") as Player;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const inventoryGui = playerGui.WaitForChild("InventoryGui") as ScreenGui;
//const uiScale = inventoryGui.WaitForChild("UIScale") as UIScale;
//const uiScale2 = Players.FindFirstAncestor("InventoryGui") as ScreenGui;

inventoryGui.Enabled = false;

//let test = UserInputService.IsKeyDown(Enum.KeyCode.E);

UserInputService.InputBegan.Connect((input: InputObject) => {

    if (input.UserInputType === Enum.UserInputType.Keyboard) {

        switch (input.KeyCode) {
            case Enum.KeyCode.E:
                inventoryGui.Enabled = !inventoryGui.Enabled;
                break;
            case Enum.KeyCode.Space:
                remote.FireServer("testtt");
                print("werk dit", remote);
                break;
        }
    }
});

UserInputService.InputChanged.Connect((input: InputObject) => {

});
