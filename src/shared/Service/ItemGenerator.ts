import ItemValue from "../Modules/ItemValue";
import {ItemEnum} from "../Modules/Enums/ItemEnum";
import {Workspace} from "@rbxts/services";

export default class ItemGenerator {

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
        this.testContainerStringValues.forEach(stringValue => {
           stringValue.Value = this.generateTestItems();
        });
    }

    public toItemValueArray(itemValuesAsString: string): ItemValue[] {
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

    public generateTestItems(): string {
        const item = new ItemValue(1, ItemEnum.CLEAVER_KNIFE);
        const item2 = new ItemValue(3, ItemEnum.HUNTING_KNIFE);
        const items = [item, item2];

        return this.itemValueArrayToString(items);
    }

    private itemValueArrayToString(itemValues: ItemValue[]): string {
        let itemValuesAsString = "";

        itemValues.forEach((item) => {
            itemValuesAsString += item.toObjectString() + "#";
        });

        return itemValuesAsString;
    }
}