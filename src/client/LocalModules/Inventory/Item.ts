import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ItemEnum} from "../../../shared/Modules/Enums/ItemEnum";

export default class Item {
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemCategoryText: TextLabel;

    constructor(item: Frame, itemEnum: ItemEnum) {
        this.itemFrame = item.Clone();
        this.itemFrame.Visible = true;
        this.itemFrame.Parent = item.Parent;

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;

        const itemEnumStrings = Item.formatItemEnum(itemEnum);
        this.itemIcon.Image = itemEnumStrings[0];
        this.itemTypeText.Text = itemEnumStrings[1];
        this.itemCategoryText.Text = itemEnumStrings[2];
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }

    //TODO Maybe create class of this to make it more explesite
    private static formatItemEnum(itemEnum: ItemEnum): string[] {
        return itemEnum.split(",");
    }
}