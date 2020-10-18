import {ReplicatedStorage} from "@rbxts/services";
import {FileNames} from "../shared/Modules/Enums/FileNames";

const remote = ReplicatedStorage.WaitForChild(FileNames.PICK_UP_EXAMPLE) as RemoteEvent;


remote.OnServerEvent.Connect((player, args) =>  {
    print(player);
    print("From Client: " + args);
});
