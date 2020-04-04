var observable = require("tns-core-modules/data/observable");
const fileSystemModule = require("tns-core-modules/file-system");
var dialogs = require("tns-core-modules/ui/dialogs");
const httpModule = require("tns-core-modules/http");

var SummaryViewModel = (function (_super) {
    __extends(SummaryViewModel, _super);
    SummaryViewModel.prototype.data = new observable.Observable();
    SummaryViewModel.prototype.players = [];
    SummaryViewModel.prototype.ipAddress = "http://192.168.254.13"
    SummaryViewModel.prototype.packageLength = 1000;
    function SummaryViewModel(args) {
        _super.call(this);
        SummaryViewModel.prototype.players = args.object.navigationContext.playerList;
        SummaryViewModel.prototype.createFile();
        SummaryViewModel.prototype.refresh(0);
    }
    SummaryViewModel.prototype.refresh = function (value) {
        var currentPlayer = SummaryViewModel.prototype.players[value]

        SummaryViewModel.prototype.data.set("currentPlayer", value);
        SummaryViewModel.prototype.data.set("currentData", currentPlayer.heartRate);
        SummaryViewModel.prototype.data.set("currentPlayerLabel", "Current Player: " + currentPlayer.name)

        var red = 0,
            yellow = 0,
            green = 0;
        SummaryViewModel.prototype.players[SummaryViewModel.prototype.data.get("currentPlayer")].stars.forEach((element) => {
            if (element.star === "Red") {
                red++;
            } else if (element.star === "Yellow") {
                yellow++;
            } else {
                green++;
            }
        });
        SummaryViewModel.prototype.data.set("red", "Red Stars: " + red)
        SummaryViewModel.prototype.data.set("yellow", "Yellow Stars: " + yellow)
        SummaryViewModel.prototype.data.set("green", "Green Stars: " + green)

    }
    SummaryViewModel.prototype.changePlayer = function () {
        var currentData = SummaryViewModel.prototype.data.get("currentPlayer");
        if ((currentData + 1) === SummaryViewModel.prototype.players.length) {
            SummaryViewModel.prototype.data.set("currentPlayer", 0);
        } else {
            SummaryViewModel.prototype.data.set("currentPlayer", currentData + 1);
        }
        SummaryViewModel.prototype.refresh(SummaryViewModel.prototype.data.get("currentPlayer"));
    }
    SummaryViewModel.prototype.postData = function () {
        dialogs.prompt({
            title: "Save Remotely",
            message: "Enter in your computer's IP",
            okButtonText: "Send",
            cancelButtonText: "Cancel",
            defaultText: SummaryViewModel.prototype.ipAddress
        }).then(function (r) {
            var result = JSON.stringify(SummaryViewModel.prototype.players);
            SummaryViewModel.prototype.sendValues(r.text, result, 0, SummaryViewModel.prototype.packageLength);
        });
    }
    SummaryViewModel.prototype.toUserForm = function (args) {
        const button = args.object;
        const page = button.page;

        var navigationEntry = {
            moduleName: "page_userform/userform-page",
            context: {
                playerList: []
            }
        }
        page.frame.navigate(navigationEntry);
    }

    // Creating Files
    SummaryViewModel.prototype.sendValues = function (ipaddress, result, startIndex, endIndex) {
        console.log(result.substring(startIndex, endIndex));
        fetch(ipaddress, {
            method: "POST",
            body: JSON.stringify({
                data: result.substring(startIndex, endIndex)
            })
        }).then((r) => {
            var nextIndex = (endIndex + SummaryViewModel.prototype.packageLength) > result.length ? result.length : endIndex + SummaryViewModel.prototype.packageLength;
            if (endIndex !== result.length)
                SummaryViewModel.prototype.sendValues(ipaddress, result, startIndex + SummaryViewModel.prototype.packageLength, nextIndex)
        });
    }
    SummaryViewModel.prototype.createFile = function () {
        console.log("Files!")
        // Find Heart Runner Local Folder Location
        const documents = fileSystemModule.knownFolders.documents();
        // Create/Find Folder
        const folder = documents.getFolder("Session Data");
        // Checking if file exist and create "unique" file
        var fileLocation = fileSystemModule.path.join(folder.path, "session.txt");
        var counter = 1;
        while (fileSystemModule.File.exists(fileLocation)) {
            fileLocation = fileSystemModule.path.join(folder.path, "session(" + counter + ").txt");
            counter++;
        }
        // Create new file
        var file = fileSystemModule.File.fromPath(fileLocation);
        // Write Data
        file.writeText(JSON.stringify(SummaryViewModel.prototype.players))
            .then((result) => {
            }).catch((err) => {
                console.log(err);
            });
    }
    return SummaryViewModel;
})(observable.Observable);

exports.summaryViewModel = SummaryViewModel;
