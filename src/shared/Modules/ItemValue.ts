import {ItemEnum} from "./Enums/ItemEnum";

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

        const itemValues = this.formatItemEnum(itemUIValues);
        this.itemIcon = itemValues[0];
        this.itemType = itemValues[1];
        this.itemCategory = itemValues[2];
        this.id = this.getIdFromIconImage();
    }


    public toObjectString(): string {
        return `${this.itemCount};${this.itemUIValues}`;
    }

    private formatItemEnum(itemEnum: ItemEnum | string): string[] {
        return itemEnum.split(",");
    }

    private getIdFromIconImage(): string {
        return this.itemIcon.gsub("rbxassetid://", "")[0];
    }
}