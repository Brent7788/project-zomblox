import {RunService, TweenService, Workspace} from "@rbxts/services";
import InstanceGenerator from "../shared/Utils/InstanceGenerator";
import ZombieCrossPoint from "./ServerModules/ZombieCrossPoint";
import ZombieService from "./ServerServices/Zombie/ZombieService";
import {FileNames} from "../shared/Modules/Enums/FileNames";

const z = Workspace.WaitForChild(FileNames.ZOMBIES)
    .WaitForChild(FileNames.LIVE_ZOMBIES).GetChildren()[0];
const h = z.FindFirstChild(FileNames.HUMANOID);

/*
TweenService.Create(
  z,
  new TweenInfo(5),
    {Po: true
    }
);
*/

