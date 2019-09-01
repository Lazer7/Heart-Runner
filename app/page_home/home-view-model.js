const observable = require("tns-core-modules/data/observable");
var dialogs = require("tns-core-modules/ui/dialogs");

var HomeViewModel = (function (_super) {
    __extends(HomeViewModel, _super);

    function HomeViewModel() {
        _super.call(this);
        this.title = "Heart Runner";
    }
    HomeViewModel.prototype.onConnect = function (args) {
        // dialogs.alert({
        //   title:"Work in Progress",
        //   message: "Stay tune!"
        // })
         const button = args.object;
         const page = button.page;
         page.frame.navigate("page_connection/connection-page")


        //page.frame.navigate("connection");
    }
    return HomeViewModel;
})(observable.Observable);


exports.homeViewModel = new HomeViewModel();
