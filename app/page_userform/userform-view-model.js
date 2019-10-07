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
    return UserFormViewModel;
})(observable.Observable);

exports.userformViewModel = UserFormViewModel;
