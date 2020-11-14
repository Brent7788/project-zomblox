export default class Point {

    public RelativePart: BasePart | MeshPart;
    public Attachment: Vector3;
    public LastPosition: Vector3 | undefined;
    public group: object;
    //public solver = CastVectorPoint

    constructor(RelativePart: BasePart | MeshPart, Attachment: Vector3, LastPosition: Vector3 | undefined, group: object) {
        this.RelativePart = RelativePart;
        this.Attachment = Attachment;
        this.LastPosition = LastPosition;
        this.group = group;
    }
}