import {Debris, HttpService, Workspace} from "@rbxts/services";

export default class InstanceGenerator {

    private static readonly STRING_VALUE_NAME = "StringValue";
    private static readonly BOOL_VALUE_NAME = "BoolValue";
    private static readonly INT_VALUE_NAME = "IntValue";

    public static generateId(parent: Instance | undefined,
                             name = "Id",
                             guid = this.generateGUID()): StringValue {
        const newId = new Instance(this.STRING_VALUE_NAME) as StringValue;
        newId.Name = name;
        newId.Parent = parent;
        newId.Value = guid;
        return newId;
    }

    public static generateStringValue(parent: Instance | undefined,
                                      value = "",
                                      name = this.STRING_VALUE_NAME): StringValue {
        const stringValue = new Instance(this.STRING_VALUE_NAME) as StringValue;
        stringValue.Name = name;
        stringValue.Parent = parent;
        stringValue.Value = value;
        return stringValue
    }

    public static generateBoolValue(parent: Instance,
                                    value = false,
                                    name = this.BOOL_VALUE_NAME): BoolValue {
        const boolValue = new Instance(this.BOOL_VALUE_NAME) as BoolValue;
        boolValue.Name = name;
        boolValue.Parent = parent;
        boolValue.Value = value;
        return boolValue
    }

    public static generateIntValue(parent: Instance,
                                    value = 0,
                                    name = this.INT_VALUE_NAME): IntValue {
        const intValue = new Instance(this.INT_VALUE_NAME) as IntValue;
        intValue.Name = name;
        intValue.Parent = parent;
        intValue.Value = value;
        return intValue
    }

    public static generateGUID(): string {
        return HttpService.GenerateGUID();
    }

    public static generateWayPoint(waypointPosition: Vector3): Part {
        const part = new Instance("Part");
        part.Name = "WayPoint";
        part.Shape = Enum.PartType.Ball;
        part.Material =  Enum.Material.Neon;
        part.Size = new Vector3(0.3, 0.3, 0.3)
        part.Position = waypointPosition;
        part.Color = new Color3(219, 75, 39);
        part.Anchored = true;
        part.CanCollide = false;
        part.Parent = Workspace;
        return part;
    }

    public static debugBeam(distance: Vector3, newCFrame: CFrame): void {
        const beam = new Instance("Part")
        beam.BrickColor = new BrickColor("Bright red")
        beam.Material = Enum.Material.Neon
        beam.Anchored = true
        beam.CanCollide = false
        beam.Name = "RaycastHitboxDebugPart"

        const Dist = (distance).Magnitude
        beam.Size = new Vector3(0.1, 0.1, Dist)
        beam.CFrame = newCFrame.mul(new CFrame(0, 0, -Dist / 2));

        beam.Parent = Workspace.Terrain
        Debris.AddItem(beam, 1);
    }
}