var observable = require("tns-core-modules/data/observable");
var observableArray = require("tns-core-modules/data/observable-array");
var frameModule = require("tns-core-modules/ui/frame");
var dialogs = require("tns-core-modules/ui/dialogs");
var bluetooth = require("nativescript-bluetooth");

var ConnectionViewModel = (function (_super){
  __extends(ConnectionViewModel, _super);
  function ConnectionViewModel() {
    _super.call(this);
  }
  // Bluetooth Peripherals
  var observablePeripheralArray = new observableArray.ObservableArray();
  ConnectionViewModel.prototype.peripherals = observablePeripheralArray;


  ConnectionViewModel.prototype.checkBluetoothEnabled = function(){
    bluetooth.isBluetoothEnabled().then(function(enabled) {
      dialogs.alert({
        title: "Enabled?",
        message: enabled ? "Yes" : "No",
        okButtonText: "OK, thanks"
      });
    });
  }
  ConnectionViewModel.prototype.enableBluetooth = function () {
    bluetooth.enable().then(function(enabled) {
      setTimeout(function() {
        dialogs.alert({
          message: "Bluetooth was " + (enabled ? "" : "not") + " enabled on this device.",
          okButtonText: "Continue"
        });
      }, 500);
    });
  };

  ConnectionViewModel.prototype.onPeripheralTap = function (args) {
    var index = args.index;
    console.log('!!&&&&***** Clicked item with index ' + index);
    var peri = DemoAppModel.prototype.peripherals.getItem(index);
    console.log("--- peri selected: " + peri.UUID);

    var navigationEntry = {
      moduleName: "services-page",
      context: {
        info: "something you want to pass to your page",
        foo: 'bar',
        peripheral: peri
      },
      animated: true
    };
    var topmost = frameModule.topmost();
    topmost.navigate(navigationEntry);
  };


  ConnectionViewModel.prototype.doStopScanning = function () {
    var that = this;
    bluetooth.stopScanning().then(function() {
      that.set('isLoading', false);
    },
    function (err) {
      dialogs.alert({
        title: "Whoops!",
        message: err,
        okButtonText: "OK, so be it"
      });
    });
  };
  ConnectionViewModel.prototype.doStartScanning = function () {
    var that = this;

    that.set('isLoading', true);
    // reset the array
    observablePeripheralArray.splice(0, observablePeripheralArray.length);
    bluetooth.startScanning(
      {
        serviceUUIDs: [], // pass an empty array to scan for all services
        seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
        onDiscovered: function (peripheral) {
          observablePeripheralArray.push(observable.fromObject(peripheral));
        }
      }
    ).then(function() {
      that.set('isLoading', false);
    },
    function (err) {
      that.set('isLoading', false);
      dialogs.alert({
        title: "Whoops!",
        message: err,
        okButtonText: "OK, got it"
      });
    });
  };

  ConnectionViewModel.prototype.doScanForHeartrateMontitor = function () {
    var that = this;
    var omegaService = "180D";
    that.set('isLoading', true);
    // reset the array
    observablePeripheralArray.splice(0, observablePeripheralArray.length);
    bluetooth.startScanning(
      {
        serviceUUIDs: [omegaService], // pass an empty array to scan for all services
        seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
        onDiscovered: function (peripheral) {
          observablePeripheralArray.push(observable.fromObject(peripheral));
        }
      }
    ).then(function() {
      that.set('isLoading', false);
    },
    function (err) {
      that.set('isLoading', false);
      dialogs.alert({
        title: "Whoops!",
        message: err,
        okButtonText: "OK, got it"
      });
    });
  };
  ConnectionViewModel.prototype.onPeripheralTap = function (args) {
    console.log("HEREISON")
    var index = args.index;
    console.log('!!&&&&***** Clicked item with index ' + index);
    var peri = ConnectionViewModel.prototype.peripherals.getItem(index);
    console.log("--- peri selected: " + peri.UUID);
    const button = args.object;
    const page = button.page;
    var navigationEntry = {
      moduleName: "page_heartrate/heartrate-page",
      context: {
        peripheral: peri
      }
    }
    page.frame.navigate(navigationEntry);
  };
  return ConnectionViewModel;
})(observable.Observable);


exports.connectionViewModel = new ConnectionViewModel();

