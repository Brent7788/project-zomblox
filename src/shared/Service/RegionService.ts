import {Workspace} from "@rbxts/services";
import U from "../Utils/CommonUtil";


export default class RegionService {
    public readonly regionPart: Part;
    private readonly region: Region3;
    private partsToIgnoreOrCheck: Instance[] = [];
    private partToIgnoreOrCheck: Instance | undefined;

    constructor(regionPart: Part, partsToIgnoreOrCheck: Instance[] = []) {
        this.regionPart = regionPart;
        const minP = regionPart.Position.sub(
            new Vector3(regionPart.Size.X / 2, regionPart.Size.Y / 2, regionPart.Size.Z / 2));

        const maxP = regionPart.Position.add(
            new Vector3(regionPart.Size.X / 2, regionPart.Size.Y / 2, regionPart.Size.Z / 2));

        this.partsToIgnoreOrCheck = partsToIgnoreOrCheck;
        this.partToIgnoreOrCheck = partsToIgnoreOrCheck.size() === 1 ? partsToIgnoreOrCheck[0] : undefined;
        this.region = new Region3(minP,maxP);
    }

    public FindPartsInRegion3(maxParts = 10, partToIgnore?: Instance): BasePart[] {
        if (U.isNotNull(partToIgnore)) {
            this.partToIgnoreOrCheck = partToIgnore;
        }
        return Workspace.FindPartsInRegion3(this.region, this.partToIgnoreOrCheck, maxParts);
    }

    public FindPartsInRegion3WithIgnoreList(maxParts = 10): BasePart[] {
        return Workspace.FindPartsInRegion3WithIgnoreList(this.region, this.partsToIgnoreOrCheck, maxParts);
    }

    public FindPartsInRegion3WithWhiteList(maxParts = 10,
                                           whiteList: Instance[] = []): BasePart[] {
        if (whiteList.size() > 0) {
            this.partsToIgnoreOrCheck = whiteList;
        }
        return Workspace.FindPartsInRegion3WithWhiteList(this.region, this.partsToIgnoreOrCheck, maxParts);
    }
}