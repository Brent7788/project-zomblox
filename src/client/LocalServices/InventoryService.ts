import PlayerInventory from "../LocalModules/Inventory/PlayerInventory";
import OtherInventory from "../LocalModules/Inventory/OtherInventory";
import {FileNames} from "../../shared/Modules/Enums/FileNames";
import {ItemEnum} from "../../shared/Modules/Enums/ItemEnum";
import Item from "../LocalModules/Inventory/Item";


export default class InventoryService {

    private playerInventory: PlayerInventory;
    private otherInventory: OtherInventory;

    constructor() {
        this.playerInventory = new PlayerInventory();
        this.otherInventory = new OtherInventory();
    }

    public toggleInventory(): void {
        this.playerInventory.playerInventoryScreen.Enabled = !this.playerInventory.playerInventoryScreen.Enabled;
    }

    public createItem(itemEnum: ItemEnum) {

        const newItem = new Item(this.playerInventory.baseItem, itemEnum);

        newItem.itemArrowButton.Rotation = 0;

        this.onArrowMoveItem(newItem);
    }

    public addAnyItem() {

        const newItem = new Item(this.playerInventory.baseItem, ItemEnum.BLOCK_FRYING_PAN);

        newItem.itemArrowButton.Rotation = 0;

        this.createItem(ItemEnum.HUNTING_KNIFE);

        this.onArrowMoveItem(newItem);
    }

    public onArrowMoveItem(item: Item): void {

        item.itemArrowButton.MouseButton1Click.Connect(() => {
            if (item && item.getItemParent() && item.getItemParent().Name === FileNames.PLAYER_INVENTORY) {
                item.setItemParent(this.otherInventory.otherInventoryScreen);
                item.itemArrowButton.Rotation = 180;
            } else if ((item && item.getItemParent() && item.getItemParent().Name === FileNames.OTHER_INVENTORY)) {
                item.setItemParent(this.playerInventory.playerInventoryFrame);
                item.itemArrowButton.Rotation = 0;
            } else {
                print("In addAnyItem, the itemClone is null!");
            }
        });
    }
}