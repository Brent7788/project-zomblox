import {PathfindingService, Players, Workspace} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import ZombieService from "./ZombieService";
import ZombiePath from "../../ServerModules/ZombiePath";
import ZombieCrossPoint from "../../ServerModules/ZombieCrossPoint";

export default class ZombieBehaviourService {

    //private path: Path;
    private readonly zombieModels: Instance[] | undefined;
    private readonly zombies: ZombieService[] = [];
    //private readonly zombiesRayCastParams: RaycastParams;
    private zombiePaths: ZombiePath[] = [];
    private players: Player[] = [];

    constructor() {
        /*this.path = PathfindingService.CreatePath({
            AgentHeight: 5,
            AgentRadius: 2.5,
            AgentCanJump: false
        });*/
        this.zombieModels = Workspace.FindFirstChild(FileNames.ZOMBIES)
            ?.FindFirstChild(FileNames.LIVE_ZOMBIES)?.GetChildren();

        this.setZombieServices();

        /*Players.PlayerAdded.Connect(player => {
            print(player);
            this.players.push(player);
        });*/

        Players.PlayerRemoving.Connect(player => {
            print("remove", player)
            for (let i = 0; i < this.players.size(); i++) {
                if (this.players[i].UserId === player.UserId) {
                    this.players.remove(i);
                    break;
                }
            }
        });

        //TODO Put in private method
        /*this.zombiesRayCastParams = new RaycastParams();
        this.zombiesRayCastParams.FilterType = Enum.RaycastFilterType.Whitelist;
        this.zombiesRayCastParams.FilterDescendantsInstances =
            (this.zombieModels !== undefined) ? this.zombieModels : [];*/

    }

    private setZombieServices(): void {
        if (this.zombieModels !== undefined) {
            for (const zombieModel of this.zombieModels) {
                this.zombies.push(new ZombieService(zombieModel as Model));
            }
        }
    }

    public initZombie(): void {
        const random = new Random();

        for (let i = 0; i < this.zombies.size(); i++) {
            const promise = this.zombieBrain(
                random,
                this.zombies[i]);
        }

        Players.PlayerAdded.Connect(player => {
            print(player);
            this.players.push(player);
            const p = this.zombieToPlayer(player);
        });
    }

    private async zombieToPlayer(player: Player): Promise<void> {
        const inRange = 40;
        print("WAht is playerysdf", player);

        while (wait(1)) {
            for (const zombie of this.zombies) {

                if (!zombie.isChasingPlayer) {
                    const d = player.DistanceFromCharacter(zombie.Position());
                    if (d <= inRange) {
                        zombie.isChasingPlayer = true;
                        print("IN RANGE", zombie.id);
                        const root = player.Character?.FindFirstChild(FileNames.HUMANOID_ROOT_PART) as Part;

                        const mm = this.zombieChasePlayer(zombie, root);
                    }
                }
            }
        }
    }

    private async zombieChasePlayer(zombie: ZombieService, root: Part): Promise<void> {
        let x = math.round(root.Position.X);
        let z = math.round(root.Position.Z);
        let m = zombie.Position().sub(root.Position).Magnitude;

        zombie.path.Blocked.Connect(blockedWaypointIdx => {
           print("BLOCKKKKKK", blockedWaypointIdx);
        });

        while (wait(0.1)) {

            zombie.path.ComputeAsync(zombie.Position(), root.Position);

            if (zombie.path.Status === Enum.PathStatus.Success) {

                let waypoints = zombie.path.GetWaypoints();

                const wayPointsIdentifier: Part[] = [];

                //Create visible waypoints
                /*for (let i = 0; i < waypoints.size(); i++) {
                    wayPointsIdentifier.push(InstanceGenerator.generateWayPoint(waypoints[i].Position));
                }*/

                for (let i = 0; i < waypoints.size(); i++) {

                    print(i);
                    zombie.zombieHumanoid.MoveTo(waypoints[i].Position);
                    zombie.zombieHumanoid.MoveToFinished.Wait();

                    if (math.round(root.Position.X) !== x || math.round(root.Position.Z) !== z) {

                        waypoints = this.testt(zombie, root, waypoints);
                        i = -1;
                    }
                    m = zombie.Position().sub(root.Position).Magnitude;
                    //TODO Make zombie range random settings
                    if (m > 40) {
                        zombie.isChasingPlayer = false;
                        const i = this.zombieBrain(new Random(), zombie);
                        break;
                    }

                    x = math.round(root.Position.X);
                    z = math.round(root.Position.Z);
                }

                //Destroy visible waypoints
                /*for (const part of wayPointsIdentifier) {
                    part.Destroy();
                }*/
            }

            //TODO Make zombie range random settings
            if (m > 40) {
                zombie.isChasingPlayer = false;
                const i = this.zombieBrain(new Random(), zombie, false);
                break;
            }

            x = math.round(root.Position.X);
            z = math.round(root.Position.Z);
        }
    }

