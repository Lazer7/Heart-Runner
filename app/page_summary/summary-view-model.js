var observable = require("tns-core-modules/data/observable");
const fileSystemModule = require("tns-core-modules/file-system");

var SummaryViewModel = (function (_super) {
    __extends(SummaryViewModel, _super);
    SummaryViewModel.prototype.data = new observable.Observable();
    SummaryViewModel.prototype.players = [];

    function SummaryViewModel(args) {
        _super.call(this);
        SummaryViewModel.prototype.players = args.object.navigationContext.playerList;
        SummaryViewModel.prototype.saveData();
        SummaryViewModel.prototype.refresh(0);
    }
    SummaryViewModel.prototype.refresh = function (value) {
        SummaryViewModel.prototype.data.set("currentPlayer", value);
        SummaryViewModel.prototype.data.set("currentData", SummaryViewModel.prototype.players[SummaryViewModel.prototype.data.get("currentPlayer")].heartRate);
        SummaryViewModel.prototype.data.set("currentPlayerLabel", "Current Player: " + SummaryViewModel.prototype.players[SummaryViewModel.prototype.data.get("currentPlayer")].name)
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
    SummaryViewModel.prototype.saveData = function () {
        const documents = fileSystemModule.knownFolders.documents();
        const folder = documents.getFolder("Data");
        var file = folder.getFile("sessionData.txt");
        file.writeText(JSON.stringify(SummaryViewModel.prototype.players))
            .then((result) => {
                file.readText().then((res) => {
                    console.log(res)
                })
            }).catch((err) => {
                console.log(err);
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
    return SummaryViewModel;
})(observable.Observable);

exports.summaryViewModel = SummaryViewModel;
