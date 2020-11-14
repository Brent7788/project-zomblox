import {RunService, Workspace} from "@rbxts/services";
import HitboxObject from "./HitboxObject";
import {FileNames} from "../../Modules/Enums/FileNames";

export default class MainHandler {
    private SYNC_RATE: RBXScriptSignal;
    private ActiveHitboxes: HitboxObject[] = [];


    constructor() {
        this.SYNC_RATE = RunService.IsClient() ? RunService.RenderStepped : RunService.Heartbeat;

        //TODO This increase the script activity significantly
        this.SYNC_RATE.Connect(() => {
            for (let i = 0; i < this.ActiveHitboxes.size(); i++) {
                const hitBox = this.ActiveHitboxes[i];
                if (hitBox.deleted) {
                    this.remove(hitBox.object);
                } else if (hitBox.active) {
                    for (const point of hitBox.points) {
                        print("THe Action hit", hitBox.points.size(), hitBox.active, this.ActiveHitboxes.size());
                        const solve = point.solve(hitBox.debugMode);
                        const reyStart = solve[0];
                        const rayDir = solve[1];
                        const RelativePointToWorld = solve[2];
                        const rayCastResult = Workspace.Raycast(reyStart, rayDir, hitBox.rayCastParams);

                        point.lastPosition(RelativePointToWorld);

                        if (rayCastResult !== undefined) {
                            const hitPart = rayCastResult.Instance;
                            const parent = hitPart.Parent;
                            const humanoid = parent?.FindFirstChild(FileNames.HUMANOID);

                            if (humanoid && hitBox.onHit) {
                                hitBox.onHit(hitPart, (humanoid as Humanoid));
                            }
                        }
                    }
                }
                this.setAllLastPosition(hitBox);
            }
        });
    }

    private setAllLastPosition(hitboxObject: HitboxObject): void {
        if (!hitboxObject.active && !hitboxObject.isAllLastPositionSetNull) {
            for (const point of hitboxObject.points) {
                point.LastPosition = undefined;
            }
            hitboxObject.isAllLastPositionSetNull = true;
        }
    }

    public add(hitboxObject: HitboxObject): void {
        this.ActiveHitboxes.push(hitboxObject);
    }

    public remove(object: Instance): void {
        for (let i = 0; i < this.ActiveHitboxes.size(); i++) {
            if (this.ActiveHitboxes[i].object === object) {
                this.ActiveHitboxes[i].cleanup();
                this.ActiveHitboxes.remove(i);
            }
        }
    }

    public check(object: Instance): HitboxObject | undefined {
        for (let i = 0; i < this.ActiveHitboxes.size(); i++) {
            if (this.ActiveHitboxes[i].object === object) {
                return this.ActiveHitboxes[i];
            }
        }
        return undefined;
    }
}