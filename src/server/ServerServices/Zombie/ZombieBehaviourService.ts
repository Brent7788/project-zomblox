import {Players, Workspace} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import ZombieService from "./ZombieService";
import ZombiePath from "../../ServerModules/ZombiePath";
import ZombieCrossPoint from "../../ServerModules/ZombieCrossPoint";
import U from "../../../shared/Utils/CommonUtil";
import RegionService from "../../../shared/Service/RegionService";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import PLayerService from "../../../shared/Service/PLayerService";
import {ZombieAction} from "../../../shared/Modules/Enums/ZombieAction";

export default class ZombieBehaviourService {

    //private path: Path;
    private readonly zombieModels: Instance[] | undefined;
    private readonly zombies: ZombieService[] = [];
    private zombiesRayCastParams: RaycastParams = new RaycastParams();
    private zombiePaths: ZombiePath[] = [];
    private buildingRegions: RegionService[] = [];
    //TODO Should be PlayerService
    private players: Player[] = [];

    constructor() {

        this.zombieModels = Workspace.FindFirstChild(FileNames.ZOMBIES)
            ?.FindFirstChild(FileNames.LIVE_ZOMBIES)?.GetChildren();

        this.setZombieServices();

        Players.PlayerRemoving.Connect(player => {
            print("remove", player)
            for (let i = 0; i < this.players.size(); i++) {
                if (this.players[i].UserId === player.UserId) {
                    this.players.remove(i);
                    break;
                }
            }
        });

        //TODO This should not be here, maybe put in a method or?1
        const p = Workspace.WaitForChild("TestParts").GetChildren();
        for (const instance of p) {
            if (instance.Name === "BuildingRegion") {
                const b = new RegionService(instance as Part);
                this.buildingRegions.push(b);
            }
        }

        this.initRayCastParamsBlackListPlayers();
    }

    private setZombieServices(): void {
        if (this.zombieModels !== undefined) {
            for (const zombieModel of this.zombieModels) {
                this.zombies.push(new ZombieService(zombieModel as Model));
            }
        }
    }

    //TODO Dont need method for this put in constructor
    private initRayCastParamsBlackListPlayers(): void {
        this.zombiesRayCastParams.FilterType = Enum.RaycastFilterType.Blacklist;
        this.zombiesRayCastParams.FilterDescendantsInstances =
            (this.zombieModels !== undefined) ? this.zombieModels : [];
    }

    public initZombie(): void {
        for (let i = 0; i < this.zombies.size(); i++) {
            this.zombieNormalBehaviour(
                this.zombies[i])
                .then()
                .catch((reason) => {
                    warn("Error in zombieNormalBehaviour", reason);
                });
        }
    }

    public initZombieDetectionBehaviour(player: Player): void {
        this.players.push(player);

        this.zombieDetectPlayer(new PLayerService(player))
            .then()
            .catch((reason) => {
                warn("Error in zombieDetectPlayer", reason);
            });
    }

    //TODO This is where zombie detection behaviour will be implemented.
    //
    //TODO The zombie must not be able to detect the player if there
    //     is part(Wall, House ens...) in front of it except if the player is running.
    private async zombieDetectPlayer(playerService: PLayerService): Promise<void> {
        //TODO Make zombie range random settings
        const detectionRange = 40;

        //TODO Maybe the wait can be 2 seconds
        while (wait(1)) {
            //TODO THis is not good, find better way1

            if (!playerService.isFullyInGame() || playerService.humanoid.Health <= 0) {
                break;
            }

            for (const zombie of this.zombies) {

                //print("ACTION", zombie.action)
                if (zombie.isAor(ZombieAction.NORMAL_BEHAVIOR, ZombieAction.NO_ACTION, ZombieAction.FACING_WINDOW) ||
                    !zombie.isChasingByWhatPlayer(playerService.player.UserId)) {

                    const playerDistanceFormZombie = playerService.player.DistanceFromCharacter(zombie.position());

                    if ((zombie.isAor(ZombieAction.NORMAL_BEHAVIOR, ZombieAction.NO_ACTION, ZombieAction.FACING_WINDOW) && playerDistanceFormZombie <= detectionRange) ||
                        (zombie.isA(ZombieAction.CHASING_PLAYER) && playerDistanceFormZombie < zombie.currentDistanceFormPlayer)) {

                        this.zombieMainDetectionBrain(playerService, zombie);
                    }
                }

                if (zombie.isA(ZombieAction.NO_ACTION)) {
                    playerService.disconnectRunning();
                    this.zombieNormalBehaviour(zombie, true)
                        .then()
                        .catch((reason) => {
                            warn("Error in zombieNormalBehaviour", reason);
                        });
                }
            }
        }
    }

