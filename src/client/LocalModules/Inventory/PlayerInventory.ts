import {Players} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";

export default class PlayerInventory {
    public localPlayerGui: PlayerGui;
    public playerInventoryScreen: ScreenGui;
    public playerInventoryFrame: Frame;
    public baseItem: Frame;

    constructor(localPlayer: Player) {
        this.localPlayerGui = localPlayer.WaitForChild(FileNames.PLAYER_GUI) as PlayerGui;
        this.playerInventoryScreen = this.localPlayerGui.WaitForChild(FileNames.INVENTORY_GUI) as ScreenGui;
        this.playerInventoryScreen.Enabled = false;
        this.playerInventoryFrame = this.playerInventoryScreen.WaitForChild(FileNames.PLAYER_INVENTORY) as Frame;
        this.baseItem = this.playerInventoryFrame.WaitForChild(FileNames.BASE_ITEM) as Frame;
        this.baseItem.Visible = false;
    }

    public destroy(instances: Instance[], destroy?: (index: number) => void): void {
        if (instances !== undefined && instances.size() > 1) {
            for (let i = 0; i < instances.size(); i++) {
                switch (instances[i].Name) {
                    case "OtherItemList":
                        break;
                    case "OtherContainerList":
                        break;
                    case FileNames.BASE_ITEM:
                        break;
                    case FileNames.BASE_CONTAINERS:
                        break;
                    case FileNames.UI_ITEM:
                        if (destroy === undefined) {
                            instances[i].Destroy();
                        } else {
                            destroy(i);
                        }
                        break;
                    case "Container":
                        if (destroy === undefined) {
                            instances[i].Destroy();
                        } else {
                            destroy(i);
                        }
                        break;
                }
            }
        }
    }
}