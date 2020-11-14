import Point from "../Point";
import InstanceGenerator from "../../InstanceGenerator";

export default class CastVectorPoint {

    public static solve(point: Point, debug: boolean): Vector3[] {
        const relativePartToWorldSpace =
            point.RelativePart.Position.add(
                point.RelativePart.CFrame.VectorToWorldSpace(point.Attachment));

        if (point.LastPosition !== undefined) {
            point.LastPosition = relativePartToWorldSpace;
        }

        if (debug) {
            InstanceGenerator.debugBeam(
                relativePartToWorldSpace.sub(point.LastPosition as Vector3),
                new CFrame(relativePartToWorldSpace, point.LastPosition as Vector3))
        }

        return [
            point.LastPosition as Vector3,
            relativePartToWorldSpace.sub(point.LastPosition !== undefined ? point.LastPosition : new Vector3()),
            relativePartToWorldSpace
        ];
    }

    public static lastPosition(point: Point, relativePartToWorldSpace: Vector3) {
        point.LastPosition = relativePartToWorldSpace;
    }
}