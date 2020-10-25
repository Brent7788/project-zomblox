import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ContainerEnum} from "../../../shared/Modules/Enums/ContainerEnum";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";

export default class Container {
    public containerFrame: Frame;
    public containerIcon: ImageLabel;
    public containerButton: TextButton;
    public containerId: StringValue;

    constructor(baseContainer: Frame, containerIcon: ContainerEnum, guid: string) {
        this.containerFrame = baseContainer.Clone();
        this.containerFrame.Visible = true;
        this.containerFrame.Parent = baseContainer.Parent;
        this.containerFrame.Name = "Container";

        this.containerIcon = this.containerFrame.FindFirstChild(FileNames.CONTAINER_ICON) as ImageLabel;
        this.containerIcon.Image = containerIcon;

        this.containerButton = this.containerFrame.FindFirstChild(FileNames.CONTAINER_BUTTON) as TextButton;

        this.containerId = InstanceGenerator.generateId(this.containerFrame, FileNames.CONTAINER_ID, guid);
    }
}