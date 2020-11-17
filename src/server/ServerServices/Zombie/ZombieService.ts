import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {PathfindingService} from "@rbxts/services";
import U from "../../../shared/Utils/CommonUtil";

export default class ZombieService {

    public id: StringValue;
    public zombieModel: Model;
    public path: Path;
    public readonly zombieParts: Instance[] = [];
    public zombieHumanoid: Humanoid;
    public zombieHumanoidRootPart: Part;
    public random: Random;
    //TODO TheTest animation, take out if not going to use
    public testRun: AnimationTrack;

    //Target(Player)
    public isChasingPlayer = false;
    public targetUserId = 0;
    public currentDistanceFormPlayer = 0;
    //TODO Find better property name
    public detectedPlayer = false;
    public targetingBuildObject = false;
    public isInFrontOfPart: BoolValue | undefined;

    //Zombie Normal behavior settings
    //TODO I should put this in an object, ZombieBehaviorSetting or something
    public normalXPos = 0;
    public normalZPos = 0;
    public zombieSleep = 0;
    public readonly minZombieSleep: number;
    public readonly maxZombieSleep: number;
    //Zombie activity range, on normal behavior
    //TODO Some zombie must be able to move further then others.
    //     Maybe make this random
    public readonly minMaxMovePosition = 47;

    constructor(zombieModel: Model) {
        this.id = InstanceGenerator.generateStringValue(
            zombieModel,
            InstanceGenerator.generateGUID(),
            FileNames.ID
        );

        this.random = new Random();

        this.path = PathfindingService.CreatePath({
            AgentHeight: 5,
            AgentRadius: 4,
            AgentCanJump: false
        });

        this.zombieModel = zombieModel;
        this.zombieHumanoid = this.zombieModel.FindFirstChild(FileNames.HUMANOID) as Humanoid;
        this.zombieHumanoidRootPart = this.zombieModel.FindFirstChild(FileNames.HUMANOID_ROOT_PART) as Part;
        this.zombieParts = this.zombieModel.GetChildren();

        this.setZombieState();
        this.setNetworkOwner();

        //TODO Maybe there must be a zombie config object
        //     Zombies must have random speed. Set the random object as a field

        this.zombieHumanoid.WalkSpeed = this.random.NextNumber(5.7, 9.3);
        //this.zombieHumanoid.WalkSpeed = 15;
        this.minZombieSleep = this.random.NextNumber(13.4, 21.7);
        this.maxZombieSleep = this.random.NextNumber(41.7, 71.7);

        const runn = new Instance("Animation") as Animation;
        runn.AnimationId = "rbxassetid://507767714";

        this.testRun = this.zombieHumanoid.LoadAnimation(runn);
    }

    private setZombieState(): void {
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Ragdoll, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Landed, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Seated, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Swimming, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Flying, false);
        this.zombieHumanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);
    }

    public position(): Vector3 {
        return this.zombieHumanoidRootPart.Position;
    }

    public setNetworkOwner(): void {
        for (const zombiePart of this.zombieParts) {

            if (zombiePart.ClassName === "MeshPart") {
                (zombiePart as MeshPart).SetNetworkOwner(undefined);
                (zombiePart as MeshPart).CanCollide = false;
            } else if (zombiePart.ClassName === "Part") {
                (zombiePart as Part).SetNetworkOwner(undefined);
                (zombiePart as MeshPart).CanCollide = false;
            }
        }
    }

    //TODO This should have better method name
    public isNotInFrontOfPart(): void {
        U.ifNotNull(this.isInFrontOfPart, (boolValue) => {
            boolValue.Value = false;
        });
    }

    public showZombiePath(wayPoints: PathWaypoint[], div = 1, breakBy = -1) {

        for (let i = 0; i < wayPoints.size(); i++) {

            if (i === breakBy) {
                break;
            }

            if (i <= (wayPoints.size() / div)) {
                InstanceGenerator.generateWayPoint(wayPoints[i].Position, 8);
            }
        }
    }

    public pathComputeAsync(toPosition: Vector3): void {
        this.path.ComputeAsync(this.position(), toPosition);
    }

    public moveTo(location: Vector3, part?: BasePart): void {
        this.zombieHumanoid.MoveTo(location, part);
    }

    //TODO ShouldBreak is not a good name
    public moveToWayPoints(toPosition: Vector3, shouldBreak = false): boolean {
        this.pathComputeAsync(toPosition);

        let findPath = false;
        print(this.path.Status);
        if (this.path.Status === Enum.PathStatus.Success) {
            const wayPoints = this.path.GetWaypoints();
            findPath = true;
            this.showZombiePath(wayPoints);

            for (const wayPoint of wayPoints) {

                if (this.targetingBuildObject && shouldBreak) {
                    break;
                }

                this.moveTo(wayPoint.Position);
                this.zombieHumanoid.MoveToFinished.Wait();
            }
        }

        return findPath;
    }

    public async moveToWayPointsAsync(toPosition: Vector3, shouldBreak = false): Promise<boolean> {
        return new Promise(resolve => {
            resolve(this.moveToWayPoints(toPosition, shouldBreak));
        });
    }

    public isChasingByWhatPlayer(userId: number): boolean {
        let isChasing = false;

        if (this.targetUserId !== undefined && this.isChasingPlayer && this.targetUserId === userId) {
            isChasing = true;
        }
        return isChasing;
    }

    //>>Zombie normal behavior functions
    public setRandomMinMaxMovingPosition(): void {
        this.normalXPos = this.random.NextInteger(
            (this.position().X - this.minMaxMovePosition),
            (this.position().X + this.minMaxMovePosition)
        );
        this.normalZPos = this.random.NextInteger(
            (this.position().Z - this.minMaxMovePosition),
            (this.position().Z + this.minMaxMovePosition)
        );
    }

    //Zombie will sleep for small amount of time
    public powerNap(): void {
        wait(this.randomSleepTime());
    }

    public randomSleepTime(): number {
        return this.random.NextNumber(this.minZombieSleep, this.maxZombieSleep);
    }
    //>>End Zombie normal behavior
}