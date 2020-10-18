import LocalStartUp from "./LocalStartUp";

class LocalProgram {

    private static readonly  startUp = new LocalStartUp();

    public static run(): void {
        this.startUp.start();
    }
}

LocalProgram.run();