// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

/* 地図機能は今後導入 */
// Alloy.Globals.Map = require('ti.map');

/* Google Analytics */
var GA = require('analytics.google');
GA.trackUncaughtExceptions = true;
GA.optOut = false;
GA.dryRun = false;
GA.dispatchInterval = 5;
var tracker = GA.getTracker(Alloy.CFG.trackingId);

Alloy.Globals.google_analytics_trackScreen = function(screenName) {
  tracker.trackScreen({
    screenName: screenName
  });
}

Alloy.Globals.google_analytics_trackEvent = function(category, action, label) {
  tracker.trackEvent({
    category: category,
    action: action,
    label: label,
    value: 1
  });
}
