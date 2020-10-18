import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ItemIds} from "../../../shared/Modules/Enums/ItemIds";

export default class Item {
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemCategoryText: TextLabel;

    constructor(item: Frame, itemIcon: ItemIds, itemTypeText: string, itemCategoryText: string) {
        this.itemFrame = item.Clone();
        this.itemFrame.Parent = item.Parent;

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;

        this.itemIcon.Image = itemIcon;
        this.itemTypeText.Text = itemTypeText;
        this.itemCategoryText.Text = itemCategoryText;
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }
}