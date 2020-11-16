import {Players, Workspace} from "@rbxts/services";
import RaycastHitbox from "../shared/Utils/RaycastHitbox/RaycastHitbox";
import {FileNames} from "../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../shared/Utils/InstanceGenerator";

/*const test = Workspace.WaitForChild("TestMe") as Part;
const test2 = Workspace.WaitForChild("TestMe2") as Part;
print("Start", test);

const hitbox = RaycastHitbox.Initialize(test);

/!*hitbox.hitboxObject?.SetPoints(test,
    [new Vector3(1, 0, 0), new Vector3(5, 0, 0), new Vector3(10, 0, 0)]);*!/


hitbox.OnHit((hitPart, humanoid) => {
    print("IT works",hitPart, humanoid);
});

hitbox.HitStart();

wait(15);
RaycastHitbox.Deinitialize(test);

const hitbox2 = RaycastHitbox.Initialize(test2);

/!*hitbox.hitboxObject?.SetPoints(test,
    [new Vector3(1, 0, 0), new Vector3(5, 0, 0), new Vector3(10, 0, 0)]);*!/



hitbox2.OnHit((hitPart, humanoid) => {
    print("IT works",hitPart, humanoid);
});

hitbox2.HitStart();
wait(10);
hitbox2.HitStop();*/
