import {Players, Workspace} from "@rbxts/services";
import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import ZombieAnimationService from "./ZombieAnimationService";

export default class ZombiesService {

    private readonly zombieModels: Instance[] = [];
    private zombieAnimations: ZombieAnimationService[] = [];
    private localPlayer: Player;
    private players: Player[] = [];

    constructor() {
        this.zombieModels = Workspace.WaitForChild(FileNames.ZOMBIES)
            .WaitForChild(FileNames.LIVE_ZOMBIES).GetChildren();

        this.localPlayer = Players.LocalPlayer;
        this.players = Players.GetPlayers();
    }

    public initZombieAnimationService(): void {
        for (const zombieModel of this.zombieModels) {
            this.zombieAnimations.push(new ZombieAnimationService(zombieModel as Model))
        }
    }

    public zombieAnimationRun(): void {

        let playerSize = Players.GetPlayers().size();
        let oldPlayerSize = playerSize;

        while (wait(0.1)) {

            if (playerSize > oldPlayerSize || playerSize < oldPlayerSize) {
                oldPlayerSize = playerSize;
                this.players = Players.GetPlayers();
            }

            playerSize = Players.GetPlayers().size();

            for (const player of this.players) {
                for (const zombieAnimation of this.zombieAnimations) {
                    const d = player.DistanceFromCharacter(zombieAnimation.position());
                    if (d <= 10 && !zombieAnimation.test.IsPlaying) {
                        zombieAnimation.test.Play();
                        zombieAnimation.targetPlayer = player;
                    } else if (d > 10 && zombieAnimation.test.IsPlaying &&
                        zombieAnimation.isPlayingForThisPlayer(player.UserId)) {
                        zombieAnimation.test.Stop();
                    } else if (d > 10 && zombieAnimation.test.IsPlaying && !zombieAnimation.isTargetPlayerFullyInGame()) {
                        zombieAnimation.test.Stop();
                    }
                }
            }
        }
    }
}