    private testt(zombie: ZombieService,
                  root: Part,
                  waypoints: PathWaypoint[]): PathWaypoint[] {

        zombie.path.ComputeAsync(zombie.Position(), root.Position);

        if (zombie.path.Status === Enum.PathStatus.Success) {

            waypoints = zombie.path.GetWaypoints();

            //Create visible waypoints
            for (let i = 0; i < waypoints.size(); i++) {
                InstanceGenerator.generateWayPoint(waypoints[i].Position);
            }
        }

        return waypoints;
    }

    //TODO Method name should change
    //     There Should be zombie behaviour outside and indoors
    private async zombieBrain(random: Random,
                              zombie: ZombieService,
                              firstTimeRun = true): Promise<void> {
        //TODO Put this setting in a config
        let x = 0;
        let z = 0;
        let zombieSleep = 0;
        const minZombieSleep = random.NextNumber(13.4, 21.7);
        const maxZombieSleep = random.NextNumber(41.7, 71.7);
        const minMaxMovePosition = 47;
        let zombieCurrentPosition = zombie.zombieHumanoidRootPart.Position;

        //TODO Stop while loop wen chasing player or if player is out of view
        while (wait(0.1)) {
            if (zombie.isChasingPlayer) {
                break;
            }
            //TODO Zombie behaviour is to random
            //     There should be group behaviour
            x = random.NextInteger((zombieCurrentPosition.X - minMaxMovePosition), (zombieCurrentPosition.X + minMaxMovePosition));
            z = random.NextInteger((zombieCurrentPosition.Z - minMaxMovePosition), (zombieCurrentPosition.Z + minMaxMovePosition));

            //First run
            if (zombieSleep === 0 && firstTimeRun) {
                print("GoONS")
                wait(random.NextNumber(minZombieSleep, maxZombieSleep));
            }
            zombie.path.ComputeAsync(zombieCurrentPosition, new Vector3(x, 0, z));
            //print(this.path.Status);
            if (zombie.path.Status === Enum.PathStatus.Success) {
                zombieSleep = random.NextNumber(minZombieSleep, maxZombieSleep);
                //print("D", x, z, zombieSleep);
                this.zombieBehaviour(zombie, zombie.path.GetWaypoints());
                //TODO Make more active in day and less active in ninth
                //     The zombies still looks to active
                wait(zombieSleep);
                zombieCurrentPosition = zombie.zombieHumanoidRootPart.Position;
            }
        }
    }

    //TODO Method name should change
    private zombieBehaviour(zombie: ZombieService, waypoints: PathWaypoint[]): void {

        // const waypoints = this.path.GetWaypoints();

        const wayPointsIdentifier: Part[] = [];

        const index = this.zombiePathCross(zombie, waypoints);

        //Create visible waypoints
        for (let i = 0; i < waypoints.size(); i++) {
            if (i === index) {
                break;
            }
            wayPointsIdentifier.push(InstanceGenerator.generateWayPoint(waypoints[i].Position));
        }

        this.zombiePaths.push(new ZombiePath(zombie.id.Value, waypoints));
        //Zombie Move to waypoint
        for (let i = 0; i < waypoints.size(); i++) {

            if (i === index || zombie.isChasingPlayer) {
                break;
            }

            zombie.zombieHumanoid.MoveTo(waypoints[i].Position);
            zombie.zombieHumanoid.MoveToFinished.Wait();
        }

        //TODO Put in a method
        //Remove zombie waypoints
        for (let i = 0; i < this.zombiePaths.size(); i++) {
            if (this.zombiePaths[i].id === zombie.id.Value) {
                this.zombiePaths.remove(i);
            }
        }

        //Destroy visible waypoints
        for (const part of wayPointsIdentifier) {
            part.Destroy();
        }
    }

    private zombiePathCross(zombie: ZombieService, waypoints: PathWaypoint[]): number {
        const currentStartPoint = zombie.zombieHumanoidRootPart.Position;
        const currentEndPoint = waypoints[waypoints.size() - 1].Position;
        let index = -1;
        for (const zombiePath of this.zombiePaths) {
            const zombieMainCrossPoint = this.getZombieCrossPoint(
                currentStartPoint,
                currentEndPoint,
                zombiePath.wayPoints[0].Position,
                zombiePath.wayPoints[zombiePath.wayPoints.size() - 1].Position
            );

            //TODO Duplicate code put in method
            if (zombieMainCrossPoint.isCrossPoint) {

                const zombieCrossPoint = zombieMainCrossPoint.crossPoint as Vector3
                let currentStartPointMagnitude = currentStartPoint.sub(zombieCrossPoint).Magnitude;

                for (let i = 0; i < waypoints.size(); i++) {
                    const wayPointMagnitude = waypoints[i].Position.sub(zombieCrossPoint).Magnitude;
                    if (wayPointMagnitude <= currentStartPointMagnitude) {
                        currentStartPointMagnitude = wayPointMagnitude;
                        index = i;
                    }
                }

                break;
            }
        }
        return index
    }

