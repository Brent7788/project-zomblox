import {Workspace} from "@rbxts/services";
import InstanceGenerator from "../shared/Utils/InstanceGenerator";
import ZombieCrossPoint from "./ServerModules/ZombieCrossPoint";

/*function intersection_point(startPoint1: Vector3,
                            endPoint1: Vector3,
                            startPoint2: Vector3,
                            endPoint2: Vector3): ZombieCrossPoint {

    const point_1_x1 = startPoint1.X;
    const point_1_y1 = startPoint1.Z;
    const point_1_x2 = endPoint1.X;
    const point_1_y2 = endPoint1.Z;

    const point_2_x1 = startPoint2.X;
    const point_2_y1 = startPoint2.Z;
    const point_2_x2 = endPoint2.X;
    const point_2_y2 = endPoint2.Z;

    //m = (y1 - y2) / (x1 - x2)
    let line_1_m = 0;
    let line_2_m = 0;
    //b = -(mx1) + y1
    let line_1_b = 0;
    let line_2_b = 0;

    let intersect_x = 0;
    let intersect_z = 0;

    const isLineOneVertical = ((point_1_x1/point_1_x2) % 2) === 1;
    const isLineTwoVertical = ((point_2_x1/point_2_x2) % 2) === 1;

    if (isLineOneVertical && isLineTwoVertical) {
        return new ZombieCrossPoint();
    }

    //Line 1
    if (isLineOneVertical) {

        line_2_m = (point_2_y1 - point_2_y2) / (point_2_x1 - point_2_x2);

        line_2_b = -(line_2_m * point_2_x1) + point_2_y1;

        intersect_x = point_1_x1;
        intersect_z = (line_2_m * intersect_x) + line_2_b;
        //Line 2
    } else if (isLineTwoVertical) {
        line_1_m = (point_1_y1 - point_1_y2) / (point_1_x1 - point_1_x2);

        line_1_b = -(line_1_m * point_1_x1) + point_1_y1;

        intersect_x = point_2_x1;
        intersect_z = (line_1_m * intersect_x) + line_1_b;
    } else {
        line_1_m = (point_1_y1 - point_1_y2) / (point_1_x1 - point_1_x2);
        line_2_m = (point_2_y1 - point_2_y2) / (point_2_x1 - point_2_x2);
        print("M", line_1_m, line_2_m);

        if (line_1_m === line_2_m) {
            return new ZombieCrossPoint();
        }
        line_1_b = -(line_1_m * point_1_x1) + point_1_y1;
        line_2_b = -(line_2_m * point_2_x1) + point_2_y1;

        intersect_x = (line_2_b - line_1_b) / (line_1_m - line_2_m);
        intersect_z = (line_1_m * intersect_x) + line_1_b;
        print("IN", intersect_x, intersect_z);
    }

    //Check if cross between the two points
    if ((intersect_x >= point_1_x1 && intersect_x <= point_1_x2) &&
        (intersect_x >= point_2_x1 && intersect_x <= point_2_x2)) {
        return new ZombieCrossPoint(new Vector3(intersect_x, 0, intersect_z));
    }

    return new ZombieCrossPoint();
}*/


const start1 = new Vector3(14, 0, 22);
const end1 = new Vector3(36, 0, 31);
const start2 = new Vector3(18, 0, 6);
const end2 = new Vector3(19, 0, 26);


/*const tt = intersection_point(
    start1,
    end1,
    start2,
    end2,
);*/

const tw = start1.sub(end1);

print("HELLO" ,tw, start1);

