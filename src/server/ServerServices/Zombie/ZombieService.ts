import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {PathfindingService} from "@rbxts/services";
import U from "../../../shared/Utils/CommonUtil";
import {ZombieAction} from "../../../shared/Modules/Enums/ZombieAction";

export default class ZombieService {

    public id: StringValue;
    public zombieModel: Model;
    public path: Path;
    public readonly zombieParts: Instance[] = [];
    public zombieHumanoid: Humanoid;
    public zombieHumanoidRootPart: Part;
    public random: Random;
    public grabAnimation: AnimationTrack;

    //Target(Player)
    public targetUserId = 0;
    public currentDistanceFormPlayer = 0;
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

    public action = ZombieAction.NORMAL_BEHAVIOR;

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

        const grap = new Instance("Animation") as Animation;
        grap.AnimationId = "rbxassetid://507784897";

        this.grabAnimation = this.zombieHumanoid.LoadAnimation(grap);

        this.path.Blocked.Connect(blockedWaypointIdx => {
            print("BLOCKD", this.id);
        });
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
                InstanceGenerator.generateWayPoint(wayPoints[i].Position, 80);
            }
        }
    }

    //Is wait action
    public isA(action: ZombieAction): boolean {
        return this.action === action;
    }

    //Is one of the action in array
    public isAor(...actions: ZombieAction[]): boolean {

        for (const action of actions) {
            if (this.action === action) {
                return true;
            }
        }

        return false;
    }

    //Is not action
    public isNotA(action: ZombieAction): boolean {
        return this.action !== action;
    }

    public pathComputeAsync(toPosition: Vector3): void {
        this.path.ComputeAsync(this.position(), toPosition);
    }

    public moveTo(location: Vector3, part?: BasePart): void {
        this.zombieHumanoid.MoveTo(location, part);
    }

    //TODO ShouldBreak is not a good name
    public moveToWayPoints(toPosition: Vector3, currentAction: ZombieAction): boolean {
        this.pathComputeAsync(toPosition);

        let success = false;

        print(this.path.Status, toPosition);

        const connected = this.zombieHumanoid.MoveToFinished.Connect(reached => {
            success = reached;
        });

        if (this.path.Status === Enum.PathStatus.Success) {
            const wayPoints = this.path.GetWaypoints();


            this.showZombiePath(wayPoints);

            for (const wayPoint of wayPoints) {

                if (this.isNotA(currentAction)) {
                    success = false;
                    break;
                }

                this.moveTo(wayPoint.Position);
                this.zombieHumanoid.MoveToFinished.Wait();
            }
        }

        if (this.path.Status === Enum.PathStatus.NoPath) {
            const x = this.random.NextInteger(2, 6);
            const z = this.random.NextInteger(2, 6);
            this.moveTo(new Vector3(x, toPosition.Y, z));
        }

        connected.Disconnect();

        return success;
    }

    public async moveToWayPointsAsync(toPosition: Vector3, currentAction: ZombieAction): Promise<boolean> {
        return new Promise(resolve => {
            resolve(this.moveToWayPoints(toPosition, currentAction));
        });
    }

    public isChasingByWhatPlayer(userId: number): boolean {
        let isChasing = false;

        if (U.isNotNull(this.targetUserId) && this.isA(ZombieAction.CHASING_PLAYER) && this.targetUserId === userId) {
            isChasing = true;
        }
        return isChasing;
    }

    //TODO This is not completely done and this needs more testing
    public attackPlayer(playerHumanoid: Humanoid): void {

        if (playerHumanoid.WalkSpeed > 8.5 && this.currentDistanceFormPlayer < 4.2) {
            playerHumanoid.WalkSpeed = playerHumanoid.WalkSpeed / 1.1;
        } else if (playerHumanoid.WalkSpeed < 15) {
            playerHumanoid.WalkSpeed = playerHumanoid.WalkSpeed + 2;
        }

        //TODO Put this,if chased by zombie disable jump
        if (this.currentDistanceFormPlayer < 13) {
            playerHumanoid.JumpPower = 0;
        } else if (this.currentDistanceFormPlayer >= 13) {
            playerHumanoid.JumpPower = 50;
        }

        //Grab and bite player
        if (this.currentDistanceFormPlayer <= 2) {
            playerHumanoid.WalkSpeed = 0;
            const rootPart = playerHumanoid.RootPart;
            if (rootPart !== undefined) {
                this.moveTo(rootPart.Position);
                this.zombieHumanoid.MoveToFinished.Wait();
            }
            this.grabAnimation.Play();
            wait(0.7);
            playerHumanoid.TakeDamage(25);
            this.grabAnimation.Stop();
            playerHumanoid.WalkSpeed = 16;
            playerHumanoid.JumpPower = 50;
            wait(0.5);
        }
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