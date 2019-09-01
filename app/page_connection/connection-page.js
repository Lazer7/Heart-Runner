var vmModule = require("./connection-view-model");


module.exports = {
    onNavigatingTo: function (args) {
        const page = args.object;
        page.bindingContext = vmModule.connectionViewModel;
    },
    onPeripheralTap: vmModule.connectionViewModel.onPeripheralTap
}
