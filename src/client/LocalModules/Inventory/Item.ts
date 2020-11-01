import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {Players} from "@rbxts/services";
import ItemValue from "../../../shared/Modules/ItemValue";

export default class Item {
    public id: StringValue;
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemCategoryText: TextLabel;
    public containerId: StringValue;
    public itemPopUpDescFrame: Frame;
    public itemQuantityText: TextLabel;
    public itemValue: ItemValue;
    public stopPopUpLoop = false;

    constructor(item: Frame, guid: string, itemValue: ItemValue) {
        this.itemFrame = item.Clone();
        this.itemFrame.Visible = true;
        this.itemFrame.Parent = item.Parent;
        this.itemFrame.Name = FileNames.UI_ITEM;
        this.itemValue = itemValue;

        this.containerId = InstanceGenerator.generateId(this.itemFrame, FileNames.CONTAINER_ID, guid);
        this.id = InstanceGenerator.generateStringValue(this.itemFrame, this.itemValue.id, "Id");

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;

        this.itemIcon.Image = this.itemValue.itemIcon;
        this.itemTypeText.Text = this.itemValue.itemType;
        this.itemCategoryText.Text = this.itemValue.itemCategory;

        this.itemPopUpDescFrame = item.Parent?.Parent?.FindFirstChild(FileNames.ITEM_POP_UP_DESC) as Frame;
        this.itemQuantityText = this.itemPopUpDescFrame.FindFirstChild(FileNames.ITEM_QUANTITY) as TextLabel;

        //this.initItemPopUpDesc();
    }

    private initItemPopUpDesc() {
        this.itemFrame.MouseEnter.Connect(() => {
            this.stopPopUpLoop = true;
            this.itemQuantityText.Text = `   Item Quantity: ${this.itemValue.itemCount}`;
            let count = 0;
            while (this.stopPopUpLoop) {
                this.itemPopUpDescFrame.Visible = true;
                const playerMouse = Players.LocalPlayer.GetMouse() as PlayerMouse;
                wait();
                this.itemPopUpDescFrame.Position = UDim2.fromOffset(playerMouse.X + 8, playerMouse.Y + 8);
                count++;
                if (count > 300) {
                    //TODO Find a better sulotion to break this loop
                    this.stopPopUpLoop = false;
                    this.itemPopUpDescFrame.Visible = false;
                }
            }
        });
        this.itemFrame.MouseLeave.Connect((x, y) => {
            this.itemPopUpDescFrame.Visible = false;
            this.stopPopUpLoop = false;
        });
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }
}