import PlayerInventory from "../LocalModules/PlayerInventory";
import OtherInventory from "../LocalModules/OtherInventory";
import {FileNames} from "../../shared/Modules/Enums/FileNames";


export default class InventoryService {

    private playerInventory: PlayerInventory;
    private otherInventory: OtherInventory;

    constructor() {
        this.playerInventory = new PlayerInventory();
        this.otherInventory = new OtherInventory();
        this.onArrowMoveItem(this.playerInventory.item);
    }

    public toggleInventory(): void {
        this.playerInventory.playerInventoryScreen.Enabled = !this.playerInventory.playerInventoryScreen.Enabled;
    }

    public addAnyItem() {
        const itemClone = this.playerInventory.item.Clone();
        itemClone.Parent = this.playerInventory.playerInventoryFrame;
        const arrowButton = itemClone.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;

        arrowButton.Rotation = 0;

        this.onArrowMoveItem(itemClone);
    }

    public onArrowMoveItem(item: Frame): void {

        const arrowButton = item.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;

        arrowButton.MouseButton1Click.Connect(() => {
            if (item && item.Parent && item.Parent.Name === FileNames.PLAYER_INVENTORY) {
                item.Parent = this.otherInventory.otherInventoryScreen;
                arrowButton.Rotation = 180;
            } else if((item && item.Parent && item.Parent.Name === FileNames.OTHER_INVENTORY)) {
                item.Parent = this.playerInventory.playerInventoryFrame;
                arrowButton.Rotation = 0;
            } else {
                print("In addAnyItem, the itemClone is null!");
            }
        });
    }
}