var vmModule = require('./heartrate-view-model');
var orientationModule = require("nativescript-screen-orientation");
module.exports = {
    onNavigatingTo: function (args) {
        const page = args.object;
        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("portrait orientation set");
        });
        page.bindingContext = new vmModule.heartrateViewModel(args);
    }
}