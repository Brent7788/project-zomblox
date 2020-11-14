import ProjectZombloxPlayerInputService from "./LocalServices/ProjectZombloxPlayerInputService";
import FPSService from "./LocalServices/FPSService";
import ZombiesService from "./LocalServices/Zombie/ZombiesService";
import {Players} from "@rbxts/services";

export default class LocalStartUp {
    private readonly projectZombloxPlayerInputService: ProjectZombloxPlayerInputService;
    private readonly zombiesService: ZombiesService;
    private readonly fpsService: FPSService;

    constructor() {
        this.projectZombloxPlayerInputService = new ProjectZombloxPlayerInputService();
        this.zombiesService = new ZombiesService();
        this.fpsService = new FPSService();
    }

    //TODO Maybe create better set up name
    public start(): void {
        this.projectZombloxPlayerInputService.began();
        this.fpsService.initFPS();
        this.zombiesService.initZombieAnimationService();
        this.zombiesService.zombieAnimationRun();
    }
}