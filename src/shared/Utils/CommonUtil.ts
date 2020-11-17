
export default class U {

    public static vector3(num: number): Vector3 {
        return new Vector3(num,num,num);
    }

    public static mulVector3(vecToMul: Vector3, num: number): Vector3 {
        return vecToMul.mul(this.vector3(num));
    }

    public static ifNotNull<T>(object: T | undefined, notNullLogic: (object: T) => void): boolean {
        if (object !== undefined) {
            notNullLogic(object);
            return true;
        }
        return false;
    }

    public static ifNotNullAnd<T>(object: T | undefined, notNullLogic: (object: T) => void, AND: boolean): boolean {
        if (object !== undefined && AND) {
            notNullLogic(object);
            return true;
        }
        return false;
    }

    public static ifNotNullElse<T>(object: T | undefined,
                                   notNullLogic: (object: T) => void,
                                   isNullLogic: () => void = () => {}): void {
        if (object !== undefined) {
            notNullLogic(object);
        } else {
            isNullLogic();
        }
    }

    public static isNotNull(object: unknown): boolean {
        return !this.isNull(object);
    }

    public static isNull(object: unknown): boolean {
        return object === undefined;
    }
}