// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function getCurrentPosition() {
	var currentLatitude, currentLongitude;
	if (ENV_DEV) {
		currentLatitude = 39.874214;
		currentLongitude = 141.173647;
		$.mapView.region = {
			latitude: currentLatitude,
			longitude: currentLongitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01
		};
	} else {
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				Ti.UI.createAlertDialog({
					title: "エラー",
					message: "位置情報の取得に失敗しました"
				}).show();
				return;
			}
			currentLatitude = e.coords.latitude;
			currentLongitude = e.coords.longitude;
			Ti.API.debug("緯度：" + e.coords.latitude);
			Ti.API.debug("経度：" + e.coords.longitude);
			$.mapView.region = {
				latitude: currentLatitude,
				longitude: currentLongitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			};
		});
	}
}

var currentPlace = Alloy.Globals.Map.createAnnotation({
	latitude: 39.702053,
	longitude: 141.154484,
	title: "盛岡駅 -> アイスアリーナ前",
	subtitle: "もりおかえき -> あいすありーなまえ",
	rightButton: "/icons/info.png",
	image: "/icons/bus.png",
	animate: true,
	myid: 1
});
$.mapView.annotations = [currentPlace];
