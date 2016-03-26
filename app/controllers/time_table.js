// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var dates = [], weekdays = [], holidays = [], saturdays = [];
$.ride_getoff_Title.setText("乗車停留所：" + $.args.rideName + "\n" + "降車停留所：" + $.args.getting_offName);
$.activityIndicator.show();

// 平日・土曜・休日の時刻表URLを取得
function getDateUrl() {
	var url = "https://cryptic-journey-10666.herokuapp.com/system/relevant_system.json";
	Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + $.args.url));
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			for (var i = 0; i < json.length; i++) {
				var datesColumn = {
					"name": json[i].name,
					"url": json[i].url
				};
				dates.push(datesColumn);
			}
			loadWeekdayTimeTable();
		},
		onerror : function(e) {
			Ti.API.debug(e);
			Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
			$.activityIndicator.hide();
		},
		timeout : 10000
	});
	xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + $.args.url));
	xhr.send();
}

function loadWeekdayTimeTable() {
	var url = "https://cryptic-journey-10666.herokuapp.com/system/weekday.json";
	Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + dates[0].url));
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			for (var i = 0; i < json.length; i++) {
				var weekdayColumn = {
					template: "timeTableTemplate",
					"hour": {
						text: json[i].hour
					},
					"times": {
						text: json[i].times
					}
				};
				weekdays.push(weekdayColumn);
			}
			$.listSection.setItems(weekdays);
			loadSaturdayTimeTable();
		},
		onerror : function(e) {
			Ti.API.debug(e);
			Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
			$.listView.setTouchEnabled(true);
			$.activityIndicator.hide();
		},
		timeout : 10000
	});
	xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + dates[0].url));
	xhr.send();
}

function loadSaturdayTimeTable() {
	var url = "https://cryptic-journey-10666.herokuapp.com/system/saturday.json";
	Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + dates[1].url));
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			for (var i = 0; i < json.length; i++) {
				var saturdayColumn = {
					template: "timeTableTemplate",
					"hour": {
						text: json[i].hour
					},
					"times": {
						text: json[i].times
					}
				};
				saturdays.push(saturdayColumn);
			}
			loadHolidayTimeTable();
		},
		onerror : function(e) {
			Ti.API.debug(e);
			Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
			$.listView.setTouchEnabled(true);
			$.activityIndicator.hide();
		},
		timeout : 10000
	});
	xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + dates[1].url));
	xhr.send();
}

function loadHolidayTimeTable() {
	var url = "https://cryptic-journey-10666.herokuapp.com/system/holiday.json";
	Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + dates[2].url));
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			for (var i = 0; i < json.length; i++) {
				var holidayColumn = {
					template: "timeTableTemplate",
					"hour": {
						text: json[i].hour
					},
					"times": {
						text: json[i].times
					}
				};
				holidays.push(holidayColumn);
			}
			$.listView.setTouchEnabled(true);
			$.buttonBar.setTouchEnabled(true);
			$.activityIndicator.hide();
		},
		onerror : function(e) {
			Ti.API.debug(e);
			Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
			$.listView.setTouchEnabled(true);
			$.buttonBar.setTouchEnabled(true);
			$.activityIndicator.hide();
		},
		timeout : 10000
	});
	xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + dates[2].url));
	xhr.send();
}

function changeTimeTable(e) {
	switch (e.index) {
		case 0:
		$.timeTableTitle.setText("時刻表（平日）");
		$.listSection.setItems(weekdays);
		break;
		case 1:
		$.timeTableTitle.setText("時刻表（土曜）");
		$.listSection.setItems(saturdays);
		break;
		case 2:
		$.timeTableTitle.setText("時刻表（休日）");
		$.listSection.setItems(holidays);
		break;
		default:
		$.timeTableTitle.setText("時刻表（平日）");
		$.listSection.setItems(weekdays);
		break;
	}
}

// 画面を閉じる
function closeWin() {
	$.time_tableWin.close();
}
