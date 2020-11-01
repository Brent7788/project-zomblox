import ItemValue from "../Modules/ItemValue";
import {ItemCategory, ItemEnum, ItemIcon, ItemType} from "../Modules/Enums/ItemEnum";
import {Workspace} from "@rbxts/services";
import InstanceGenerator from "../Utils/InstanceGenerator";
import {FileNames} from "../Modules/Enums/FileNames";

export default class ItemGeneratorService {

    private testContainers: Array<Instance>;
    private testContainerStringValues: StringValue[] = [];

    constructor() {
        this.testContainers = Workspace.WaitForChild("TestParts")
            .WaitForChild("TestContainers").GetChildren() as Array<Instance>;

        this.testContainers.forEach((con) => {
            const stringValue = con.FindFirstChild("Container#") as StringValue;
            if (stringValue !== undefined) {
                this.testContainerStringValues.push(stringValue);
            }
        });
    }

    public initTestItems(): void {
        let switchh = true;
        this.testContainerStringValues.forEach(stringValue => {
            if (switchh) {
                stringValue.Value = this.generateTestItems1();
            } else {
                stringValue.Value = this.generateTestItems2();
            }
            switchh = !switchh;
        });
    }

    public initTestItems2(): void {
        let switchh = true;
        this.testContainers.forEach(containerPart => {
            if (switchh) {
                const item = new ItemValue(1, ItemEnum.CLEAVER_KNIFE);
                const item2 = new ItemValue(3, ItemEnum.HUNTING_KNIFE);
                item.createContainerItem(containerPart);
                item2.createContainerItem(containerPart);
            } else {
                const item = new ItemValue(1, ItemEnum.KNIFE);
                const item2 = new ItemValue(3, ItemEnum.BLOCK_FRYING_PAN);
                item.createContainerItem(containerPart);
                item2.createContainerItem(containerPart);
            }
            switchh = !switchh;
        });
    }

    //TODO This should not be here
    public static toItemValueArray(itemValuesAsString: string): ItemValue[] {
        const splitItemValuesAsString = itemValuesAsString.split("#");
        const items: ItemValue[] = [];
        splitItemValuesAsString.forEach((itemValString) => {
            const splitItemValString = itemValString.split(";");
            if (splitItemValString !== undefined && splitItemValString.size() > 1) {
                items.push(new ItemValue(tonumber(splitItemValString[0]), splitItemValString[1]));
            }
        });
        return items;
    }

    //TODO This should not be here
    public static toItemValue(itemValuesAsString: string): ItemValue | undefined {
        let itemValue: ItemValue | undefined = undefined;

        const splitItemValString = itemValuesAsString.split(";");
        if (splitItemValString !== undefined && splitItemValString.size() > 1) {
            itemValue = new ItemValue(tonumber(splitItemValString[0]), splitItemValString[1]);
        }
        return itemValue;
    }

    public generateTestItems1(): string {
        const item = new ItemValue(1, ItemEnum.CLEAVER_KNIFE);
        const item2 = new ItemValue(3, ItemEnum.HUNTING_KNIFE);
        const items = [item, item2];

        return this.itemValueArrayToString(items);
    }

    public generateTestItems2(): string {
        const item = new ItemValue(1, ItemEnum.KNIFE);
        const item2 = new ItemValue(3, ItemEnum.BLOCK_FRYING_PAN);
        const items = [item, item2];

        return this.itemValueArrayToString(items);
    }

    /*private createContainerItem(parent: Instance,
                               itemValue: ItemValue): void {
        const containerItem = InstanceGenerator
            .generateBoolValue(parent, false, FileNames.CONTAINER_ITEM)
        InstanceGenerator.generateStringValue(containerItem, itemValue.id, FileNames.ID);
        InstanceGenerator.generateStringValue(containerItem, itemValue.itemIcon, FileNames.ITEM_ICON);
        InstanceGenerator.generateStringValue(containerItem, itemValue.itemType, FileNames.ITEM_TYPE);
        InstanceGenerator.generateStringValue(containerItem, itemValue.itemCategory, FileNames.ITEM_CATEGORY);
        InstanceGenerator.generateIntValue(containerItem, itemValue.itemCount, FileNames.ITEM_QUANTITY);
    }*/

    private itemValueArrayToString(itemValues: ItemValue[]): string {
        let itemValuesAsString = "";

        itemValues.forEach((item) => {
            itemValuesAsString += item.toObjectString() + "#";
        });

        return itemValuesAsString;
    }
}