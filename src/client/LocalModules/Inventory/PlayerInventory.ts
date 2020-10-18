import {Players} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";

export default class PlayerInventory {
    public localPlayer: Player;
    public localPlayerGui: PlayerGui;
    public playerInventoryScreen: ScreenGui;
    public playerInventoryFrame: Frame;
    public baseItem: Frame;

    constructor() {
        this.localPlayer = Players.LocalPlayer;
        this.localPlayerGui = this.localPlayer.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
        this.playerInventoryScreen = this.localPlayerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;
        this.playerInventoryScreen.Enabled = false;
        this.playerInventoryFrame = this.playerInventoryScreen.WaitForChild(FileNames.PLAYER_INVENTORY) as Frame;
        this.baseItem = this.playerInventoryFrame.WaitForChild(FileNames.ITEM) as Frame;
        this.baseItem.Visible = false;
    }
}