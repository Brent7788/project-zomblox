import {FileNames} from "../../../shared/Modules/Enums/FileNames";

export default class ZombieAnimationService {

    public zombieModel: Model;
    public humanoid: Humanoid;
    public running: AnimationTrack;
    public targetPlayer: Player | undefined = undefined;
    public test: AnimationTrack;

    constructor(zombieModel: Model) {
        this.zombieModel = zombieModel;
        this.humanoid = zombieModel.FindFirstChild(FileNames.HUMANOID) as Humanoid;

        const running = new Instance("Animation") as Animation;
        running.AnimationId = "rbxassetid://507767714";

        this.running = this.humanoid.LoadAnimation(running);

        const test = new Instance("Animation") as Animation;
        test.AnimationId = "rbxassetid://507770453";

        this.test = this.humanoid.LoadAnimation(test);


        this.runningConnection();
    }

    public runningConnection() {

        this.humanoid?.Running.Connect(speed => {
            if (!this.running.IsPlaying && speed > 0.5) {
                this.running.Play();
            } else if (this.running.IsPlaying  && speed < 0.5) {
                this.running.Stop();
            }
        });
    }

    public position(): Vector3 {
        let pos = this.humanoid.RootPart?.Position;
        if (pos === undefined) {
            warn("The zombie root part is undefined. This will case logic error.")
            pos = new Vector3();
        }
        return pos;
    }

    public isPlayingForThisPlayer(userId: number): boolean {
        let done = false;

        if (this.targetPlayer !== undefined &&
            this.targetPlayer.UserId === userId) {
            done = true;
        }

        return done;
    }

    public isTargetPlayerFullyInGame(): boolean {
        return this.targetPlayer !== undefined && this.targetPlayer.Character !== undefined;
    }
}