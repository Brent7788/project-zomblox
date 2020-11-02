import {ItemEnum} from "./Enums/ItemEnum";
import InstanceGenerator from "../Utils/InstanceGenerator";
import {FileNames} from "./Enums/FileNames";

export default class ItemValue {
    public id: string;
    public itemUIValues: ItemEnum | string;
    public itemCount: number;
    public itemIcon: string;
    public itemType: string;
    public itemCategory: string;

    constructor(itemCount: number | undefined, itemUIValues: ItemEnum | string) {
        this.itemCount = itemCount !== undefined ? itemCount : 1;
        this.itemUIValues = itemUIValues;

        const itemValues = ItemValue.formatItemEnum(itemUIValues);
        this.itemIcon = itemValues[0].trim();
        this.itemType = itemValues[1].trim();
        this.itemCategory = itemValues[2].trim();
        this.id = this.getIdFromIconImage();
    }


    public toObjectString(): string {
        return `${this.itemCount};${this.itemUIValues}`;
    }

    public createContainerItem(parent: Instance): void {
        const containerItem = InstanceGenerator
            .generateBoolValue(parent, false, FileNames.CONTAINER_ITEM)
        InstanceGenerator.generateStringValue(containerItem, this.id, FileNames.ID);
        InstanceGenerator.generateStringValue(containerItem, this.itemIcon, FileNames.ITEM_ICON);
        InstanceGenerator.generateStringValue(containerItem, this.itemType, FileNames.ITEM_TYPE);
        InstanceGenerator.generateStringValue(containerItem, this.itemCategory, FileNames.ITEM_CATEGORY);
        InstanceGenerator.generateIntValue(containerItem, this.itemCount, FileNames.ITEM_QUANTITY);
    }

    public static formatItemEnum(itemEnum: ItemEnum | string): string[] {
        return itemEnum.split(",");
    }

    private getIdFromIconImage(): string {
        return this.itemIcon.gsub("rbxassetid://", "")[0];
    }
}