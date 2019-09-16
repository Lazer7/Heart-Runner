var observable = require("tns-core-modules/data/observable");
var observableArray = require("tns-core-modules/data/observable-array");
var frameModule = require("tns-core-modules/ui/frame");
var dialogs = require("tns-core-modules/ui/dialogs");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();

var HeartrateViewModel = (function (_super) {
    __extends(HeartrateViewModel, _super);
    HeartrateViewModel.prototype.heartrate = new observable.Observable();
    HeartrateViewModel.prototype.data = new observable.Observable();

    function HeartrateViewModel(args) {
        _super.call(this);
        this.title = "Heart Monitoring";
        this.peripheral = args.object.navigationContext.peripheral;
        this.page = args.object;
        HeartrateViewModel.prototype.data.set("name", "");
        HeartrateViewModel.prototype.data.set("age", "");
        HeartrateViewModel.prototype.data.set("maxHeartRate", "Maximum Heart Rate: 0");
        HeartrateViewModel.prototype.data.set("baseLine", "Base Line Heart Rate: 0");
        HeartrateViewModel.prototype.data.set("easy", "Easy Work Out (Red): 0");
        HeartrateViewModel.prototype.data.set("medium", "Moderate Work Out (Yellow): 0");
        HeartrateViewModel.prototype.data.set("hard", "Intense Work Out (Green): 0");
        HeartrateViewModel.prototype.data.set("danger", "Out of Range (White): 0");
        HeartrateViewModel.prototype.data.addEventListener(observable.Observable.propertyChangeEvent, (args) => {
            if (args.propertyName === 'age') {
                var value = 0;
                if (parseInt(args.value, 10) >= 17) {
                    var value = 220 - parseInt(args.value, 10);
                } else {
                    var value = 208 - (0.7 * parseFloat(args.value))
                }

                HeartrateViewModel.prototype.data.set("maxHeartRate", "Maximum Heart Rate: " + value);
                HeartrateViewModel.prototype.data.set("easy", "Easy Work Out (Red): " + Number.parseFloat(value * 0.59).toPrecision(4));
                HeartrateViewModel.prototype.data.set("medium", "Moderate Work Out (Yellow): " + Number.parseFloat(value * 0.69).toPrecision(4));
                HeartrateViewModel.prototype.data.set("hard", "Intense Work Out (Green): " + Number.parseFloat(value * 0.89).toPrecision(4));
                HeartrateViewModel.prototype.data.set("danger", "Out of Range (White): " + Number.parseFloat(value * 0.9).toPrecision(4));
            }
        });

        HeartrateViewModel.prototype.heartrate.set("UUID", "UUID: " + this.peripheral.UUID)
        bluetooth.connect({
            UUID: this.peripheral.UUID,
            onConnected: function (peripheral) {
                bluetooth.startNotifying({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: '180d',
                    characteristicUUID: '2a37',
                    onNotify: function (result) {
                        // The <result> variable is a ArrayBuffer containing 4 bytes
                        // Byte 1: Header data
                        // Byte 2: Heart Rate Data
                        // Byte 3: Signal Strength
                        // Byte 4: Other Data
                        // Convert data into raw integer values
                        var view = new Int8Array(result.value);
                        // Update the UI values
                        HeartrateViewModel.prototype.heartrate.set("HeartRate", "Heart Rate: " + view[1]);
                        HeartrateViewModel.prototype.heartrate.set("Signal", "Signal: " + view[2]);
                        HeartrateViewModel.prototype.heartrate.set("Other", "Other: " + view[3]);
                    }
                });
            },
            onDisconnected: function (peripheral) {
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
            }
        })
    }
    return HeartrateViewModel;
})(observable.Observable);


exports.heartrateViewModel = HeartrateViewModel;
