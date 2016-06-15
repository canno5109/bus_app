// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function sendGoogleAnalytics() {
  Alloy.Globals.google_analytics_trackScreen("乗車停留所選択画面");
};

// バス停の名前を取得する
function getBusStopName() {
  $.errorMessage.setVisible(false);
  $.activityIndicator.show();
  var busStopNames = [];
  var url = "https://cryptic-journey-10666.herokuapp.com/system/ride.json";
  var xhr = Ti.Network.createHTTPClient({
    onload : function() {
      var json = JSON.parse(this.responseText);
      _.each(json, function(ride) {
        busStopNames.push({
          template: "rideTimetable",
          properties: {
            searchableText: ride.bus_stop_name
          },
          busStopName: {
            text: ride.bus_stop_name
          },
          detailBtn: {
            title: ">"
          },
          url: ride.bus_stop_url
        });
      });
      $.rideTimetableSection.setItems(busStopNames);
      $.activityIndicator.hide();
      $.rideTimetableList.setTouchEnabled(true);
      $.rideTimetableSearch.setTouchEnabled(true);
    },
    onerror : function(e) {
      $.activityIndicator.hide();
      $.errorMessage.setVisible(true);
    },
    timeout : 15000
  });
  xhr.open("GET", url);
  xhr.send();
};

function blurKeyboard(e) {
  e.source.blur();
};

function openGettingOffWin(e) {
  var item = e.section.getItemAt(e.itemIndex);
  var name = item["busStopName"]["text"];
  var url = item["url"];
  var arg = {
    navWin: $.navWin,
    name: name,
    url: url
  };
  var gettingOffWin = Alloy.createController("getting_off", arg).getView();
  $.navWin.openWindow(gettingOffWin);
};
