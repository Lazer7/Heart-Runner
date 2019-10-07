var vmModel = require('./userform-view-model');
var orientationModule = require("nativescript-screen-orientation");

module.exports = {
    onNavigatingTo: function (args) {
        orientationModule.setCurrentOrientation("portrait", function () {});
        const page = args.object;
        page.bindingContext = new vmModel.userformViewModel(args);
    }
}
