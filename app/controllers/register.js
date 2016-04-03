// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function loadBusList() {
	Alloy.Globals.google_analytics_trackScreen("お気に入りバス停リスト画面");
	$.search.setTouchEnabled(false);
	$.listView.setTouchEnabled(false);
	var timetableModelCollection = Alloy.createCollection("timetable");
	timetableModelCollection.fetch();
	var timeTableListItems = [];
	if (timetableModelCollection.length == 0) {
		$.listSection.setItems(timeTableListItems);
		return;
	}
	$.activityIndicator.show();
	timetableModelCollection.map(function(t) {
		var timeTableItems = {
			template: "registerBusStopTemplate",
			properties: {
				searchableText: t.get('rideName') + t.get('gettingOffName')
			},
			"rideBusStopName": {
				text: t.get('rideName')
			},
			"arrow": {
				text: "↓"
			},
			"gettingOffBusStopName": {
				text: t.get('gettingOffName')
			},
			"detailBtn": {
				title: ">"
			},
			"rideName": t.get('rideName'),
			"gettingOffName": t.get('gettingOffName'),
			"weekdayUrl": t.get('weekdayUrl'),
			"saturdayUrl": t.get('saturdayUrl'),
			"holidayUrl": t.get('holidayUrl')
		};
		timeTableListItems.push(timeTableItems);
	});
	$.listSection.setItems(timeTableListItems);
	$.search.setTouchEnabled(true);
	$.listView.setTouchEnabled(true);
	$.activityIndicator.hide();
}

function blurKeyboard(e) {
  e.source.blur();
}

function openTimeTableWin(e) {
  var item = e.section.getItemAt(e.itemIndex);
	var arg = {
		rideName: item["rideName"],
		gettingOffName: item["gettingOffName"],
		weekdayUrl: item["weekdayUrl"],
		saturdayUrl: item["saturdayUrl"],
		holidayUrl: item["holidayUrl"]
	};
  var timeTableWin = Alloy.createController('register_time_table', arg).getView();
  $.navWin.openWindow(timeTableWin);
}
