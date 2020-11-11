import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {PathfindingService} from "@rbxts/services";

export default class ZombieService {

    public id: StringValue;
    public zombieModel: Model;
    public path: Path;
    public readonly zombieParts: Instance[] = [];
    public zombieHumanoid: Humanoid;
    public zombieHumanoidRootPart: Part;
    public isChasingPlayer = false;
    public random: Random;

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

        this.zombieHumanoid.WalkSpeed = this.random.NextNumber(5.7, 8.7);
        //this.zombieHumanoid.WalkSpeed = 15;
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

    public moveTo(location: Vector3, part?: BasePart): void {
        this.zombieHumanoid.MoveTo(location, part);
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

    public showZombiePath(wayPoints: PathWaypoint[], div = 1, breakBy = -1): Part[] {
        const createdWayPointsIdentifier: Part[] = [];

        for (let i = 0; i < wayPoints.size(); i++) {

            if (i === breakBy) {
                break;
            }

            if (i <= (wayPoints.size() / div)) {
                createdWayPointsIdentifier.push(InstanceGenerator.generateWayPoint(wayPoints[i].Position));
            }
        }

        return createdWayPointsIdentifier;
    }

    public destroyZombiePathIdentifier(wayPointsIdentifier: Part[]): void {
        for (const part of wayPointsIdentifier) {
            part.Destroy();
        }
    }
}