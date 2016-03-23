// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.debug(Alloy.Globals.directionTitle);

// バス停の名前を取得する
function getBusStopName() {
	$.activityIndicator.show();
	setTimeout(function(){
		$.activityIndicator.hide();
	}, 6000);
	return;

	var busStopNames = [];
	var url = "";
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			for (var i = 0; i < json.length; i++) {
				var names = {
					template: "busStopTemplate",
					"busStopName": {
						text: json[i].name
					},
					"detailBtn": {
						title: "＞"
					}
				};
				busStopNames.push(names);
				$.listSection.setItems(busStopNames);
			}
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
		},
		timeout : 10000
	});
	xhr.open("GET", url);
	xhr.send();
}


// 画面を閉じる
function closeWin() {
	Alloy.Globals.tabGroup.close();
}
