var vmModel = require('./summary-view-model');
var orientationModule = require("nativescript-screen-orientation");

module.exports = {
    onNavigatingTo: function (args) {
        orientationModule.setCurrentOrientation("landscape");
        const page = args.object;
        page.bindingContext = new vmModel.summaryViewModel(args);
    }
}