    private zombieMainDetectionBrain(pLayerService: PLayerService, zombie: ZombieService): void {
        const buildingRegion = pLayerService.inWaitRegion();

        pLayerService.connectPlayerRunning();

        // print("Z", zombie.detectedPlayer, zombie.targetingBuildObject, zombie.isChasingPlayer);
        U.ifNotNullElse(buildingRegion, (buildingRegion) => {

            if (pLayerService.isRunning) {
                const test = buildingRegion.FindPartsInRegion3(100, pLayerService.character);
                let current = 0;
                let old = 4000;
                //TODO Window and Doors
                let windowTarget: Part | undefined;
                for (const basePart of test) {
                    if (basePart.Name === "WindowTarget") {
                        current = zombie.position().sub(basePart.Position).Magnitude;
                        if (current < old) {
                            old = current;
                            windowTarget = basePart as Part;
                        }
                    }
                }

                U.ifNotNull(windowTarget, wt => {
                    //TODO IsZombieInFront should be pre-generated
                    let facingWindow = wt.FindFirstChild("IsZombieInFrontOf") as BoolValue;
                    if (zombie.isNotA(ZombieAction.FACING_WINDOW) &&
                        (facingWindow === undefined || !facingWindow.Value)) {

                        zombie.action = ZombieAction.FACING_WINDOW

                        if (U.isNull(facingWindow)) {
                            facingWindow = InstanceGenerator.generateBoolValue(wt, true, "IsZombieInFrontOf");
                        } else {
                            facingWindow.Value = true;
                        }

                        zombie.isInFrontOfPart = facingWindow;

                        zombie.moveToWayPointsAsync(wt.Position, zombie.action).then((success) => {
                            facingWindow.Value = success;

                            if (!success) {
                                zombie.action = ZombieAction.NO_ACTION;
                            } else {
                                print("Go up");
                                zombie.moveTo(zombie.position().add(new Vector3(0, 20, 0)));
                                zombie.zombieHumanoid.MoveToFinished.Wait();
                            }
                        });
                    }
                });
            }
        }, () => {
            const rayCastTarget = Workspace.Raycast(zombie.position(),
                U.mulVector3(pLayerService.position().sub(zombie.position()).Unit, 50), this.zombiesRayCastParams);

            U.ifNotNull(rayCastTarget, (rayCastTarget) => {
                const instance = rayCastTarget.Instance.Parent as Instance;

                if (U.isNotNull(instance) && instance.IsA("Model")) {
                    const humanoid = instance.FindFirstChild(FileNames.HUMANOID) as Humanoid;

                    if (U.isNotNull(humanoid)) {
                        zombie.isNotInFrontOfPart();
                        pLayerService.disconnectRunning();

                        this.zombieStartChasingPlayer(zombie, pLayerService)
                            .then()
                            .catch((reason) => warn("Error in zombieStartChasingPlayer", reason));
                    }
                } else if (zombie.isNotA(ZombieAction.DETECTED_PLAYER) &&
                    zombie.isNotA(ZombieAction.CHASING_PLAYER) && pLayerService.isRunning) {

                    const xOffset = zombie.random.NextNumber(-20, 20);
                    const zOffset = zombie.random.NextNumber(-20, 20);
                    const playerOffsetPosition = pLayerService.position().add(new Vector3(xOffset, 0, zOffset));

                    zombie.action = ZombieAction.DETECTED_PLAYER
                    zombie.isNotInFrontOfPart();
                    zombie.moveToWayPointsAsync(playerOffsetPosition, zombie.action)
                        .then((success) => {
                            zombie.action = ZombieAction.NO_ACTION;
                        });
                }
            });
        });
    }

