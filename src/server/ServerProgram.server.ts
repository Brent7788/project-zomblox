import ServerStartUp from "./ServerStartUp";

class ServerProgram {

    private static startUp = new ServerStartUp();

    public static run(): void {
        this.startUp.start();
    }
}

ServerProgram.run();