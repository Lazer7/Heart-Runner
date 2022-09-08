/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
const application = require("tns-core-modules/application");

application.run({ moduleName: "app-root" });
//this is just to test on git//
// this is also need to test the PR
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
