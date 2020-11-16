import MainHandler from "./MainHandler";
import HitboxObject from "./HitboxObject";

//https://github.com/Swordphin/raycastHitboxRbxl/wiki/Beginner-Examples
export default class RaycastHitbox {

    public static handler = new MainHandler();

    public static Initialize(object: Instance, ignoreList: Instance[] = []): HitboxObject {
        assert(object, "You must provide an object instance.");


        let newHitbox = this.handler.check(object);

        if (newHitbox === undefined) {
            newHitbox = new HitboxObject(object, ignoreList);
            newHitbox.seekAttachments("DmgPoint", true);
            newHitbox.debugMode = true;
            this.handler.add(newHitbox);
        }

        return newHitbox;
    }

    public static Deinitialize(object: Instance): void {
        this.handler.remove(object);
    }

    public static GetHitbox(object: Instance): HitboxObject | undefined {
        return this.handler.check(object);
    }
}