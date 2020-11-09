import {Workspace} from "@rbxts/services";


export default class RegionService {
    private readonly testRegion: Region3;
    private readonly testPartToIgnor: Part;

    constructor() {
        const testRegPart = Workspace.WaitForChild("Reg") as Part;
        const minP = testRegPart.Position.sub(
            new Vector3(testRegPart.Size.X / 2, testRegPart.Size.Y / 2, testRegPart.Size.Z / 2));

        const maxP = testRegPart.Position.add(
            new Vector3(testRegPart.Size.X / 2, testRegPart.Size.Y / 2, testRegPart.Size.Z / 2));

        this.testPartToIgnor = testRegPart;
        this.testRegion = new Region3(minP,maxP);
    }

    public FindPartsInRegion3(maxParts = 10): BasePart[] {
        //TODO VERY IMPORTANT make FindPartsInRegion3WithWhiteList include humanoid
        return Workspace.FindPartsInRegion3(this.testRegion, this.testPartToIgnor, maxParts);
    }
}