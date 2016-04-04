// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var dates = [], weekdays = [], holidays = [], saturdays = [];
$.ride_getoff_Title.setText("乗車停留所：" + args.rideName + "\n" + "降車停留所：" + args.getting_offName);
$.activityIndicator.show();
var date = new Date().getDay();

function sendGoogleAnalytics() {
  Alloy.Globals.google_analytics_trackScreen("時刻表画面");
}

// 平日・土曜・休日の時刻表URLを取得
function getDateUrl() {
  var url = "https://cryptic-journey-10666.herokuapp.com/system/relevant_system.json";
  Ti.API.debug(encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.url));
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
      if (!Ti.Network.online) {
        Ti.UI.createAlertDialog({title: "エラー", message: e.error}).show();
        $.activityIndicator.hide();
        return;
      }
      Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
      $.activityIndicator.hide();
    },
    timeout : 10000
  });
  xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + args.url));
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
      var timetableCollection = Alloy.createCollection("timetable");
      timetableCollection.fetch({query: { statement: 'SELECT * FROM timetable WHERE rideName = ? AND gettingOffName = ?', params: [args.rideName, args.getting_offName] }});
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

function saveTimeTable(e) {
  if ($.registerBtn.saved == false) {
    var tModel = Alloy.createModel("timetable");
    tModel.set({
      rideName: args.rideName,
      gettingOffName: args.getting_offName,
      weekdayUrl: dates[0].url,
      saturdayUrl: dates[1].url,
      holidayUrl: dates[2].url
    });
    tModel.save();
    Alloy.Globals.google_analytics_trackEvent('時刻表登録', 'click', args.rideName + " → " + args.getting_offName);
    $.registerBtn.setBackgroundImage("/icons/star-full.png");
    $.registerBtn.saved = true;
  } else {
    var timetableCollection = Alloy.createCollection("timetable");
    timetableCollection.fetch({query: { statement: 'SELECT * FROM timetable WHERE rideName = ? AND gettingOffName = ?', params: [args.rideName, args.getting_offName] }});
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
