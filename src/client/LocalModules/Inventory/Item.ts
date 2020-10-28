import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ItemEnum} from "../../../shared/Modules/Enums/ItemEnum";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {Players} from "@rbxts/services";
import ItemValue from "../../../shared/Modules/ItemValue";

export default class Item {
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemCategoryText: TextLabel;
    public containerId: StringValue;
    //TODO Why have this proprty
    //public itemStringValue: StringValue;
    public itemPopUpDescFrame: Frame;
    public itemQuantityText: TextLabel;
    public itemValue: ItemValue;

    constructor(item: Frame, guid: string, itemValue: ItemValue) {
        this.itemFrame = item.Clone();
        this.itemFrame.Visible = true;
        this.itemFrame.Parent = item.Parent;
        this.itemFrame.Name = FileNames.ITEM;
        this.itemValue = itemValue;

        this.containerId = InstanceGenerator.generateId(this.itemFrame, FileNames.CONTAINER_ID, guid);
        /*this.itemStringValue = InstanceGenerator.generateStringValue(
            this.itemFrame,
            `${this.itemValue.itemCount};${this.itemValue.itemUIValues}#`,
            "ItemValue");*/

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;

        const itemEnumStrings = Item.formatItemEnum(this.itemValue.itemUIValues);
        this.itemIcon.Image = itemEnumStrings[0];
        this.itemTypeText.Text = itemEnumStrings[1];
        this.itemCategoryText.Text = itemEnumStrings[2];

        this.itemPopUpDescFrame = item.Parent?.Parent?.FindFirstChild(FileNames.ITEM_POP_UP_DESC) as Frame;
        this.itemQuantityText = this.itemPopUpDescFrame.FindFirstChild(FileNames.ITEM_QUANTITY) as TextLabel;

        this.onMouce();
    }

    //TODO Maybe create class of this to make it more explesite
    private static formatItemEnum(itemEnum: ItemEnum | string): string[] {
        return itemEnum.split(",");
    }

    //TODO Not done yet
    private onMouce() {
        let stop = true;

        this.itemFrame.MouseEnter.Connect(() => {
            print("Mousdfsd", this.itemPopUpDescFrame.Parent, this.itemPopUpDescFrame.Visible);
            stop = true;
            this.itemQuantityText.Text = `   Item Quantity: ${this.itemValue.itemCount}`;
            while (stop) {
                this.itemPopUpDescFrame.Visible = true;
                const playerMouse = Players.LocalPlayer.GetMouse() as PlayerMouse;
                print("stropopp", stop);
                wait()
                this.itemPopUpDescFrame.Position = UDim2.fromOffset(playerMouse.X + 8, playerMouse.Y + 8);
            }
        });
        this.itemFrame.MouseLeave.Connect((x, y) => {
            print("Mouse OUT");
            this.itemPopUpDescFrame.Visible = false;
            stop = false;
        });
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }
}