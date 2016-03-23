function resetDirectionTitle() {
	Alloy.Globals.directionTitle = "";
}

function openTimeTableWindow(e) {
	Alloy.Globals.directionTitle = e.source.title;
	var tabWin = Alloy.createController('tab').getView().open();
}

$.indexWin.open();
