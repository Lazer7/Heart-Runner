var vmModel = require('./visualization-view-model');
var orientationModule = require("nativescript-screen-orientation");

module.exports = {
    onNavigatingTo: function (args) {
        orientationModule.setCurrentOrientation("landscape", function () {
            console.log("landscape orientation set");
        });
        const page = args.object;
        page.bindingContext = new vmModel.visualizationViewModel(args);
    }
}
