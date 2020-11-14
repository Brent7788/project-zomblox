import {Workspace, Players} from "@rbxts/services";
import Point from "./Point";

export default class HitboxObject {
    public active = false;
    public deleted = false;
    public partMode = false;
    public debugMode = false;
    public points: Point[] = [];
    public isAllLastPositionSetNull = false;
    public onHit: ((hitPart: Instance, humanoid: Humanoid) => void) | undefined = undefined;
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

    public OnHit(onHit: (hitPart: Instance, humanoid: Humanoid) => void) {
        this.onHit = onHit;
    }

    //TODO Make object: Instance to BasePart or MeshPart class
    public SetPoints(object: Instance, vectorPoints: Vector3[], groupName: Instance | undefined = undefined): void {
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

    public seekAttachments(attachmentName: string, canWarn: boolean): void {
        if (this.points.size() <= 0) {
            this.rayCastParams.FilterDescendantsInstances.push(Workspace.Terrain);
        }
        for (const attachment of this.object.GetDescendants()) {
            if (attachment.IsA("Attachment") && attachment.Name === attachmentName) {
                const  group = attachment.FindFirstChild("Group");
                print("The Group", group, (attachment.Parent as BasePart).Position);
                //TODO attachment.Parent get the main part the will be used as weapon
                const point = new Point(
                    this.object as BasePart,
                    attachment.Position,
                    undefined,
                    group
                );
                this.points.push(point);
            }
        }

        if (canWarn) {
            if (this.points.size() <= 0) {
                warn("\n[[RAYCAST WARNING]]\nNo attachments with the name '%s' were found in %s. No raycasts will be drawn. Can be ignored if you are using SetPoints.",
                    attachmentName, this.object.Name
                );
            } else {
                print("\n[[RAYCAST MESSAGE]]\n\nCreated Hitbox for %s - Attachments found: %s",
                    this.object.Name, this.points.size()
                );
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
        this.isAllLastPositionSetNull = false;
    }

    public PartMode(partMode: boolean) {
        this.partMode = partMode
    }

    public DebugMode(debugMode: boolean) {
        this.debugMode = debugMode
    }
}