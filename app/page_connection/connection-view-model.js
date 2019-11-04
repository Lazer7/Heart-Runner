var observable = require("tns-core-modules/data/observable");
var observableArray = require("tns-core-modules/data/observable-array");
var dialogs = require("tns-core-modules/ui/dialogs");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();

var ConnectionViewModel = (function (_super) {
    __extends(ConnectionViewModel, _super);

    function ConnectionViewModel(args) {
        _super.call(this);
        ConnectionViewModel.prototype.playerList = args.object.navigationContext.playerList;
    }
    // Creates a Bluetooth Peripherals Observable Array Object 
    var observablePeripheralArray = new observableArray.ObservableArray();
    // Have the viewmodel listen onto obesrvable
    ConnectionViewModel.prototype.peripherals = observablePeripheralArray;
    ConnectionViewModel.prototype.players = [];

    ConnectionViewModel.prototype.doStopScanning = function () {
        var self = this;
        bluetooth.stopScanning().then(function () {
            self.set('isLoading', false);
        }, function (err) {
            dialogs.alert({
                title: "Bluetooth Error",
                message: err,
                okButtonText: "Ok"
            })
        })
    }
    ConnectionViewModel.prototype.doStartScanning = function () {
        var that = this;
        that.set('isLoading', true);
        // This reset the current peripheral array
        observablePeripheralArray.splice(0, observablePeripheralArray.length);
        bluetooth.startScanning({
            serviceUUIDs: [], // Pass an empty array to scan for all services
            seconds: 4, // Passing in seconds makes the plugin stop scanning after <number> seconds
            onDiscovered: function (peripheral) {
                // Variables to check if the device was already recorded in the list
                var duplicate = false;
                var selected = false;
                var duplicateIndex = -1;
                // Iterate through current list of peripherals to look for duplicates
                for (var numberOfDevices = 0; numberOfDevices < observablePeripheralArray.length; numberOfDevices++) {
                    if (observablePeripheralArray.getItem(numberOfDevices).UUID === peripheral.UUID) {
                        duplicate = true;
                        duplicateIndex = numberOfDevices;
                        break;
                    }
                }
                ConnectionViewModel.prototype.playerList.forEach(element => {
                    if (peripheral.UUID === element.peripheral.UUID) {
                        selected = true;
                    }
                })

                // If a duplicate was not found add it into the array or just update the value
                if (!duplicate && !selected) {
                    peripheral.RSSIvalue = ConnectionViewModel.prototype.getRSSI(peripheral.RSSI);
                    observablePeripheralArray.push(observable.fromObject(peripheral));
                } else if (!selected) {
                    peripheral.RSSIvalue = ConnectionViewModel.prototype.getRSSI(peripheral.RSSI);
                    observablePeripheralArray.setItem(duplicateIndex, observable.fromObject(peripheral))
                }

            }
        }).then(function () {
                that.set('isLoading', false);
            },
            function (err) {
                that.set('isLoading', false);
                dialogs.alert({
                    title: "Whoops!",
                    message: err,
                    okButtonText: "OK, got it"
                });
            });
    };
    ConnectionViewModel.prototype.doScanForHeartrateMontitor = function () {
        var that = this;
        that.set('isLoading', true);
        // This reset the current peripheral array
        observablePeripheralArray.splice(0, observablePeripheralArray.length);
        bluetooth.startScanning({
            serviceUUIDs: ['180d'], // pass an empty array to scan for all services
            seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
            onDiscovered: function (peripheral) {
                // Variables to check if the device was already recorded in the list
                var duplicate = false;
                var selected = false;
                var duplicateIndex = -1;
                // Iterate through current list of peripherals to look for duplicates
                for (var numberOfDevices = 0; numberOfDevices < observablePeripheralArray.length; numberOfDevices++) {
                    if (observablePeripheralArray.getItem(numberOfDevices).UUID === peripheral.UUID) {
                        duplicate = true;
                        duplicateIndex = numberOfDevices;
                        break;
                    }
                }
                ConnectionViewModel.prototype.playerList.forEach(element => {
                    if (peripheral.UUID === element.peripheral.UUID) {
                        selected = true;
                    }
                })
                // If a duplicate was not found add it into the array or just update the value
                // Also filters out for just Heart Zone Devices
                if ((!duplicate && !selected) && (peripheral.name !== null && peripheral.name.includes('RHYTHM'))) {
                    peripheral.RSSIvalue = ConnectionViewModel.prototype.getRSSI(peripheral.RSSI);
                    observablePeripheralArray.push(observable.fromObject(peripheral));
                } else if (!selected) {
                    peripheral.RSSIvalue = ConnectionViewModel.prototype.getRSSI(peripheral.RSSI);
                    observablePeripheralArray.setItem(duplicateIndex, observable.fromObject(peripheral))
                }
            }
        }).then(function () {
                that.set('isLoading', false);
            },
            function (err) {
                that.set('isLoading', false);
                dialogs.alert({
                    title: "Whoops!",
                    message: err,
                    okButtonText: "OK, got it"
                });
            });
    };
    ConnectionViewModel.prototype.getRSSI = function (RSSI) {
        if (RSSI >= -50) return "~/images/excellent.png";
        else if (RSSI >= -60) return "~/images/good.png";
        else if (RSSI >= -70) return "~/images/weak.png";
        else return "~/images/poor.png";
    };
    ConnectionViewModel.prototype.onPeripheralTap = function (args) {
        var index = args.index;
        var peri = ConnectionViewModel.prototype.peripherals.getItem(index);
        console.log("------ Peripheral selected: " + peri.UUID + " ------");
        const button = args.object;
        const page = button.page;
        ConnectionViewModel.prototype.doStopScanning();
        // Clear peripherals
        observablePeripheralArray.splice(0, observablePeripheralArray.length);
        var navigationEntry = {
            moduleName: "page_heartrate/heartrate-page",
            context: {
                peripheral: peri,
                playerList: ConnectionViewModel.prototype.playerList
            }
        }
        page.frame.navigate(navigationEntry);
    };
    return ConnectionViewModel;
})(observable.Observable);


exports.connectionViewModel = ConnectionViewModel;
