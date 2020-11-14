import {RunService, Workspace} from "@rbxts/services";
import HitboxObject from "./HitboxObject";
import CastVectorPoint from "./CastLogics/CastVectorPoint";

export default class MainHandler {
    private SYNC_RATE: RBXScriptSignal;
    private ActiveHitboxes: HitboxObject[] = [];


    constructor() {
        this.SYNC_RATE = RunService.IsClient() ? RunService.RenderStepped : RunService.Heartbeat;

        this.SYNC_RATE.Connect(() => {
            for (let i = 0; i < this.ActiveHitboxes.size(); i++) {
                const hitBox = this.ActiveHitboxes[i];
                if (hitBox.deleted) {
                    this.remove(hitBox.object);
                } else {
                    for (const point of hitBox.points) {
                        if (hitBox.active) {
                            //TODO This mite not work because point is a copy
                            point.LastPosition = undefined;
                        } else {
                            //TODO Put CastVectorPoint method in to Point class
                            const reyStart = CastVectorPoint.solve(point, hitBox.debugMode)[0];
                            const rayDir = CastVectorPoint.solve(point, hitBox.debugMode)[1];
                            const RelativePointToWorld = CastVectorPoint.solve(point, hitBox.debugMode)[2];
                            const rayCastResult = Workspace.Raycast(reyStart, rayDir, hitBox.rayCastParams);
                            CastVectorPoint.lastPosition(point, RelativePointToWorld);

                            if (rayCastResult !== undefined) {
                                const hitPart = rayCastResult.Instance
                                let findModel: Model | boolean | undefined = false;

                                if (!hitBox.partMode) {
                                    findModel = hitPart.FindFirstAncestorOfClass("Model");
                                }


                                //const humanoid = findModel !== undefined ? findModel : findModel.FindFirstChildOfClass("Humanoid")
                                let humanoid;

                                if (findModel) {
                                    humanoid = findModel;
                                }

                                const target = findModel !== undefined || (hitBox.partMode && hitPart !== undefined);

                                /*if (target && !hitBox.targetsHit[target])
                                {
                                }*/
                            }
                        }
                    }
                }
            }
        });
    }

    public add(hitboxObject: HitboxObject): void {
       // assert(typeof(hitboxObject) )
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

    public check(object: Instance): Instance | undefined {
        for (let i = 0; i < this.ActiveHitboxes.size(); i++) {
            if (this.ActiveHitboxes[i].object === object) {
                return this.ActiveHitboxes[i].object;
            }
        }
        return undefined;
    }
}