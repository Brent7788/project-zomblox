import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ItemEnum} from "../../../shared/Modules/Enums/ItemEnum";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";

export default class Item {
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemCategoryText: TextLabel;
    public containerId: StringValue;
    public itemValue: StringValue;

    constructor(item: Frame, itemEnum: ItemEnum | string, guid: string, itemCount = 1) {
        this.itemFrame = item.Clone();
        this.itemFrame.Visible = true;
        this.itemFrame.Parent = item.Parent;
        this.itemFrame.Name = FileNames.ITEM;

        this.containerId = InstanceGenerator.generateId(this.itemFrame, FileNames.CONTAINER_ID, guid);
        this.itemValue = InstanceGenerator.generateStringValue(
            this.itemFrame,
            `${itemCount};${itemEnum}#`,
            "ItemValue");

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;

        const itemEnumStrings = Item.formatItemEnum(itemEnum);
        this.itemIcon.Image = itemEnumStrings[0];
        this.itemTypeText.Text = itemEnumStrings[1];
        this.itemCategoryText.Text = itemEnumStrings[2];
    }

    //TODO Maybe create class of this to make it more explesite
    private static formatItemEnum(itemEnum: ItemEnum | string): string[] {
        return itemEnum.split(",");
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }

    public static destroyItems(items: Instance[], destroy?: (index: number) => void): void {
        if (items !== undefined && items.size() > 1) {
            for (let i = 0; i < items.size(); i++) {
                switch (items[i].Name) {
                    case "OtherItemList":
                        break;
                    case FileNames.BASE_ITEM:
                        break;
                    case FileNames.ITEM:
                        if (destroy === undefined) {
                            items[i].Destroy();
                        } else {
                            destroy(i);
                        }
                        break;
                }
            }
        }
    }
}