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

    public getUIContainerById(containerId: string): Frame | undefined {
        const otherContainerChildren = this.otherContainerScreen.GetChildren();

        let uiContainer: Frame | undefined = undefined;
        for (let i = 0; i < otherContainerChildren.size(); i++) {
            const itemIdStringValue = otherContainerChildren[i].FindFirstChild(FileNames.CONTAINER_ID) as StringValue;

            if (itemIdStringValue !== undefined && itemIdStringValue.Value === containerId) {
                uiContainer = otherContainerChildren[i] as Frame;
                break;
            }
        }

        return uiContainer;
    }
}