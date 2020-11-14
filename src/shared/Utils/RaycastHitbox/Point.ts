import InstanceGenerator from "../InstanceGenerator";

export default class Point {

    //TODO RelativePart can not be undefined
    public RelativePart: BasePart | MeshPart | undefined;
    public Attachment: Vector3;
    public LastPosition: Vector3 | undefined;
    public group: Instance | undefined;

    constructor(RelativePart: BasePart | MeshPart | undefined,
                Attachment: Vector3,
                LastPosition: Vector3 | undefined,
                group: Instance | undefined) {
        this.RelativePart = RelativePart;
        this.Attachment = Attachment;
        this.LastPosition = LastPosition;
        this.group = group;
    }

    public solve(debug: boolean): Vector3[] {

        const relativePartToWorldSpace =
            this.RelativePart?.Position.add(
                this.RelativePart.CFrame.VectorToWorldSpace(this.Attachment));

        //TODO maybe error
        if (this.LastPosition === undefined) {
            this.LastPosition = relativePartToWorldSpace;
        }

        //TODO This mite not work because of relativePartToWorldSpace
        if (debug && relativePartToWorldSpace) {
            InstanceGenerator.debugBeam(
                relativePartToWorldSpace.sub(this.LastPosition as Vector3),
                new CFrame(relativePartToWorldSpace, this.LastPosition as Vector3))
        }

        //TODO maybe error
        return [
            this.LastPosition as Vector3,
            (relativePartToWorldSpace as Vector3).sub(this.LastPosition !== undefined ? this.LastPosition : new Vector3()),
            (relativePartToWorldSpace as Vector3)
        ];
    }

    public lastPosition(relativePartToWorldSpace: Vector3) {
        this.LastPosition = relativePartToWorldSpace;
    }
}