var vmModule = require('./heartrate-view-model');
var orientationModule = require("nativescript-screen-orientation");
module.exports = {
    onNavigatingTo: function (args) {
        const page = args.object;
        orientationModule.setCurrentOrientation("portrait");
        page.bindingContext = new vmModule.heartrateViewModel(args);
    }
}