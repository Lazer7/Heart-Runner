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

    function HeartrateViewModel(args) {
        _super.call(this);
        this.title = "Heart Monitoring";
        this.peripheral = args.object.navigationContext.peripheral;
        this.page = args.object;

        HeartrateViewModel.prototype.heartrate.set("UUID", "UUID: " + this.peripheral.UUID)
        bluetooth.connect({
            UUID: this.peripheral.UUID,
            onConnected: function (peripheral) {
                console.log("Periperhal connected with UUID: " + peripheral.UUID);
                // // the peripheral object now has a list of available services:
                // peripheral.services.forEach(function (service) {
                //     console.log("service found: " + JSON.stringify(service));
                //     // if(service.UUID === "180d"){
                //     //     char = service.characteristics
                //     // }
                //     console.log("\n")
                // })
                console.log("UUID IS " + peripheral.UUID)
                bluetooth.startNotifying({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: '180d',
                    characteristicUUID: '2a37',
                    onNotify: function (result) {
                        // see the read example for how to decode ArrayBuffers
                        // console.log("read: " + JSON.stringify(result));
                        // console.log(result.value)
                        // console.log(result.value.toString())
                        var view = new Int8Array(result.value);
                        // console.log(view)

                        HeartrateViewModel.prototype.heartrate.set("HeartRate", "Heart Rate: " + view[1]);
                        HeartrateViewModel.prototype.heartrate.set("Signal", "Signal: " + view[2]);
                        HeartrateViewModel.prototype.heartrate.set("Other", "Other: " + view[3]);
                    }
                }).then((result) => {
                    console.log("HEY HEY")
                    console.log('subscribed for notification');
                })

            },
            onDisconnected: function (peripheral) {
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
            }
        })
    }
    return HeartrateViewModel;
})(observable.Observable);


exports.heartrateViewModel = HeartrateViewModel;
