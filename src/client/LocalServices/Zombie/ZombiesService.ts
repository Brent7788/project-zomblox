import {Players, Workspace} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import ZombieAnimationService from "./ZombieAnimationService";

export default class ZombiesService {

    private readonly zombieModels: Instance[] = [];
    private zombieAnimations: ZombieAnimationService[] = [];
    private players: Player[] = [];

    constructor() {
        this.zombieModels = Workspace.WaitForChild(FileNames.ZOMBIES)
             .WaitForChild(FileNames.LIVE_ZOMBIES).GetChildren();

        this.initZombieAnimationService();
        this.players = Players.GetPlayers();
    }

    private initZombieAnimationService(): void {
        for (const zombieModel of this.zombieModels) {
            this.zombieAnimations.push(new ZombieAnimationService(zombieModel as Model))
        }
    }

    public testt(): void {
        while (wait(0.1)) {
            for (const player of this.players) {
                for (const zombieAnimation of this.zombieAnimations) {
                    const d = player.DistanceFromCharacter(zombieAnimation.position());
                    if (d <= 10 && !zombieAnimation.test.IsPlaying) {
                        zombieAnimation.test.Play();
                    } else if (d > 10 && zombieAnimation.test.IsPlaying) {
                        zombieAnimation.test.Stop();
                    }
                }
            }
        }
    }
}