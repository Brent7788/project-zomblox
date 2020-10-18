import ProjectZombloxPlayerInputService from "./LocalServices/ProjectZombloxPlayerInputService";

export default class LocalStartUp {
    private readonly projectZombloxPlayerInputService: ProjectZombloxPlayerInputService;

    constructor() {
        this.projectZombloxPlayerInputService = new ProjectZombloxPlayerInputService();
    }

    //TODO Maybe create better set up name
    public start(): void {
        this.projectZombloxPlayerInputService.began();
    }
}