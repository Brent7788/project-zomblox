import {Workspace} from "@rbxts/services";
import InstanceGenerator from "../shared/Utils/InstanceGenerator";
import ZombieCrossPoint from "./ServerModules/ZombieCrossPoint";
import ZombieService from "./ServerServices/Zombie/ZombieService";


/*
private async
zombieChasePlayer(zombie
:
ZombieService, playerRootPart
:
Part
):
Promise < void > {
    print("playerRootPart", playerRootPart
)
;
let x = math.round(playerRootPart.Position.X);
let z = math.round(playerRootPart.Position.Z);
let zombieDistinctBetweenPlayer = zombie.Position().sub(playerRootPart.Position).Magnitude;

while (wait(0.1)) {

    zombie.path.ComputeAsync(zombie.Position(), playerRootPart.Position);

    if (zombie.path.Status === Enum.PathStatus.Success) {

        let waypoints = zombie.path.GetWaypoints();

        let canLookNewWayPoint = true;


        for (let i = 0; i < waypoints.size(); i++) {

            if (i === 0 && waypoints.size() >= 1) {
                zombie.zombieHumanoid.MoveTo(waypoints[i + 1].Position);
                zombie.zombieHumanoid.MoveToFinished.Wait();
            } else {
                zombie.zombieHumanoid.MoveTo(waypoints[i].Position);
                zombie.zombieHumanoid.MoveToFinished.Wait();
            }

            if ((math.round(playerRootPart.Position.X) !== x ||
                math.round(playerRootPart.Position.Z) !== z) && canLookNewWayPoint) {

                /!*waypoints = this.testt2(zombie, root, waypoints);
                i = -1;*!/

                canLookNewWayPoint = false;
                this.testt(zombie, playerRootPart, waypoints).then((values) => {
                    canLookNewWayPoint = true;
                    waypoints = values;
                    i = -1;
                }).catch((reason) => {
                    warn("Error in zombieChasePlayer", reason);
                });
            }
            zombieDistinctBetweenPlayer = zombie.Position().sub(playerRootPart.Position).Magnitude;
            //TODO Make zombie range random settings
            if (zombieDistinctBetweenPlayer > 40) {
                zombie.isChasingPlayer = false;
                //const i = this.zombieBrain(new Random(), zombie);
                //break;
            } else if (zombieDistinctBetweenPlayer <= 6) {
                this.moveing(zombie, playerRootPart)
                    .then()
                    .catch((reason) => warn("Error in zombieChasePlayer", reason));
                break;
            }

            x = math.round(playerRootPart.Position.X);
            z = math.round(playerRootPart.Position.Z);
        }
    }

    zombieDistinctBetweenPlayer = zombie.Position().sub(playerRootPart.Position).Magnitude;
    //TODO Make zombie range random settings
    if (zombieDistinctBetweenPlayer > 40) {
        zombie.isChasingPlayer = false;
        this.zombieBrain(new Random(), zombie, false)
            .then()
            .catch((reason) => warn("Error in zombieChasePlayer", reason));
        break;
    } else if (zombieDistinctBetweenPlayer <= 6) {
        break;
    }

    x = math.round(playerRootPart.Position.X);
    z = math.round(playerRootPart.Position.Z);
}
}*/

/*private async moveing(zombie: ZombieService, playerRootPart: Part): Promise<void> {
    let zombieDistinctBetweenPlayer = zombie.Position().sub(playerRootPart.Position).Magnitude;
    const zombieOldSpeed = zombie.zombieHumanoid.WalkSpeed;
    zombie.zombieHumanoid.WalkSpeed = 8;
    /!*zombie.zombieHumanoid.MoveToFinished.Connect((reached) => {
        print('R', reached);
    })*!/
    while (wait(0.1)) {
    zombie.zombieHumanoid.MoveTo(playerRootPart.Position);
    if (zombieDistinctBetweenPlayer > 6) {
        zombie.zombieHumanoid.WalkSpeed = zombieOldSpeed;
        this.zombieChasePlayer(zombie, playerRootPart).then();
        break;
    }
    zombie.zombieHumanoid.MoveToFinished.Wait();
    zombieDistinctBetweenPlayer = zombie.Position().sub(playerRootPart.Position).Magnitude;
}
}*/

/*private async testt(zombie: ZombieService,
    root: Part,
    waypoints: PathWaypoint[]): Promise<PathWaypoint[]> {

    return new Promise<PathWaypoint[]>((resolve) => {
        zombie.path.ComputeAsync(zombie.Position(), root.Position);

        if (zombie.path.Status === Enum.PathStatus.Success) {

            waypoints = zombie.path.GetWaypoints();

            //Create visible waypoints
            /!*for (let i = 0; i < waypoints.size(); i++) {
                InstanceGenerator.generateWayPoint(waypoints[i].Position);
            }*!/
        }
        resolve(waypoints);
    });
}*/
