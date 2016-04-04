// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var weekdays = [], holidays = [], saturdays = [];
Alloy.Globals.google_analytics_trackScreen("お気に入り時刻表リスト画面");
$.ride_getoff_Title.setText("乗車停留所：" + args.rideName + "\n" + "降車停留所：" + args.gettingOffName);
$.activityIndicator.show();
var date = new Date().getDay();

function loadWeekdayTimeTable() {
  var url = "https://cryptic-journey-10666.herokuapp.com/system/weekday.json";
  Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.weekdayUrl));
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
  xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.weekdayUrl));
  xhr.send();
}

function loadSaturdayTimeTable() {
  var url = "https://cryptic-journey-10666.herokuapp.com/system/saturday.json";
  Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.saturdayUrl));
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
  xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.saturdayUrl));
  xhr.send();
}

function loadHolidayTimeTable() {
  var url = "https://cryptic-journey-10666.herokuapp.com/system/holiday.json";
  Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.holidayUrl));
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
      var timetableCollection = Alloy.createCollection("timetable");
      timetableCollection.fetch({query: { statement: 'SELECT * FROM timetable WHERE rideName = ? AND gettingOffName = ?', params: [args.rideName, args.gettingOffName] }});
      if (timetableCollection.length > 0) {
        $.registerBtn.setBackgroundImage("/icons/star-full.png");
        $.registerBtn.saved = true;
      }
      switch(date) {
        case 0:
        $.timeTableTitle.setText("時刻表（休日）");
        $.listSection.setItems(holidays);
        break;
        case 6:
        $.timeTableTitle.setText("時刻表（土曜）");
        $.listSection.setItems(saturdays);
        break;
        default:
        $.timeTableTitle.setText("時刻表（平日）");
        $.listSection.setItems(weekdays);
        break;
      }
      $.listView.setTouchEnabled(true);
      $.buttonBar.setTouchEnabled(true);
      $.registerBtn.setTouchEnabled(true);
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
  xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.holidayUrl));
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

function saveTimeTable(e) {
  if ($.registerBtn.saved == false) {
    var tModel = Alloy.createModel("timetable");
    tModel.set({
      rideName: args.rideName,
      gettingOffName: args.gettingOffName,
      weekdayUrl: args.weekdayUrl,
      saturdayUrl: args.saturdayUrl,
      holidayUrl: args.holidayUrl
    });
    tModel.save();
    $.registerBtn.setBackgroundImage("/icons/star-full.png");
    $.registerBtn.saved = true;
  } else {
    var timetableCollection = Alloy.createCollection("timetable");
    timetableCollection.fetch({query: { statement: 'SELECT * FROM timetable WHERE rideName = ? AND gettingOffName = ?', params: [args.rideName, args.gettingOffName] }});
    timetableCollection.each(function(t) {
      t.destroy();
    });
    $.registerBtn.setBackgroundImage("/icons/star-empty.png");
    $.registerBtn.saved = false;
  }
}

// 画面を閉じる
function closeWin() {
  $.time_tableWin.close();
}
