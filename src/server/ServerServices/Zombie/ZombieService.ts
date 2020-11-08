import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";

export default class ZombieService {

    public id: StringValue;
    public zombieModel: Model;
    public readonly zombieParts: Instance[] = [];
    public zombieHumanoid: Humanoid;
    public zombieHumanoidRootPart: Part;
    public isSleeping = false;

    constructor(zombieModel: Model) {
        this.id = InstanceGenerator.generateStringValue(
            zombieModel,
            InstanceGenerator.generateGUID(),
            FileNames.ID
        );
        this.zombieModel = zombieModel;
        this.zombieHumanoid = this.zombieModel.FindFirstChild(FileNames.HUMANOID) as Humanoid;
        this.zombieHumanoidRootPart = this.zombieModel.FindFirstChild(FileNames.HUMANOID_ROOT_PART) as Part;
        this.zombieParts = this.zombieModel.GetChildren();

        this.setZombieState();
        this.setNetworkOwner();

        //TODO Maybe there must be a zombie config object
        this.zombieHumanoid.WalkSpeed = 8;
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
}