var observable = require("tns-core-modules/data/observable");
const platformModule = require("tns-core-modules/platform");
var observableArray = require("tns-core-modules/data/observable-array");
var frameModule = require("tns-core-modules/ui/frame");
var dialogs = require("tns-core-modules/ui/dialogs");
var imageModule = require("tns-core-modules/ui/image");
const timerModule = require("tns-core-modules/timer");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();


var UserFormViewModel = (function (_super) {
    __extends(UserFormViewModel, _super);
    var observablePlayerArray = new observableArray.ObservableArray();
    UserFormViewModel.prototype.players = observablePlayerArray;
    UserFormViewModel.prototype.data = new observable.Observable();

    function UserFormViewModel(args) {
        _super.call(this);
        this.playerList = args.object.navigationContext ? args.object.navigationContext.playerList : [];
        UserFormViewModel.prototype.data.set("timer", 0);
        if (this.playerList.length !== 0) {
            this.playerList.forEach(element => {
                observablePlayerArray.push(element);
            })
        }
    }
    UserFormViewModel.prototype.addPlayer = function (args) {
        const button = args.object;
        const page = button.page;
        var navigationEntry = {
            moduleName: "page_connection/connection-page",
            context: {
                playerList: this.playerList
            }
        }
        observablePlayerArray.splice(0, observablePlayerArray.length)
        page.frame.navigate(navigationEntry);
    }

    UserFormViewModel.prototype.start = function (args) {
        if (this.playerList.length >= 1) {
            const button = args.object;
            const page = button.page;
            var navigationEntry = {
                moduleName: "page_visualization/visualization-page",
                context: {
                    playerList: this.playerList
                }
            }
            observablePlayerArray.splice(0, observablePlayerArray.length)
            page.frame.navigate(navigationEntry);
        } else {
            dialogs.alert({
                title: "Error",
                message: "You need to add some players!"
            })
        }
    }
    UserFormViewModel.prototype.deleteUser = function (args) {
        var self = this;
        dialogs.confirm({
            title: "Delete Player?",
            message: "Are you sure you want to delete player: " + this.playerList[args.index].name,
            cancelButtonText: "No",
            okButtonText: "Yes"
        }).then(function (r) {
            if (r) {
                self.playerList.splice(args.index, 1);
                UserFormViewModel.prototype.players.splice(args.index, 1);
            }
        });

    }


    return UserFormViewModel;
})(observable.Observable);

exports.userformViewModel = UserFormViewModel;
