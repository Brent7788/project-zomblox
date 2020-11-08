import ProjectZombloxPlayerInputService from "./LocalServices/ProjectZombloxPlayerInputService";
import FPSService from "./LocalServices/FPSService";

export default class LocalStartUp {
    private readonly projectZombloxPlayerInputService: ProjectZombloxPlayerInputService;
    private readonly fpsService: FPSService;

    constructor() {
        this.projectZombloxPlayerInputService = new ProjectZombloxPlayerInputService();
        this.fpsService = new FPSService();
    }

    //TODO Maybe create better set up name
    public start(): void {
        this.projectZombloxPlayerInputService.began();
        this.fpsService.initFPS();
    }
}