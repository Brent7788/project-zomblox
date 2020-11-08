
export default class ZombiePath {
    public id: string;
    public wayPoints: PathWaypoint[] = [];

    constructor(id: string, wayPoints: PathWaypoint[]) {
        this.id = id;
        this.wayPoints = wayPoints;
    }
}