import {FileNames} from "../Modules/Enums/FileNames";
import {Workspace} from "@rbxts/services";
import RegionService from "./RegionService";

export default class PLayerService {

    public player: Player;
    public character: Model;
    public humanoid: Humanoid;
    public root: Part;
    //TODO All Region part should be set under SystemObject
    //     Maybe there should be building region
    public regionServices: RegionService[] = [];

    constructor(player: Player) {
        this.player = player;
        this.character = player.Character || player.CharacterAdded.Wait()[0];
        this.humanoid = this.character.WaitForChild(FileNames.HUMANOID) as Humanoid;
        this.root = this.character.WaitForChild(FileNames.HUMANOID_ROOT_PART) as Part;

        const testParts = Workspace.WaitForChild("TestParts").GetChildren();

        for (const instance of testParts) {
            if (instance.Name === "BuildingRegion") {
                const part = new RegionService(instance as Part);
                this.regionServices.push(part);
            }
        }
    }

    public inWaitRegion(): RegionService | undefined {

        let playerInRegion: RegionService | undefined = undefined;

        for (const region of this.regionServices) {
            const regionParts = region.FindPartsInRegion3WithWhiteList(1, [this.root]);
            if (regionParts.size() === 1) {
                playerInRegion = region;
            }
        }

        return playerInRegion;
    }

    public position(): Vector3 {
        return this.root.Position;
    }
}