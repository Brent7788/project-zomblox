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

/*
let count = 0;
let tt = true;

RunService.Heartbeat.Connect(step => {

    switch (tt) {
        case true:
            tt = false;
            wait(1);
            print("DONE", count);
            tt = true;
            break;
    }
});*/
