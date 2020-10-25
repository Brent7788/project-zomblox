import ItemValue from "../Modules/ItemValue";
import {ItemEnum} from "../Modules/Enums/ItemEnum";
import {HttpService, Workspace} from "@rbxts/services";

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

    private itemValueArrayToString(itemValues: ItemValue[]): string {
        let itemValuesAsString = "";

        itemValues.forEach((item) => {
            itemValuesAsString += item.toObjectString() + "#";
        });

        return itemValuesAsString;
    }
}