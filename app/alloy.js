/* Map機能 今後追加 */
// Alloy.Globals.Map = require('ti.map');

if (OS_IOS) {
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
}
