import PlayerInputs from "./PlayerInputs";

export default class LocalStartUp {
    private readonly playerInputs: PlayerInputs;

    constructor() {
        this.playerInputs = new PlayerInputs();
    }

    public setUp(): void {
        this.playerInputs.began();
    }
}