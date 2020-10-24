import LocalStartUp from "./LocalStartUp";

class LocalProgram {

    private static readonly  startUp = new LocalStartUp();

    public static run(): void {
        this.startUp.start();
        // TODO Create GUI for this
        /*RunService.RenderStepped.Connect((step) => {
            const fps = 1/step;
            print("FPS: " + fps);
        })*/

    }
}

LocalProgram.run();