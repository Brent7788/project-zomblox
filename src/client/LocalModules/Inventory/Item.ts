import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {Players} from "@rbxts/services";
import ItemValue from "../../../shared/Modules/ItemValue";

export default class Item {
    public id: StringValue;
    public containerId: StringValue;
    public itemFrame: Frame;
    public itemIcon: ImageButton;
    public itemArrowButton: ImageButton;
    public itemTypeText: TextLabel;
    public itemQuantityValue: IntValue;
    public itemCategoryText: TextLabel;
    public itemLoader: TextLabel;
    public itemPopUpDescFrame: Frame;
    //TODO There is still weird item quantity bug
    public itemQuantityText: TextLabel;
    public itemValue: ItemValue;

    constructor(item: Frame, guid: string, itemValue: ItemValue) {
        this.itemFrame = item.Clone();
        this.itemFrame.Visible = true;
        this.itemFrame.Parent = item.Parent;
        this.itemFrame.Name = FileNames.UI_ITEM;
        this.itemValue = itemValue;

        this.containerId = InstanceGenerator.generateId(this.itemFrame, FileNames.CONTAINER_ID, guid);
        this.id = InstanceGenerator.generateStringValue(this.itemFrame, this.itemValue.id, "Id");
        this.itemQuantityValue = InstanceGenerator.generateIntValue(this.itemFrame, itemValue.itemCount, FileNames.ITEM_QUANTITY);

        this.itemIcon = this.itemFrame.WaitForChild(FileNames.ITEM_ICON) as ImageButton;
        this.itemArrowButton = this.itemFrame.WaitForChild(FileNames.IMAGE_ARROW) as ImageButton;
        this.itemTypeText = this.itemFrame.WaitForChild(FileNames.TYPE_DECS) as TextLabel;
        this.itemCategoryText = this.itemFrame.WaitForChild(FileNames.CATEGORY_DECS) as TextLabel;
        this.itemLoader = this.itemFrame.WaitForChild(FileNames.UI_ITEM_LOADER) as TextLabel;

        this.itemIcon.Image = this.itemValue.itemIcon;
        this.itemTypeText.Text = this.itemValue.itemType;
        this.itemCategoryText.Text = this.itemValue.itemCategory;

        this.itemPopUpDescFrame = item.Parent?.Parent?.FindFirstChild(FileNames.ITEM_POP_UP_DESC) as Frame;
        this.itemQuantityText = this.itemPopUpDescFrame.FindFirstChild(FileNames.ITEM_QUANTITY) as TextLabel;

        this.initItemPopUpDesc();
    }

    private initItemPopUpDesc() {
        this.itemFrame.MouseEnter.Connect((x, y) => {
            wait();
            this.itemQuantityText.Text = `   Item Quantity: ${this.itemQuantityValue.Value}`;
            this.itemPopUpDescFrame.Visible = true;
            let count = 0;
            this.itemPopUpDescFrame.Position = UDim2.fromOffset(x + 15, y + 10);
            while (this.itemPopUpDescFrame.Visible) {
                this.itemPopUpDescFrame.Visible = true;
                const playerMouse = Players.LocalPlayer.GetMouse() as PlayerMouse;
                wait();
                this.itemPopUpDescFrame.Position = UDim2.fromOffset(playerMouse.X + 15, playerMouse.Y + 10);
                count++;
                //Break loop just encase
                if (count > 3000) {
                    this.itemPopUpDescFrame.Visible = false;
                }
            }
        });
        this.itemFrame.MouseLeave.Connect((x, y) => {
            this.itemPopUpDescFrame.Visible = false;
        });
    }

    public displayItemLoader(): void {
        //TODO The time should be calculated base on the item weight;
        const seconds = 1;
        this.itemLoader.Visible = true;
        this.itemLoader.TweenSize(
            UDim2.fromScale(0, 1),
            "InOut",
            "Quad",
            seconds);
        wait(seconds);
        this.itemLoader.Visible = false;
        this.itemLoader.Size = UDim2.fromScale(1, 1);
    }

    public getItemParent(): Frame {
        return this.itemFrame.Parent as Frame;
    }

    public setItemParent(parent: Frame): void {
        this.itemFrame.Parent = parent;
    }
}