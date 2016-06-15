// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
Alloy.Collections.timetable.fetch();

function loadBusList() {
	Alloy.Globals.google_analytics_trackScreen("お気に入りバス停リスト画面");
	updateTimetable();
};

function blurKeyboard(e) {
  e.source.blur();
};

function openTimeTableWin(e) {
  var item = e.section.getItemAt(e.itemIndex);
	var arg = {
		rideName: item["properties"]["rideName"],
		gettingOffName: item["properties"]["gettingOffName"],
		weekdayUrl: item["properties"]["weekdayUrl"],
		saturdayUrl: item["properties"]["saturdayUrl"],
		holidayUrl: item["properties"]["holidayUrl"]
	};
  var timeTableWin = Alloy.createController('register_time_table', arg).getView();
  $.navWin.openWindow(timeTableWin);
};

function transformTimetable(model) {
	var transform = model.toJSON();
	transform.searchableText = transform.rideName + transform.gettingOffName;
	return transform;
};

function filterTimetable(collection) {
	return collection.models;
};