    private async zombieStartChasingPlayer(zombie: ZombieService, playerService: PLayerService): Promise<void> {

        zombie.action = ZombieAction.CHASING_PLAYER;
        let isNotBlocked = true;
        const userId = playerService.player.UserId;
        zombie.targetUserId = userId;

        //TODO All this connection should be in the ZombieService, see player running for example
        const moveToFinishConnection =
            zombie.zombieHumanoid.MoveToFinished.Connect((reached) => {
                if (!reached) {
                    isNotBlocked = true;
                }
            });

        //TODO All this connection should be in the ZombieService, see player running for example
        const blockedBlockConnection = zombie.path.Blocked.Connect(blockedWaypointIdx => {
            isNotBlocked = true;
        });

        let zombieDistinctBetweenPlayer = 0;
        const xOffset = zombie.random.NextNumber(-8, 8);
        const zOffset = zombie.random.NextNumber(-8, 8);
        //TODO All this connection should be in the ZombieService, see player running for example
        const runningConnection = zombie.zombieHumanoid.Running.Connect(speed => {

            if (isNotBlocked && speed <= 3.5) {
                zombieDistinctBetweenPlayer = zombie.position().sub(playerService.position()).Magnitude;
                if (zombieDistinctBetweenPlayer > 7) {
                    isNotBlocked = false;
                    //To stop zombie moving
                    zombie.moveTo(zombie.position());
                }
            }
        });
        while (wait(0.1)) {
            zombieDistinctBetweenPlayer = zombie.position().sub(playerService.position()).Magnitude;
            zombie.currentDistanceFormPlayer = zombieDistinctBetweenPlayer;

            if (isNotBlocked) {

                //TODO Maybe make the 15 random, so its not that easy to see
                if (zombieDistinctBetweenPlayer <= 15) {
                    zombie.moveTo(playerService.position());
                    zombie.attackPlayer(playerService.humanoid);
                } else {
                    const playerOffsetPosition = playerService.position().add(
                        new Vector3(xOffset, 0, zOffset)
                    );
                    zombie.moveTo(playerOffsetPosition);
                }
            } else {

                //TODO Note* That playerService.inWaitRegion() mite case LAG
                if (playerService.inWaitRegion() === undefined) {
                    const xxOffset = zombie.random.NextNumber(-25, 25);
                    const zzOffset = zombie.random.NextNumber(-25, 25);
                    const playerOffsetPosition = playerService.position().add(
                        new Vector3(xxOffset, 0, zzOffset)
                    );

                    zombie.pathComputeAsync(playerOffsetPosition);

                    if (zombie.path.Status === Enum.PathStatus.Success) {

                        const waypoints = zombie.path.GetWaypoints();

                        zombie.showZombiePath(waypoints, 2);

                        for (let i = 0; i < waypoints.size(); i++) {

                            if (isNotBlocked && !zombie.isChasingByWhatPlayer(userId)) {
                                break;
                            }

                            if (i <= (waypoints.size() / 2)) {
                                zombie.moveTo(waypoints[i].Position);
                                zombie.zombieHumanoid.MoveToFinished.Wait();
                            } else {
                                zombie.moveTo(playerService.position());
                            }
                        }
                    }
                } else {
                    this.zombieNormalBehaviour(zombie, true)
                        .then()
                        .catch((reason) => warn("Error in zombieNormalBehaviour", reason));
                    moveToFinishConnection.Disconnect();
                    blockedBlockConnection.Disconnect();
                    runningConnection.Disconnect();
                    playerService.disconnectRunning();
                    break;
                }

                isNotBlocked = true;
            }

            if (!zombie.isChasingByWhatPlayer(userId)) {
                break;
            }

            //TODO Make zombie range random settings
            if (zombieDistinctBetweenPlayer > 60 ||
                !playerService.isFullyInGame() ||
                playerService.humanoid.Health <= 0) {

                this.zombieNormalBehaviour(zombie, false)
                    .then()
                    .catch((reason) => warn("Error in zombieNormalBehaviour", reason));
                moveToFinishConnection.Disconnect();
                blockedBlockConnection.Disconnect();
                runningConnection.Disconnect();
                playerService.disconnectRunning();
                break;
            }
        }
    }

    //TODO There Should be zombie behaviour outside and indoors
    private async zombieNormalBehaviour(zombie: ZombieService, firstTimeRun = true): Promise<void> {

        zombie.action = ZombieAction.NORMAL_BEHAVIOR;

        //TODO Stop while loop when player is completely out of view or range
        while (wait(0.1)) {
            if (zombie.isNotA(ZombieAction.NORMAL_BEHAVIOR)) {
                break;
            }
            //TODO Zombie behaviour is to random
            //     There should be group behaviour
            zombie.setRandomMinMaxMovingPosition();

            //First run
            if (zombie.zombieSleep === 0 && firstTimeRun) {
                print("Z")
                zombie.powerNap();
            }

            zombie.pathComputeAsync(new Vector3(zombie.normalXPos, 0, zombie.normalZPos));

            if (zombie.path.Status === Enum.PathStatus.Success) {

                this.zombieMoveTo(zombie, zombie.path.GetWaypoints());
                //TODO Make more active in day and less active in ninth
                //     The zombies still looks to active
                zombie.powerNap();
            }
        }
    }

    //TODO Method name should change
    private zombieMoveTo(zombie: ZombieService, waypoints: PathWaypoint[]): void {


        const index = this.zombiePathCross(zombie, waypoints);

        zombie.showZombiePath(waypoints, 1, index);

        this.zombiePaths.push(new ZombiePath(zombie.id.Value, waypoints));

        //zombie.testRun.Play()
        for (let i = 0; i < waypoints.size(); i++) {

            if (i === index || zombie.isNotA(ZombieAction.NORMAL_BEHAVIOR)) {
                break;
            }

            zombie.moveTo(waypoints[i].Position);
            zombie.zombieHumanoid.MoveToFinished.Wait();
        }
        // zombie.testRun.Stop();

        //TODO Put in a method
        //Remove zombie waypoints
        for (let i = 0; i < this.zombiePaths.size(); i++) {
            if (this.zombiePaths[i].id === zombie.id.Value) {
                this.zombiePaths.remove(i);
            }
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