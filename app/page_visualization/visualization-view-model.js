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

var VisualizationViewModel = (function (_super) {
    __extends(VisualizationViewModel, _super);
    VisualizationViewModel.prototype.players = [];
    VisualizationViewModel.prototype.displacement = 0;

    function VisualizationViewModel(args) {
        _super.call(this);

        this.playerList = args.object.navigationContext.playerList
        VisualizationViewModel.prototype.players.push(args.object.getViewById('player1'));
        VisualizationViewModel.prototype.players.push(args.object.getViewById('player2'));
        VisualizationViewModel.prototype.players.push(args.object.getViewById('player3'));
        VisualizationViewModel.prototype.players.push(args.object.getViewById('player4'));
        var mountain = args.object.getViewById("mountain")
        // 1080 x 1920 

        mountain.addCss("#mountain {height:" + platformModule.screen.mainScreen.heightPixels + "px; width: 100%;}")
        VisualizationViewModel.prototype.displacement = platformModule.screen.mainScreen.heightPixels / 4;
        console.log(VisualizationViewModel.prototype.displacement);
        console.log(platformModule.screen.mainScreen.heightPixels);
        console.log(platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement)
        console.log("Compiled");
        VisualizationViewModel.prototype.players[0].addCss("#player1 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement) + "px;}");
        VisualizationViewModel.prototype.players[1].addCss("#player2 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement) + "px;}");
        VisualizationViewModel.prototype.players[2].addCss("#player3 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement) + "px;}");
        VisualizationViewModel.prototype.players[3].addCss("#player4 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement) + "px;}");
        if (this.playerList[0])
            bluetooth.connect({
                UUID: this.playerList[0].peripheral.UUID,
                onConnected: function (peripheral) {
                    bluetooth.startNotifying({
                        peripheralUUID: peripheral.UUID,
                        serviceUUID: '180d',
                        characteristicUUID: '2a37',
                        onNotify: function (result) {
                            var view = new Int8Array(result.value);
                            VisualizationViewModel.prototype.players[0].addCss("#player1 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement - view[1]) + "px;}");
                            console.log("#player1 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement - view[1]) + "px;}");
                        }
                    });
                },
                onDisconnected: function (peripheral) {
                    console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
                }
            })
        if (this.playerList[1])
            bluetooth.connect({
                UUID: this.playerList[1].peripheral.UUID,
                onConnected: function (peripheral) {
                    bluetooth.startNotifying({
                        peripheralUUID: peripheral.UUID,
                        serviceUUID: '180d',
                        characteristicUUID: '2a37',
                        onNotify: function (result) {
                            var view = new Int8Array(result.value);
                            VisualizationViewModel.prototype.players[1].addCss("#player2 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement - view[1]) + "px;}");
                            console.log("#player2 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement - view[1]) + "px;}");
                        }
                    });
                },
                onDisconnected: function (peripheral) {
                    console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
                }
            })
        if (this.playerList[2])
            bluetooth.connect({
                UUID: this.playerList[2].peripheral.UUID,
                onConnected: function (peripheral) {
                    bluetooth.startNotifying({
                        peripheralUUID: peripheral.UUID,
                        serviceUUID: '180d',
                        characteristicUUID: '2a37',
                        onNotify: function (result) {
                            var view = new Int8Array(result.value);
                            VisualizationViewModel.prototype.players[2].addCss("#player3 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement - view[1]) + "px;}");
                            console.log("#player3 { top:" + (platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement - view[1]) + "px;}");
                        }
                    });
                },
                onDisconnected: function (peripheral) {
                    console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
                }
            })

        // id = timerModule.setInterval(() => {
        //     var max = 1000;
        //     var min = 0;
        //     var rand1 = Math.random() * (+max - +min) + +min;
        //     var rand2 = Math.random() * (+max - +min) + +min;
        //     var rand3 = Math.random() * (+max - +min) + +min;
        //     var rand4 = Math.random() * (+max - +min) + +min;
        //     // console.log(rand1);
        //     // console.log(rand2);
        //     // console.log(rand3);
        //     // console.log(rand4);
        //     this.players[0].addCss("#player1 { top:" + (rand1) + "px;}");
        //     this.players[1].addCss("#player2 { top:" + (rand2) + "px;}");
        //     this.players[2].addCss("#player3 { top:" + (rand3) + "px;}");
        //     this.players[3].addCss("#player4 { top:" + (rand4) + "px;}");
        // }, 1000);

    }

    VisualizationViewModel.prototype.getDimension = function (args) {
        console.log("HEIGHT" + platformModule.screen.mainScreen.heightPixels);
        console.log("WIDTH " + platformModule.screen.mainScreen.widthPixels);
    }

    return VisualizationViewModel;
})(observable.Observable);

exports.visualizationViewModel = VisualizationViewModel;
