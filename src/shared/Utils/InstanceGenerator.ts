import {HttpService} from "@rbxts/services";

export default class InstanceGenerator {

    public static generateId(parent: Instance | undefined,
                             name = "Id",
                             guid = this.generateGUID()): StringValue {
        const newId = new Instance("StringValue") as StringValue;
        newId.Name = name;
        newId.Parent = parent;
        newId.Value = guid;
        return newId;
    }

    public static generateStringValue(parent: Instance | undefined,
                                      value: string,
                                      name = "StringValue"): StringValue {
        const stringValue = new Instance("StringValue") as StringValue;
        stringValue.Name = name;
        stringValue.Parent = parent;
        stringValue.Value = value;
        return stringValue
    }

    public static generateGUID(): string {
        return HttpService.GenerateGUID();
    }
}