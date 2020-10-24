import {FileNames} from "../../../shared/Modules/Enums/FileNames";


export default class OtherContainers {
    public localPlayerGui: PlayerGui;
    public inventoryScreen: ScreenGui;
    public otherInventoryScreen: Frame;
    public baseContainer: Frame;

    constructor(localPlayer: Player) {
        this.localPlayerGui = localPlayer.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
        this.inventoryScreen = this.localPlayerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;
        this.otherInventoryScreen = this.inventoryScreen.WaitForChild(FileNames.OTHER_CONTAINERS) as Frame;
        this.baseContainer = this.otherInventoryScreen.WaitForChild(FileNames.BASE_CONTAINERS) as Frame;
        this.baseContainer.Visible = false;
    }
}