import {FileNames} from "../../../shared/Modules/Enums/FileNames";
import {ContainerEnum} from "../../../shared/Modules/Enums/ContainerEnum";

export default class Container {
    private containerFrame: Frame;
    private containerIcon: ImageLabel;
    private containerButton: TextButton;

    constructor(baseContainer: Frame, containerIcon: ContainerEnum) {
        this.containerFrame = baseContainer.Clone();
        this.containerFrame.Visible = true;
        this.containerFrame.Parent = baseContainer.Parent;
        this.containerFrame.Name = "Container";

        this.containerIcon = this.containerFrame.FindFirstChild(FileNames.CONTAINER_ICON) as ImageLabel;
        this.containerIcon.Image = containerIcon;

        this.containerButton = this.containerFrame.FindFirstChild(FileNames.CONTAINER_BUTTON) as TextButton;
    }

    public static destroyContainers(containers: Instance[], destroy?: (index: number) => void): void {
        if (containers !== undefined && containers.size() > 1) {
            for (let i = 0; i < containers.size(); i++) {
                switch (containers[i].Name) {
                    case "OtherItemList":
                        break;
                    case FileNames.BASE_ITEM:
                        break;
                    case FileNames.ITEM:
                        if (destroy === undefined) {
                            containers[i].Destroy();
                        } else {
                            destroy(i);
                        }
                        break;
                }
            }
        }
    }
}