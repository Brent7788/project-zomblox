import {FileNames} from "../../../shared/Modules/Enums/FileNames";


export default class OtherContainers {
    public localPlayerGui: PlayerGui;
    public inventoryScreen: ScreenGui;
    public otherContainerScreen: Frame;
    public baseContainer: Frame;

    constructor(localPlayer: Player) {
        this.localPlayerGui = localPlayer.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
        this.inventoryScreen = this.localPlayerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;
        this.otherContainerScreen = this.inventoryScreen.WaitForChild(FileNames.OTHER_CONTAINERS) as Frame;
        this.baseContainer = this.otherContainerScreen.WaitForChild(FileNames.BASE_CONTAINERS) as Frame;
        this.baseContainer.Visible = false;
    }
}