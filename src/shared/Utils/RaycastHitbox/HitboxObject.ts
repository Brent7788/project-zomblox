import {Workspace, Players} from "@rbxts/services";
import Point from "./Point";

export default class HitboxObject {
    public active = false;
    public deleted = false
    public partMode = false
    public debugMode = false
    public points: Point[] = []
    public targetsHit = []
    //private OnHit = Signal:Create()
    public rayCastParams = new RaycastParams();
    public object: Instance;

    constructor(object: Instance, ignoreList: Instance[] = []) {
        this.object = object;
        this.rayCastParams.FilterType = Enum.RaycastFilterType.Blacklist;
        this.rayCastParams.FilterDescendantsInstances = ignoreList;

        this.object.AncestryChanged.Connect((child) => {
            if (Workspace.IsAncestorOf(this.object) && Players.IsAncestorOf(this.object)) {
                this.cleanup()
            }
        });
    }

    //TODO Make object: Instance to BasePart or MeshPart class
    public SetPoints(object: Instance, vectorPoints: Vector3[], groupName: object): void {
        if (object !== undefined &&
            (object.IsA("BasePart") || object.IsA("MeshPart"))) {

            for (const vectorPoint of vectorPoints) {
                this.points.push(new Point(
                    object,
                    vectorPoint,
                    undefined,
                    groupName
                ));
            }
        }
    }

    public cleanup(): void {
        if (this.deleted) return;

        //if self.OnHit then self.OnHit:Delete() end
        this.points = [];
        this.active = false;
        this.deleted = true;
    }

    public HitStart() {
        this.active = true;
    }

    public HitStop() {
        if (this.deleted) return


        this.active = false;
        this.targetsHit = [];
    }

    public PartMode(partMode: boolean) {
        this.partMode = partMode
    }

    public DebugMode(debugMode: boolean) {
        this.debugMode = debugMode
    }
}