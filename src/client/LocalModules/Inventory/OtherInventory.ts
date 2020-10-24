import {FileNames} from "../../../shared/Modules/Enums/FileNames";

export default class OtherInventory {
    public localPlayerGui: PlayerGui;
    public inventoryScreen: ScreenGui;
    public otherInventoryScreen: Frame;
    public baseItem: Frame;

    constructor(localPlayer: Player) {
        this.localPlayerGui = localPlayer.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
        this.inventoryScreen = this.localPlayerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;
        this.otherInventoryScreen = this.inventoryScreen.WaitForChild(FileNames.OTHER_INVENTORY) as Frame;
        this.baseItem = this.otherInventoryScreen.WaitForChild(FileNames.BASE_ITEM) as Frame;
        this.baseItem.Visible = false;
    }

    public addItem(item: Frame) {
        if (item) {
            item.Parent = this.otherInventoryScreen;
        } else {
            print("Please provide item. Item cannot be null!")
        }
    }
}