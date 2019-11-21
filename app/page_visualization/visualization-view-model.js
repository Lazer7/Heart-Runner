var observable = require("tns-core-modules/data/observable");
const platformModule = require("tns-core-modules/platform");
var orientationModule = require("nativescript-screen-orientation");
const timerModule = require("tns-core-modules/timer");
var dialogs = require("tns-core-modules/ui/dialogs");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();

var VisualizationViewModel = (function (_super) {
    __extends(VisualizationViewModel, _super);
    VisualizationViewModel.prototype.players = [];
    VisualizationViewModel.prototype.displacement = 0;
    VisualizationViewModel.prototype.timer = undefined;
    VisualizationViewModel.prototype.data = new observable.Observable();

    function VisualizationViewModel(args) {
        _super.call(this);
        orientationModule.setCurrentOrientation("landscape");
        VisualizationViewModel.prototype.players = args.object.navigationContext.playerList;
        VisualizationViewModel.prototype.data.set("minuteValue", args.object.navigationContext.timer);
        VisualizationViewModel.prototype.data.set("secondValue", 0);
        VisualizationViewModel.prototype.data.set("timer", VisualizationViewModel.prototype.data.get("minuteValue") + ":00");
        VisualizationViewModel.prototype.data.set("timeValue", VisualizationViewModel.prototype.data.get("minuteValue") * 60);
        VisualizationViewModel.prototype.data.set("totalSecondsPassed", 0);
        VisualizationViewModel.prototype.data.set("progress", 0);
        VisualizationViewModel.prototype.players.forEach((element) => {
            element.heartRate = [];
            element.stars = [];
            element.greenStar = 0; // Green star second holder 10 seconds to earn
            element.redStar = 0; // Red star second holder 30 seconds to earn
            element.yellowStar = 0; // Yellow star second holder 20 seconds to earn
            element.currentStar = 1;
        })
        timerModule.clearInterval(VisualizationViewModel.prototype.timer);
        for (var i = 0; i < VisualizationViewModel.prototype.players.length; i++) {
            var currentPlayer = args.object.getViewById('player' + (i + 1));
            currentPlayer.src = VisualizationViewModel.prototype.players[i].image;
            VisualizationViewModel.prototype.data.set("playerName" + (i + 1), VisualizationViewModel.prototype.players[i].name.substring(0, 10));
            VisualizationViewModel.prototype.data.set("heartrate" + (i + 1), "HR: --");
        }
    }

    VisualizationViewModel.prototype.startVisualization = function (args) {
        // Getting Frame Object
        var page = args.object.page;
        // Setting the displacement to 1/4 of screen size
        VisualizationViewModel.prototype.displacement = platformModule.screen.mainScreen.heightPixels / 4;
        // Properly Scale the Mountain
        page.addCss("#mountain {height:" + platformModule.screen.mainScreen.heightPixels + "px; width:" + platformModule.screen.mainScreen.widthPixels + "px;}")
        // Hide Start Button Command
        page.addCss("#start {visibility: collapse;}")
        // Iterate through all registered players
        for (var i = 0; i < VisualizationViewModel.prototype.players.length; i++) {
            page.addCss(`#player${i+1}{ top:${platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement -50}px; 
                                        opacity:1; 
                                        height:${VisualizationViewModel.prototype.displacement}px; 
                                        width:${VisualizationViewModel.prototype.displacement}px;}`);
            page.addCss(`#player${i+1}Name{ top:${platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement -150}px; 
                                        opacity:1;}`);
            page.addCss(`#player${i+1}HB{ top:${platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement -200}px; 
                                        opacity:1;}`);

            page.addCss(`#player${i+1}star1{ top:${platformModule.screen.mainScreen.heightPixels - 175 }px; 
                                        opacity:0; z-index:1;}`);
            page.addCss(`#player${i+1}star2{ top:${platformModule.screen.mainScreen.heightPixels - 175 }px; 
                                        opacity:0; z-index:1;}`);
            page.addCss(`#player${i+1}star3{ top:${platformModule.screen.mainScreen.heightPixels - 175 }px; 
                                        opacity:0; z-index:1;}`);
        }
        // Begin to connect each device individually
        VisualizationViewModel.prototype.connectDevice(VisualizationViewModel.prototype.players.length - 1, page)
        timerModule.clearInterval(VisualizationViewModel.prototype.timer);
        VisualizationViewModel.prototype.timer = timerModule.setInterval(() => {
            if (VisualizationViewModel.prototype.data.get("secondValue") === 0) {
                VisualizationViewModel.prototype.data.set("minuteValue", (VisualizationViewModel.prototype.data.get("minuteValue") - 1));
                if (VisualizationViewModel.prototype.data.get("minuteValue") === -1) {
                    VisualizationViewModel.prototype.data.set("timer", "0:00");
                    // Code to end session
                    timerModule.clearInterval(VisualizationViewModel.prototype.timer);
                    VisualizationViewModel.prototype.players.forEach((user) => {
                        bluetooth.disconnect({
                            UUID: user.peripheral.UUID
                        })
                    });
                    dialogs.alert({
                        title: "Exercise Complete!",
                        message: "Congratulation you have completed the exercise session!",
                        okButtonText: "Nice!"
                    }).then(function () {
                        // Onwards to summary screen
                        const page = args.object.page;
                        var navigationEntry = {
                            moduleName: "page_summary/summary-page",
                            context: {
                                playerList: VisualizationViewModel.prototype.players
                            }
                        }
                        page.frame.navigate(navigationEntry);
                    });
                } else {
                    VisualizationViewModel.prototype.data.set("secondValue", 59);
                }
            } else {
                VisualizationViewModel.prototype.data.set("secondValue", (VisualizationViewModel.prototype.data.get("secondValue") - 1));
            }
            VisualizationViewModel.prototype.data.set("totalSecondsPassed", VisualizationViewModel.prototype.data.get("totalSecondsPassed")+1);
            if (VisualizationViewModel.prototype.data.get("minuteValue") !== -1) {
                var minute = minute = VisualizationViewModel.prototype.data.get("minuteValue") + ":"
                var zeroPlaceholderS = VisualizationViewModel.prototype.data.get("secondValue") < 10 ? "0" : "";
                var seconds = zeroPlaceholderS + VisualizationViewModel.prototype.data.get("secondValue") + "";
                var progress = (VisualizationViewModel.prototype.data.get("timeValue") - VisualizationViewModel.prototype.data.get("totalSecondsPassed")) / VisualizationViewModel.prototype.data.get("timeValue");
                VisualizationViewModel.prototype.data.set("timer", minute + seconds);
                VisualizationViewModel.prototype.data.set("progress", progress*100);
            }
        }, 1000);
    }

    VisualizationViewModel.prototype.connectDevice = function (i, page) {
        const actualDisplacement = platformModule.screen.mainScreen.heightPixels - VisualizationViewModel.prototype.displacement;
        bluetooth.connect({
            UUID: VisualizationViewModel.prototype.players[i].peripheral.UUID,
            onConnected: function (peripheral) {
                bluetooth.startNotifying({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: '180d',
                    characteristicUUID: '2a37',
                    onNotify: function (result) {
                        var view = new Int8Array(result.value);
                        var heartDisplacement = (VisualizationViewModel.prototype.players[i].max - (VisualizationViewModel.prototype.players[i].max * .7))
                        var ratioDisplacement = actualDisplacement / heartDisplacement;
                        VisualizationViewModel.prototype.data.set("heartrate" + (i + 1), "HR: " + view[1] + " bpm");
                        VisualizationViewModel.prototype.players[i].heartRate.push({
                            time: new Date(),
                            heartRate: view[1]
                        })
                        var red = Number.parseFloat((VisualizationViewModel.prototype.players[i].max) * 0.70).toPrecision(4);
                        var yellow = Number.parseFloat((VisualizationViewModel.prototype.players[i].max) * 0.80).toPrecision(4);
                        var green = Number.parseFloat((VisualizationViewModel.prototype.players[i].max) * 0.90).toPrecision(4);

                        // stars            
                        if (view[1] < red) {
                            VisualizationViewModel.prototype.players[i].redStar++;
                            VisualizationViewModel.prototype.players[i].yellowStar = 0;
                            VisualizationViewModel.prototype.players[i].greenStar = 0;
                            if (VisualizationViewModel.prototype.players[i].redStar === 30) {
                                VisualizationViewModel.prototype.players[i].redStar = 0;
                                page.addCss(`#player${i+1}star${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:red;}`);
                                VisualizationViewModel.prototype.players[i].currentStar = VisualizationViewModel.prototype.players[i].currentStar + 1;
                                VisualizationViewModel.prototype.players[i].stars.push({
                                    star: "Red",
                                    time: new Date()
                                });
                            }
                        } else if (view[1] < yellow) {
                            VisualizationViewModel.prototype.players[i].redStar = 0;
                            VisualizationViewModel.prototype.players[i].yellowStar++;
                            VisualizationViewModel.prototype.players[i].greenStar = 0;
                            if (VisualizationViewModel.prototype.players[i].yellowStar === 20) {
                                VisualizationViewModel.prototype.players[i].yellowStar = 0;
                                page.addCss(`#player${i+1}star${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:yellow}`);
                                VisualizationViewModel.prototype.players[i].currentStar = VisualizationViewModel.prototype.players[i].currentStar + 1;
                                VisualizationViewModel.prototype.players[i].stars.push({
                                    star: "Yellow",
                                    time: new Date()
                                });
                            }
                        } else if (view[1] < green) {
                            VisualizationViewModel.prototype.players[i].redStar = 0;
                            VisualizationViewModel.prototype.players[i].yellowStar = 0;
                            VisualizationViewModel.prototype.players[i].greenStar++;
                            if (VisualizationViewModel.prototype.players[i].greenStar === 10) {
                                VisualizationViewModel.prototype.players[i].greenStar = 0;
                                page.addCss(`#player${i+1}star${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:green}`);
                                VisualizationViewModel.prototype.players[i].currentStar = VisualizationViewModel.prototype.players[i].currentStar + 1;
                                VisualizationViewModel.prototype.players[i].stars.push({
                                    star: "Green",
                                    time: new Date()
                                });
                            }
                        }
                        // Used for the visualization to keep track on which star to update
                        if (VisualizationViewModel.prototype.players[i].currentStar === 4) {
                            VisualizationViewModel.prototype.players[i].currentStar = 1;
                        }
                        if (view[1] > (VisualizationViewModel.prototype.players[i].max * 0.7)) {
                            page.addCss("#player" + (i + 1) + "{ top:" + ((ratioDisplacement * (VisualizationViewModel.prototype.players[i].max - view[1])) - 50) + "px;}");
                            page.addCss(`#player${i+1}Name{ top:${((ratioDisplacement * (VisualizationViewModel.prototype.players [i].max - view[1])) - 150)}px;}`);
                            page.addCss(`#player${i+1}HB{ top:${((ratioDisplacement * (VisualizationViewModel.prototype.players [i].max - view[1])) - 200)}px;}`)
                            console.log("#player" + (i + 1) + " { top:" + ((ratioDisplacement * (VisualizationViewModel.prototype.players[i].max - view[1])) - 50) + "px;}" + " CURRENT HEART RATE: " + view[1]);
                            console.log(`#player${i+1}Name{ top:${((ratioDisplacement * (VisualizationViewModel.prototype.players [i].max - view[1])) -150)}px;}`);
                        } else {
                            console.log("Heart Displacement" + ((ratioDisplacement * (VisualizationViewModel.prototype.players[i].max - view[1])) - 50));
                            console.log("Heart rate not high enough! Heart Rate: " + view[1]);
                        }
                    }
                });
            },
            onDisconnected: function (peripheral) {
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
            }
        });
        // Connect to the next device in the VisualizationViewModel.prototype.players 
        if (i > 0)
            VisualizationViewModel.prototype.connectDevice(i - 1, page);
    }

    return VisualizationViewModel;
})(observable.Observable);

exports.visualizationViewModel = VisualizationViewModel;
