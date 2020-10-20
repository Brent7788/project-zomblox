import {Workspace} from "@rbxts/services";

const part = Workspace.WaitForChild("TestPart") as Part;
const ev = part.FindFirstChild("Event") as BindableEvent;


/*part.Touched.Connect(otherPart => {
    print("This is the touched", otherPart);
})*/

// eslint-disable-next-line prefer-const
let start: RBXScriptConnection;
let endd: RBXScriptConnection;

function testt(otherPart: BasePart) {
    print("Start", otherPart, otherPart.Parent?.IsA("Player"));
    start.Disconnect();
    endd = part.TouchEnded.Connect(test2);
}

function test2(otherPart: BasePart) {
    print("End", otherPart);
    endd.Disconnect();
    wait(1.5);
    start = part.Touched.Connect(testt);
}

start = part.Touched.Connect(testt);
// eslint-disable-next-line prefer-const
//endd = part.TouchEnded.Connect(test2);


