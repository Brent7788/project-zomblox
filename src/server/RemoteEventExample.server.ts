import {ReplicatedStorage} from "@rbxts/services";

const remote = ReplicatedStorage.WaitForChild("PIckUp") as RemoteEvent;


remote.OnServerEvent.Connect((player, args) =>  {
    print(player);
    print("From Client: " + args);
});