    /*    private zombieSleepPoint(zombie: ZombieService, waypoints: PathWaypoint[]) {
            const currentStartPoint = zombie.zombieHumanoidRootPart.Position;
            const currentEndPoint = waypoints[waypoints.size() - 1].Position;
            let distt = currentStartPoint.sub(currentEndPoint).Magnitude;
            let zombieMainCrossPoint = new ZombieCrossPoint();
            let index = -1;

            for (const zombieS of this.zombies) {
                if (zombieS.isSleeping) {
                    print("ISseleeping", zombieS.isSleeping);
                    const secondZPos = zombieS.zombieHumanoidRootPart.Position;
                    const ds = currentStartPoint.sub(secondZPos).Magnitude;

                    if (distt >= ds) {
                        const zombieCrossPoint = this.getZombieCrossPoint(
                            currentStartPoint,
                            currentEndPoint,
                            secondZPos,
                            new Vector3(secondZPos.X + secondZPos.X, secondZPos.Y, secondZPos.Z + secondZPos.Z)
                        );

                        if (zombieCrossPoint.isCrossPoint) {
                            distt = ds;
                            zombieMainCrossPoint = zombieCrossPoint;
                        }
                    }
                }
            }

            //TODO Duplicate code put in method
            if (zombieMainCrossPoint.isCrossPoint) {

                const zombieCrossPoint = zombieMainCrossPoint.crossPoint as Vector3
                let currentStartPointMagnitude = currentStartPoint.sub(zombieCrossPoint).Magnitude;

                for (let i = 0; i < waypoints.size(); i++) {
                    const wayPointMagnitude = waypoints[i].Position.sub(zombieCrossPoint).Magnitude;
                    if (wayPointMagnitude <= currentStartPointMagnitude) {
                        currentStartPointMagnitude = wayPointMagnitude;
                        index = i;
                    }
                }
            }

            return index;
        }*/

    //TODO Maybe move this in to ZombieCrossPoint class
    private getZombieCrossPoint(startPoint1: Vector3,
                                endPoint1: Vector3,
                                startPoint2: Vector3,
                                endPoint2: Vector3): ZombieCrossPoint {

        const point_1_x1 = startPoint1.X;
        const point_1_y1 = startPoint1.Z;
        const point_1_x2 = endPoint1.X;
        const point_1_y2 = endPoint1.Z;

        const point_2_x1 = startPoint2.X;
        const point_2_y1 = startPoint2.Z;
        const point_2_x2 = endPoint2.X;
        const point_2_y2 = endPoint2.Z;

        //m = (y1 - y2) / (x1 - x2)
        let line_1_m = 0;
        let line_2_m = 0;
        //b = -(mx1) + y1
        let line_1_b = 0;
        let line_2_b = 0;

        let intersect_x = 0;
        let intersect_z = 0;

        const isLineOneVertical = ((point_1_x1 / point_1_x2) % 2) === 1;
        const isLineTwoVertical = ((point_2_x1 / point_2_x2) % 2) === 1;

        if (isLineOneVertical && isLineTwoVertical) {
            return new ZombieCrossPoint();
        }

        //Line 1
        if (isLineOneVertical) {

            line_2_m = (point_2_y1 - point_2_y2) / (point_2_x1 - point_2_x2);

            line_2_b = -(line_2_m * point_2_x1) + point_2_y1;

            intersect_x = point_1_x1;
            intersect_z = (line_2_m * intersect_x) + line_2_b;
            //Line 2
        } else if (isLineTwoVertical) {
            line_1_m = (point_1_y1 - point_1_y2) / (point_1_x1 - point_1_x2);

            line_1_b = -(line_1_m * point_1_x1) + point_1_y1;

            intersect_x = point_2_x1;
            intersect_z = (line_1_m * intersect_x) + line_1_b;
        } else {
            line_1_m = (point_1_y1 - point_1_y2) / (point_1_x1 - point_1_x2);
            line_2_m = (point_2_y1 - point_2_y2) / (point_2_x1 - point_2_x2);

            if (line_1_m === line_2_m) {
                return new ZombieCrossPoint();
            }
            line_1_b = -(line_1_m * point_1_x1) + point_1_y1;
            line_2_b = -(line_2_m * point_2_x1) + point_2_y1;

            intersect_x = (line_2_b - line_1_b) / (line_1_m - line_2_m);
            intersect_z = (line_1_m * intersect_x) + line_1_b;
        }

        //Check if cross between the two points
        if ((intersect_x >= point_1_x1 && intersect_x <= point_1_x2) &&
            (intersect_x >= point_2_x1 && intersect_x <= point_2_x2)) {
            return new ZombieCrossPoint(new Vector3(intersect_x, 4, intersect_z));
        }

        return new ZombieCrossPoint();
    }
}
