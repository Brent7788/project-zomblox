import {PathfindingService, Workspace} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import ZombieService from "./ZombieService";
import ZombiePath from "../../ServerModules/ZombiePath";
import ZombieCrossPoint from "../../ServerModules/ZombieCrossPoint";

export default class ZombieBehaviourService {

    private path: Path;
    private readonly zombieModels: Instance[] | undefined;
    private readonly zombies: ZombieService[] = [];
    private readonly zombiesRayCastParams: RaycastParams;
    private zombiePaths: ZombiePath[] = [];

    constructor() {
        //TODO Remamber to set Agents
        this.path = PathfindingService.CreatePath();
        this.zombieModels = Workspace.FindFirstChild(FileNames.ZOMBIES)
            ?.FindFirstChild(FileNames.LIVE_ZOMBIES)?.GetChildren();

        this.setZombieServices();

        //TODO Put in private method
        this.zombiesRayCastParams = new RaycastParams();
        this.zombiesRayCastParams.FilterType = Enum.RaycastFilterType.Whitelist;
        this.zombiesRayCastParams.FilterDescendantsInstances =
            (this.zombieModels !== undefined) ? this.zombieModels : [];

    }

    private setZombieServices(): void {
        if (this.zombieModels !== undefined) {
            for (const zombieModel of this.zombieModels) {
                this.zombies.push(new ZombieService(zombieModel as Model));
            }
        }
    }

    public startZombie(): void {
        const random = new Random();

        for (let i = 0; i < this.zombies.size(); i++) {
            const promise = this.zombieBehaviour(
                random,
                this.zombies[i]);
        }
    }

    //TODO Maybe better method name.
    private async zombieBehaviour(random: Random,
                                  zombie: ZombieService): Promise<void> {
        //TODO Put this setting in a config
        let x = 0;
        let z = 0;
        let zombieSleep = 0;
        const minZombieSleep = random.NextNumber(13.4, 21.7);
        const maxZombieSleep = random.NextNumber(41.7, 71.7);
        while (wait(0.1)) {
            x = random.NextInteger(-47, 47);
            z = random.NextInteger(-47, 47);

            //First run
            if (zombieSleep === 0) {
                print("GoONS")
                zombie.isSleeping = true;
                wait(random.NextNumber(minZombieSleep, maxZombieSleep));
            }
            this.path.ComputeAsync(zombie.zombieHumanoidRootPart.Position, new Vector3(x, 0, z));
            //print(this.path.Status);
            if (this.path.Status === Enum.PathStatus.Success) {
                zombieSleep = random.NextNumber(minZombieSleep, maxZombieSleep);
                //print("D", x, z, zombieSleep);
                this.followPath(zombie);
                zombie.isSleeping = true;
                wait(zombieSleep);
            }
        }
    }

    private followPath(zombie: ZombieService): void {

        zombie.isSleeping = false;

        const waypoints = this.path.GetWaypoints();

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
        print("LIST", this.zombiePaths.size());
        //Move to waypoint
        for (let i = 0; i < waypoints.size(); i++) {

            if (i === index) {
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
        //let index = this.zombieSleepPoint(zombie, waypoints);
        let index = -1;
        print("SLEEPING", index);
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
        print("end", index);
        return index
    }

    private zombieSleepPoint(zombie: ZombieService, waypoints: PathWaypoint[]) {
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
    }

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
