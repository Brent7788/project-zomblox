import {Players, Workspace} from "@rbxts/services";
import ItemValue from "../shared/Modules/ItemValue";
import {ItemEnum} from "../shared/Modules/Enums/ItemEnum";
import ItemGenerator from "../shared/Service/ItemGenerator";

const reg = Workspace.WaitForChild("Reg") as Part;
const fridges = Workspace.WaitForChild("TestParts")
    .WaitForChild("TestContainers").GetChildren() as Array<Instance>;

const minP = reg.Position.sub(
    new Vector3(reg.Size.X / 2, reg.Size.Y / 2, reg.Size.Z / 2));

const maxP = reg.Position.add(
    new Vector3(reg.Size.X / 2, reg.Size.Y / 2, reg.Size.Z / 2));

const region = new Region3(minP, maxP);
//const region = new Region3(new Vector3(0, 0, 0), new Vector3(30, 30, 30));

const pa = new Instance("Part");
pa.Anchored = true;
pa.Size = region.Size;
pa.CFrame = region.CFrame;
pa.Parent = Workspace;
pa.CanCollide = false;
pa.Transparency = 0.8;

const ig: Array<Instance> = [pa, reg];

print(fridges.size());

const items = new ItemGenerator();

fridges.forEach(f => {
    const c = f.FindFirstChild("Container#") as StringValue;
    const i = items.toItemValueArray(c.Value);
    i.forEach(ii => {
        print(ii.itemCount + " " + ii.itemUIValues);
    })
});


while (wait(0.5)) {
    const parts = Workspace.FindPartsInRegion3WithIgnoreList(region, ig, 100);
    let player: Player | undefined = undefined;
    const partPs: Array<Vector3> = [];
    parts.forEach((p) => {
        const h = p.Parent?.FindFirstChild("Humanoid")
        const isPart = p.IsA("Part");
        if (h !== undefined) {
            print("Test " + h);
            //humanP = p.Position;
            player = Players.GetPlayerFromCharacter(p.Parent);
        } else if (isPart) {
            partPs.push(p.Position);
        }
    });

    print("P: " , partPs.size());
    if (player !== undefined) {
        partPs.forEach((pos) => {
            print(player?.DistanceFromCharacter(pos));
        });
    }
}
