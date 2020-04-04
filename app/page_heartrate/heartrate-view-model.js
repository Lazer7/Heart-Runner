var observable = require("tns-core-modules/data/observable");
var dialogs = require("tns-core-modules/ui/dialogs");
var camera = require("nativescript-camera");
var imageModule = require("tns-core-modules/ui/image");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();

var HeartrateViewModel = (function (_super) {
    __extends(HeartrateViewModel, _super);
    HeartrateViewModel.prototype.heartrate = new observable.Observable();
    HeartrateViewModel.prototype.data = new observable.Observable();
    HeartrateViewModel.prototype.selectedImage = 0;

    function HeartrateViewModel(args) {
        _super.call(this);
        this.title = "Heart Monitoring";
        this.currentImage = args.object.getViewById('image4');
        this.peripheral = args.object.navigationContext.peripheral;
        this.playerList = args.object.navigationContext.playerList;
        this.page = args.object;
        this.currentImage.addCss(`#image4 {visibility: collapse;}`);
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
                HeartrateViewModel.prototype.data.set("max", value);
                HeartrateViewModel.prototype.data.set("maxHeartRate", "Maximum Heart Rate: " + value);
                HeartrateViewModel.prototype.data.set("easy", "Easy Work Out (Red): " + Number.parseFloat(value * 0.59).toPrecision(4));
                HeartrateViewModel.prototype.data.set("medium", "Moderate Work Out (Yellow): " + Number.parseFloat(value * 0.69).toPrecision(4));
                HeartrateViewModel.prototype.data.set("hard", "Intense Work Out (Green): " + Number.parseFloat(value * 0.79).toPrecision(4));
                HeartrateViewModel.prototype.data.set("danger", "Out of Range (White): " + Number.parseFloat(value * 0.9).toPrecision(4));
            }
        });
        HeartrateViewModel.prototype.heartrate.set("UUID", "Device: " + this.peripheral.UUID)
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
                        var view = new Uint8Array(result.value);
                        // Update the UI values
                        HeartrateViewModel.prototype.heartrate.set("HeartRate", "Heart Rate: " + Math.abs(view[1]));
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
    HeartrateViewModel.prototype.takePicture = function (args) {
        var self = this;
        camera.requestPermissions().then(
            function success() {
                // permission request accepted or already granted 
                // ... call camera.takePicture here ...
                camera.takePicture()
                    .then(function (imageAsset) {
                        self.currentImage.addCss(`#image4 {visibility:visible;}`);
                        self.currentImage.src = imageAsset;
                        HeartrateViewModel.prototype.data.set("imageUri", imageAsset);
                    }).catch(function (err) {
                        console.log("Error -> " + err.message);
                    });
            },
            function failure() {
                // permission request rejected
                console.log("ERROR")
            }
        );
    }
    HeartrateViewModel.prototype.select = function (args) {
        var page = args.object.page;
        page.addCss(`#image1 {border-style: none; border-width: 0px;}`);
        page.addCss(`#image2 {border-style: none; border-width: 0px;}`);
        page.addCss(`#image3 {border-style: none; border-width: 0px;}`);
        page.addCss(`#image4 {border-style: none; border-width: 0px;}`);
        page.addCss(`#image${args.object.value}{ 
            border-style: solid;
            border-width: 10px;
            border-color: #FF0000;}`);
        HeartrateViewModel.prototype.selectedImage = args.object.value
    }
    HeartrateViewModel.prototype.visualization = function (args) {
        const button = args.object;
        const page = button.page;

        var name = HeartrateViewModel.prototype.data.get("name")
        var age = HeartrateViewModel.prototype.data.get("age");
        if (name !== "" && age !== "" && HeartrateViewModel.prototype.selectedImage !== 0) {
            bluetooth.disconnect({
                UUID: this.peripheral.UUID
            }).then(function () {
                console.log("disconnected successfully");
            }, function (err) {
                // in this case you're probably best off treating this as a disconnected peripheral though
                console.log("disconnection error: " + err);
            });
            var player = {
                name: name,
                age: age,
                max: HeartrateViewModel.prototype.data.get("max"),
                image: HeartrateViewModel.prototype.getSelectedImage(),
                peripheral: this.peripheral
            }
            this.playerList.push(player);
            var navigationEntry = {
                moduleName: "page_userform/userform-page",
                context: {
                    peripheral: this.peripheral,
                    playerList: this.playerList
                }
            }
            page.frame.navigate(navigationEntry);
        } else {
            dialogs.alert({
                title: "Error",
                message: "You need to fill out both name and age, or select and image!"
            })

        }
    }
    HeartrateViewModel.prototype.getSelectedImage = function () {
        switch (HeartrateViewModel.prototype.selectedImage) {
            case "1":
                console.log("1")
                return "~/images/hero.jpg";
            case "2":
                console.log("2")
                return "~/images/dino.jpg";
            case "3":
                console.log("3")
                return "~/images/train.jpg";
            case "4":
                console.log("4")
                return HeartrateViewModel.prototype.data.get("imageUri");
        }
    }
    HeartrateViewModel.prototype.translateHeartRateValue = function (arg) {
        // 60 8,60,0,0
        // 61 8,61,0,0
        // 62
    }

    return HeartrateViewModel;
})(observable.Observable);


exports.heartrateViewModel = HeartrateViewModel;
