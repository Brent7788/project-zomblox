import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ItemEnum} from "../../../shared/Modules/Enums/ItemEnum";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {Players} from "@rbxts/services";

export default class Item {
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemCategoryText: TextLabel;
    public containerId: StringValue;
    public itemValue: StringValue;

    constructor(item: Frame, itemEnum: ItemEnum | string, guid: string, itemCount = 1) {
        this.itemFrame = item.Clone();
        this.itemFrame.Visible = true;
        this.itemFrame.Parent = item.Parent;
        this.itemFrame.Name = FileNames.ITEM;

        this.containerId = InstanceGenerator.generateId(this.itemFrame, FileNames.CONTAINER_ID, guid);
        this.itemValue = InstanceGenerator.generateStringValue(
            this.itemFrame,
            `${itemCount};${itemEnum}#`,
            "ItemValue");

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;

        const itemEnumStrings = Item.formatItemEnum(itemEnum);
        this.itemIcon.Image = itemEnumStrings[0];
        this.itemTypeText.Text = itemEnumStrings[1];
        this.itemCategoryText.Text = itemEnumStrings[2];

        this.onMouce();
    }

    //TODO Maybe create class of this to make it more explesite
    private static formatItemEnum(itemEnum: ItemEnum | string): string[] {
        return itemEnum.split(",");
    }

    private onMouce() {
        const f = new Instance("Frame") as Frame;
        f.Visible = false;
        f.Parent = this.itemFrame.Parent?.Parent;
        f.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
        f.Size = UDim2.fromScale(0.05, 0.05);
        f.Transparency = 0.5;
        f.Name = "" + DateTime.now();
        //f.LayoutOrder = this.itemFrame.LayoutOrder + 1;
        let stop = false;

        this.itemFrame.MouseEnter.Connect(() => {
            print("Mousdfsd", f.Parent, this.itemFrame.Parent,this.itemFrame.LayoutOrder);
            f.Visible = true;
            f.Parent = this.itemFrame.Parent?.Parent;
            while (stop) {
                const playerMouse = Players.LocalPlayer.GetMouse() as PlayerMouse;
                print("stropopp", playerMouse.X, playerMouse.Y - 2, this.itemFrame);
                wait();
                f.Position = UDim2.fromOffset(playerMouse.X + 2, playerMouse.Y - 2);
            }
        });
        this.itemFrame.MouseLeave.Connect((x, y) => {
            print("Mousdfsd", f);
            f.Visible = false;
            stop = true;
        });
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }
}