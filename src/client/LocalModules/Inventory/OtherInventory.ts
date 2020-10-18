import {Players} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";

export default class OtherInventory {
    public localPlayer: Player;
    public localPlayerGui: PlayerGui;
    public inventoryScreen: ScreenGui;
    public otherInventoryScreen: Frame;

    constructor() {
        this.localPlayer = Players.LocalPlayer;
        this.localPlayerGui = this.localPlayer.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
        this.inventoryScreen = this.localPlayerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;
        this.otherInventoryScreen = this.inventoryScreen.WaitForChild(FileNames.OTHER_INVENTORY) as Frame;
    }

    public addItem(item: Frame) {
        if (item) {
            item.Parent = this.otherInventoryScreen;
        } else {
            print("Please provide item. Item cannot be null!")
        }
    }
}