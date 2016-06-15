// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
$.activityIndicator.show();
$.rideTitle.setText("乗車停留所：" + $.args.name);

function sendGoogleAnalytics() {
  Alloy.Globals.google_analytics_trackScreen("降車停留所選択画面");
};

// バス停の名前を取得する
function getBusStopName() {
  $.errorMessage.setVisible(false);
  var busStopNames = [];
  var url = "https://cryptic-journey-10666.herokuapp.com/system/getting_off.json";
  var xhr = Ti.Network.createHTTPClient({
    onload : function() {
      var json = JSON.parse(this.responseText);
      _.each(json, function(gettingOff) {
        busStopNames.push({
          template: "gettingOffTimetable",
          properties: {
            searchableText: gettingOff.bus_stop_name
          },
          busStopName: {
            text: gettingOff.bus_stop_name
          },
          detailBtn: {
            title: ">"
          },
          url: gettingOff.bus_stop_url
        });
      });

      $.gettingOffTimetableSection.setItems(busStopNames);
      $.activityIndicator.hide();
      $.gettingOffTimetableList.setTouchEnabled(true);
      $.gettingOffTimetableSearch.setTouchEnabled(true);
    },
    onerror : function(e) {
      $.activityIndicator.hide();
      $.errorMessage.setVisible(true);
    },
    timeout : 15000
  });
  xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + $.args.url));
  xhr.send();
};

function blurKeyboard(e) {
  e.source.blur();
};

function openTimeTableWin(e) {
  var item = e.section.getItemAt(e.itemIndex);
  var name = item["busStopName"]["text"];
  var url = item["url"];
  var arg = {
    navWin: $.args.navWin,
    rideName: $.args.name,
    getting_offName: name,
    url: url
  };
  var timeTableWin = Alloy.createController('time_table', arg).getView();
  $.args.navWin.openWindow(timeTableWin);
};

function closeWin() {
  $.gettingOffWin.close();
};

function swipeToClose(e) {
  if (e.direction == "right") {
    $.gettingOffWin.close();
  }
};
