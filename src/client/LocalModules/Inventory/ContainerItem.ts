import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import ItemValue from "../../../shared/Modules/ItemValue";


export default class ContainerItem {
    public containerItemBool: BoolValue;
    public id: StringValue;
    public itemIcon: StringValue;
    public itemType: StringValue;
    public itemCategory: StringValue;
    public itemQuantity: IntValue;

    constructor(containerItemBool: BoolValue) {
        this.containerItemBool = containerItemBool;
        this.id = containerItemBool.FindFirstChild(FileNames.ID) as StringValue;
        this.itemIcon = containerItemBool.FindFirstChild(FileNames.ITEM_ICON) as StringValue;
        this.itemType = containerItemBool.FindFirstChild(FileNames.ITEM_TYPE) as StringValue;
        this.itemCategory = containerItemBool.FindFirstChild(FileNames.ITEM_CATEGORY) as StringValue;
        this.itemQuantity = containerItemBool.FindFirstChild(FileNames.ITEM_QUANTITY) as IntValue;
    }

    public getItemValue(): ItemValue {
        return new ItemValue(this.itemQuantity.Value, this.getItemUIValue());
    }

    public getItemUIValue(): string {
        return `${this.itemIcon.Value},${this.itemType.Value},${this.itemCategory}`;
    }
}