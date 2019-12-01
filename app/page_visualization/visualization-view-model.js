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
    VisualizationViewModel.prototype.startRecording = false;
    VisualizationViewModel.prototype.timer = undefined;
    // UI data binding
    VisualizationViewModel.prototype.data = new observable.Observable();

    function VisualizationViewModel(args) {
        _super.call(this);
        orientationModule.setCurrentOrientation("landscape");
        // Initializing Observable Data
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
        // Resetting timer 
        VisualizationViewModel.prototype.startRecording = false;
        timerModule.clearInterval(VisualizationViewModel.prototype.timer);
        // Setting Name and Inital Heart Rate Value over avatar
        for (var i = 0; i < VisualizationViewModel.prototype.players.length; i++) {
            var currentPlayer = args.object.getViewById('player' + (i + 1));
            currentPlayer.src = VisualizationViewModel.prototype.players[i].image;
            VisualizationViewModel.prototype.data.set("playerName" + (i + 1), VisualizationViewModel.prototype.players[i].name.substring(0, 10));
            VisualizationViewModel.prototype.data.set("heartrate" + (i + 1), "HR: --");
        }
    }
    VisualizationViewModel.prototype.back = function (args) {
        const button = args.object;
        const page = button.page;
        timerModule.clearInterval(VisualizationViewModel.prototype.timer);
        VisualizationViewModel.prototype.players.forEach((user) => {
            bluetooth.disconnect({
                UUID: user.peripheral.UUID
            })
        })
        var navigationEntry = {
            moduleName: "page_userform/userform-page",
            context: {
                playerList: VisualizationViewModel.prototype.players
            }
        }
        page.frame.navigate(navigationEntry);
    }
    VisualizationViewModel.prototype.stop = function (args) {
        const button = args.object;
        const page = button.page;
        timerModule.clearInterval(VisualizationViewModel.prototype.timer);
        VisualizationViewModel.prototype.players.forEach((user) => {
            bluetooth.disconnect({
                UUID: user.peripheral.UUID
            })
        })
        var navigationEntry = {
            moduleName: "page_summary/summary-page",
            context: {
                playerList: VisualizationViewModel.prototype.players
            }
        }
        page.frame.navigate(navigationEntry);
    }
    VisualizationViewModel.prototype.resync = function (args) {
        console.log("Resyncing!!!");
        var page = args.object.page;
        VisualizationViewModel.prototype.connectDevice(VisualizationViewModel.prototype.players.length - 1, page)
    }
    VisualizationViewModel.prototype.start = function (args) {
        // Getting Frame Object
        var page = args.object.page;
        VisualizationViewModel.prototype.startRecording = true;
        timerModule.clearInterval(VisualizationViewModel.prototype.timer);
        page.addCss(`#startbutton {visibility: hidden;}`);
        page.addCss(`#stopbutton {visibility: visible;}`);
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
            VisualizationViewModel.prototype.data.set("totalSecondsPassed", VisualizationViewModel.prototype.data.get("totalSecondsPassed") + 1);
            if (VisualizationViewModel.prototype.data.get("minuteValue") !== -1) {
                var minute = minute = VisualizationViewModel.prototype.data.get("minuteValue") + ":"
                var zeroPlaceholderS = VisualizationViewModel.prototype.data.get("secondValue") < 10 ? "0" : "";
                var seconds = zeroPlaceholderS + VisualizationViewModel.prototype.data.get("secondValue") + "";
                var progress = (VisualizationViewModel.prototype.data.get("timeValue") - VisualizationViewModel.prototype.data.get("totalSecondsPassed")) / VisualizationViewModel.prototype.data.get("timeValue");
                VisualizationViewModel.prototype.data.set("timer", minute + seconds);
                VisualizationViewModel.prototype.data.set("progress", progress * 100);
            }
        }, 1000);
    }
    VisualizationViewModel.prototype.startClimbing = function (args) {
        // Getting Frame Object
        var page = args.object.page;
        // Setting the displacement to 1/4 of screen size
        VisualizationViewModel.prototype.displacement = platformModule.screen.mainScreen.heightPixels / 4;
        // Properly Scale the Mountain
        page.addCss("#mountain {height:" + platformModule.screen.mainScreen.heightPixels + "px; width:" + platformModule.screen.mainScreen.widthPixels + "px;}")
        // Hide Start Button Command
        page.addCss(`#start {visibility: collapse;}`)
        // Iterate through all registered players
        for (var i = 0; i < VisualizationViewModel.prototype.players.length; i++) {
            page.addCss(`#player${i+1}{ top:${platformModule.screen.mainScreen.heightPixels - (VisualizationViewModel.prototype.displacement/2) -50}px; 
                                        opacity:1; 
                                        height:${(VisualizationViewModel.prototype.displacement/2)}px; 
                                        width:${(VisualizationViewModel.prototype.displacement/2)}px;}`);
            page.addCss(`#player${i+1}Name{ top:${platformModule.screen.mainScreen.heightPixels - (VisualizationViewModel.prototype.displacement/2) -150}px; 
                                        opacity:1;}`);
            page.addCss(`#player${i+1}HB{ top:${platformModule.screen.mainScreen.heightPixels - (VisualizationViewModel.prototype.displacement/2) -200}px; 
                                        opacity:1;}`);

            page.addCss(`#player${i+1}star1{ top:${platformModule.screen.mainScreen.heightPixels - 175 }px; 
                                        opacity:0; z-index:2;}`);
            page.addCss(`#player${i+1}star2{ top:${platformModule.screen.mainScreen.heightPixels - 175 }px; 
                                        opacity:0; z-index:2;}`);
            page.addCss(`#player${i+1}star3{ top:${platformModule.screen.mainScreen.heightPixels - 175 }px; 
                                        opacity:0; z-index:2;}`);
            page.addCss(`#player${i+1}back1{ top:${platformModule.screen.mainScreen.heightPixels - 200 }px; opacity:0; color:black; z-index:1;}`);
            page.addCss(`#player${i+1}back2{ top:${platformModule.screen.mainScreen.heightPixels - 200 }px; opacity:0; color:black; z-index:1;}`);
            page.addCss(`#player${i+1}back3{ top:${platformModule.screen.mainScreen.heightPixels - 200 }px; opacity:0; color:black; z-index:1;}`);
        }
        // Show "debugging" buttons
        page.addCss(`#optionbutton, #startbutton {visibility: visible;}`);
        // Begin to connect each device individually
        VisualizationViewModel.prototype.connectDevice(VisualizationViewModel.prototype.players.length - 1, page)
    }
    // Helper Methods 
    VisualizationViewModel.prototype.connectDevice = function (i, page) {
        const actualDisplacement = platformModule.screen.mainScreen.heightPixels - (VisualizationViewModel.prototype.displacement / 2);
        bluetooth.connect({
            UUID: VisualizationViewModel.prototype.players[i].peripheral.UUID,
            onConnected: function (peripheral) {
                bluetooth.startNotifying({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: '180d',
                    characteristicUUID: '2a37',
                    onNotify: function (result) {
                        var view = new Int8Array(result.value);
                        var heartDisplacement = (VisualizationViewModel.prototype.players[i].max - (VisualizationViewModel.prototype.players[i].max * .5))
                        var ratioDisplacement = actualDisplacement / heartDisplacement;
                        var heartRateValue = Math.abs(view[1]);

                        VisualizationViewModel.prototype.data.set("heartrate" + (i + 1), "HR: " + heartRateValue + " bpm");
                        if (VisualizationViewModel.prototype.startRecording) {
                            // Record Heart Rate Value
                            VisualizationViewModel.prototype.players[i].heartRate.push({
                                time: new Date(),
                                heartRate: heartRateValue
                            })
                            // Record Star
                            var red = Number.parseFloat((VisualizationViewModel.prototype.players[i].max) * 0.60).toPrecision(4);
                            var yellow = Number.parseFloat((VisualizationViewModel.prototype.players[i].max) * 0.70).toPrecision(4);
                            var green = Number.parseFloat((VisualizationViewModel.prototype.players[i].max) * 0.80).toPrecision(4);
                            // stars            
                            if (heartRateValue < red) {
                                VisualizationViewModel.prototype.players[i].redStar++;
                                VisualizationViewModel.prototype.players[i].yellowStar = 0;
                                VisualizationViewModel.prototype.players[i].greenStar = 0;
                                // change back to 30
                                if (VisualizationViewModel.prototype.players[i].redStar === 30) {
                                    VisualizationViewModel.prototype.players[i].redStar = 0;
                                    page.addCss(`#player${i+1}star${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:red;}`);
                                    page.addCss(`#player${i+1}back${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:black;}`);
                                    VisualizationViewModel.prototype.players[i].currentStar = VisualizationViewModel.prototype.players[i].currentStar + 1;
                                    VisualizationViewModel.prototype.players[i].stars.push({
                                        star: "Red",
                                        time: new Date()
                                    });
                                }
                            } else if (heartRateValue < yellow) {
                                VisualizationViewModel.prototype.players[i].redStar = 0;
                                VisualizationViewModel.prototype.players[i].yellowStar++;
                                VisualizationViewModel.prototype.players[i].greenStar = 0;
                                // change back to 20
                                if (VisualizationViewModel.prototype.players[i].yellowStar === 20) {
                                    VisualizationViewModel.prototype.players[i].yellowStar = 0;
                                    page.addCss(`#player${i+1}star${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:yellow}`);
                                    page.addCss(`#player${i+1}back${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:black;}`);
                                    VisualizationViewModel.prototype.players[i].currentStar = VisualizationViewModel.prototype.players[i].currentStar + 1;
                                    VisualizationViewModel.prototype.players[i].stars.push({
                                        star: "Yellow",
                                        time: new Date()
                                    });
                                }
                            } else if (heartRateValue < green) {
                                VisualizationViewModel.prototype.players[i].redStar = 0;
                                VisualizationViewModel.prototype.players[i].yellowStar = 0;
                                VisualizationViewModel.prototype.players[i].greenStar++;
                                // change back to 10
                                if (VisualizationViewModel.prototype.players[i].greenStar === 10) {
                                    VisualizationViewModel.prototype.players[i].greenStar = 0;
                                    page.addCss(`#player${i+1}star${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:green}`);
                                    page.addCss(`#player${i+1}back${VisualizationViewModel.prototype.players[i].currentStar}{ opacity:1; color:black;}`);
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
                        }

                        if (heartRateValue > (VisualizationViewModel.prototype.players[i].max * 0.5)) {
                            page.addCss("#player" + (i + 1) + "{ top:" + ((ratioDisplacement * (VisualizationViewModel.prototype.players[i].max - heartRateValue)) - 50) + "px;}");
                            page.addCss(`#player${i+1}Name{ top:${((ratioDisplacement * (VisualizationViewModel.prototype.players [i].max - heartRateValue)) - 150)}px;}`);
                            page.addCss(`#player${i+1}HB{ top:${((ratioDisplacement * (VisualizationViewModel.prototype.players [i].max - heartRateValue)) - 200)}px;}`)

                            //console.log("#player" + (i + 1) + " { top:" + ((ratioDisplacement * (VisualizationViewModel.prototype.players[i].max - heartRateValue)) - 50) + "px;}" + " CURRENT HEART RATE: " + heartRateValue);
                            //console.log(`#player${i+1}Name{ top:${((ratioDisplacement * (VisualizationViewModel.prototype.players [i].max - heartRateValue)) -150)}px;}`);
                        } else {
                            page.addCss(`#player${i+1}{ top:${actualDisplacement -50}px;}`);
                            page.addCss(`#player${i+1}Name{ top:${actualDisplacement -150}px;}`);
                            page.addCss(`#player${i+1}HB{ top:${actualDisplacement -200}px; }`);
                            //console.log("Heart Displacement" + ((ratioDisplacement * (VisualizationViewModel.prototype.players[i].max - heartRateValue)) - 50));
                            //console.log("Heart rate not high enough! Heart Rate: " + heartRateValue);
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
