import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import InstanceGenerator from "../../../shared/Utils/InstanceGenerator";
import {ContainerIcon} from "../../../shared/Modules/Enums/ContainerIcon";
import {ContainerType} from "../../../shared/Modules/Enums/ContainerType";

export default class Container {
    public containerFrame: Frame;
    public containerIcon: ImageLabel;
    public containerButton: TextButton;
    public containerId: StringValue;

    constructor(baseContainer: Frame, guid: string, containerType: string | undefined) {
        this.containerFrame = baseContainer.Clone();
        this.containerFrame.Visible = true;
        this.containerFrame.Parent = baseContainer.Parent;
        this.containerFrame.Name = "Container";

        this.containerIcon = this.containerFrame.FindFirstChild(FileNames.CONTAINER_ICON) as ImageLabel;
        this.containerIcon.Image = this.getContainerIconByType(containerType);

        this.containerButton = this.containerFrame.FindFirstChild(FileNames.CONTAINER_BUTTON) as TextButton;

        this.containerId = InstanceGenerator.generateId(this.containerFrame, FileNames.CONTAINER_ID, guid);
    }

    private getContainerIconByType(containerType: string | undefined): string {
        let containerIcon = ContainerIcon.BLOCK;

        switch (containerType) {
            case ContainerType.FRIDGE:
                containerIcon = ContainerIcon.FRIDGE;
                break;
            case ContainerType.DUSTBIN:
                containerIcon = ContainerIcon.DUSTBIN;
                break;
        }

        return containerIcon;
    }
}