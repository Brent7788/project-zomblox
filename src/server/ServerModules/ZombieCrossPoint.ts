
export default class ZombieCrossPoint {
    public isCrossPoint: boolean;
    public crossPoint: Vector3 | undefined;

    constructor(crossPoint: Vector3 | undefined = undefined) {
        this.isCrossPoint = !(crossPoint === undefined);
        this.crossPoint = crossPoint;
    }
}
