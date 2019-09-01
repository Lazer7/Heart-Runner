var vmModule = require('./heartrate-view-model');

module.exports = {
    onNavigatingTo: function (args) {
        const page = args.object;
        page.bindingContext = new vmModule.heartrateViewModel(args);
    }
}