import {ItemEnum} from "./Enums/ItemEnum";

export default class ItemValue {
    public itemCount: number;
    public itemUIValues: ItemEnum | string;

    constructor(itemCount: number | undefined, itemUIValues: ItemEnum | string) {
        this.itemCount = itemCount !== undefined ? itemCount : 1;
        this.itemUIValues = itemUIValues;
    }

    public toObjectString(): string {
        return `${this.itemCount};${this.itemUIValues}`;
    }
}