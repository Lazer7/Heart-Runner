const observable = require("tns-core-modules/data/observable");
var dialogs = require("tns-core-modules/ui/dialogs");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();
var HomeViewModel = (function (_super) {
    __extends(HomeViewModel, _super);

    function HomeViewModel() {
        _super.call(this);
        this.title = "Heart Runner";
        HomeViewModel.prototype.checkBluetoothEnabled();
    }
    HomeViewModel.prototype.onConnect = function (args) {
        const button = args.object;
        const page = button.page;
        page.frame.navigate("page_userform/userform-page");
    }
    /**
     * Checks if the device's bluetooth is enabled
     */
    HomeViewModel.prototype.checkBluetoothEnabled = function () {
        bluetooth.isBluetoothEnabled().then(function (enabled) {
            if (!enabled) {
                dialogs.confirm({
                    title: "Bluetooth Not Enabled!",
                    message: "You need to enable bluetooth in order to run the application.",
                    okButtonText: "Enable"
                }).then((result) => {
                    bluetooth.enable().then(function (enabled) {
                        setTimeout(function () {
                            dialogs.alert({
                                message: "Bluetooth was " + (enabled ? "" : "not") + " enabled on this device.",
                                okButtonText: "Continue"
                            });
                        }, 500);
                    });
                })
            }
        });
    }

    return HomeViewModel;
})(observable.Observable);


exports.homeViewModel = new HomeViewModel();
