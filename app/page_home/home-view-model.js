const observable = require("tns-core-modules/data/observable");
var dialogs = require("tns-core-modules/ui/dialogs");
const fileSystemModule = require("tns-core-modules/file-system");
var {
    Bluetooth
} = require('nativescript-bluetooth');
const bluetooth = new Bluetooth();
var HomeViewModel = (function (_super) {
    __extends(HomeViewModel, _super);

    function HomeViewModel() {
        _super.call(this);
        this.title = "Heart Runner";
    }
//////////////////////////// TODO:: REMOVE THIS CHUNK OF CODE ////////////////////////////////////
    HomeViewModel.prototype.sendValues = function(result,startIndex,endIndex){
        console.log(result.substring(startIndex,endIndex));
        fetch("http://192.168.254.13/",{
            method: "POST",
            body: JSON.stringify({data: result.substring(startIndex,endIndex)})
        }).then((r)=>{
            var nextIndex = (endIndex+500)>result.length? result.length:endIndex+500;
            if(endIndex!==result.length)
            HomeViewModel.prototype.sendValues(result, startIndex+500,nextIndex)
        });
    }
    HomeViewModel.prototype.yeetCannon = function (args) {
        console.log("HERE")
        const documents = fileSystemModule.knownFolders.documents();
        console.log("Here")
        const folder = documents.getFolder("Data");
        var file = folder.getFile("sessionData.txt");
        var file1 = folder.getFile("sessionData1.txt");
        var file2 = folder.getFile("sessionData2.txt");
        console.log(file);
        console.log(file1);
        console.log(file2);

        file.readText().then((res) => {
            HomeViewModel.prototype.sendValues(res,0,500);
        })
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////

    HomeViewModel.prototype.onConnect = function (args) {
        const button = args.object;
        const page = button.page;
        page.frame.navigate("page_userform/userform-page");

    }
    /**
     * Checks if the device's bluetooth is enabled
     */
    HomeViewModel.prototype.checkBluetoothEnabled = function () {
        bluetooth.isBluetoothEnabled().then(function (enabled) {
            if (!enabled) {
                dialogs.confirm({
                    title: "Bluetooth Not Enabled!",
                    message: "You need to enable bluetooth in order to run the application.",
                    okButtonText: "Enable"
                }).then((result) => {
                    bluetooth.enable().then(function (enabled) {
                        setTimeout(function () {
                            dialogs.alert({
                                message: "Bluetooth was " + (enabled ? "" : "not") + " enabled on this device.",
                                okButtonText: "Continue"
                            });
                        }, 500);
                    });
                })
            }
        });
    }

    return HomeViewModel;
})(observable.Observable);


exports.homeViewModel = new HomeViewModel();
