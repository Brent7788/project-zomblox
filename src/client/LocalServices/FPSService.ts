import {Players, RunService, Workspace} from "@rbxts/services";
import {FileNames} from "../../shared/Modules/Enums/FileNames";

export default class FPSService {

    private fpsGui: ScreenGui;
    private fpsText: TextLabel;

    constructor() {
        this.fpsGui = Players.LocalPlayer
            .WaitForChild(FileNames.PLAYER_GUI)
            .WaitForChild("FPSGui") as ScreenGui;
        this.fpsText  = this.fpsGui.WaitForChild("FPSText") as TextLabel;
    }

    public initFPS(): void {
        RunService.RenderStepped.Connect((step) => {
            const fps = 1/step;
            this.fpsText.Text = "FPS: " + math.round(fps);
        })
    }
}