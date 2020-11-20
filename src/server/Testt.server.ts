import {Players, Workspace} from "@rbxts/services";
import RaycastHitbox from "../shared/Utils/RaycastHitbox/RaycastHitbox";
import InstanceGenerator from "../shared/Utils/InstanceGenerator";
import {FileNames} from "../shared/Modules/Enums/FileNames";

const t = Workspace.FindFirstChild("TestP") as Part;
const t2 = Workspace.FindFirstChild("TestP2") as Part;

//t.CFrame = t.CFrame.ToWorldSpace(new CFrame(new Vector3(10,0,0)));

print(math.deg(t.CFrame.ToAxisAngle()[1]));
print("X: "+math.deg(t.CFrame.ToEulerAnglesXYZ()[0]),
    "Y: "+math.deg(t.CFrame.ToEulerAnglesXYZ()[1]),
    "Z: "+math.deg(t.CFrame.ToEulerAnglesXYZ()[2]));

print(math.deg(t2.CFrame.ToAxisAngle()[1]));
print("X: "+math.deg(t2.CFrame.ToEulerAnglesXYZ()[0]),
    "Y: "+math.deg(t2.CFrame.ToEulerAnglesXYZ()[1]),
    "Z: "+math.deg(t2.CFrame.ToEulerAnglesXYZ()[2]));
