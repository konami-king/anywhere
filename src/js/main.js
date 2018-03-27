//here is your code...
summerready = function() {
	$summer.byId("content").innerHTML += "<h3 style='text-align: center'>特别声明,  该APP仅做测试使用，使用者自行承担责任!</h3><h3 style='text-align: center'>登录时间： " + (new Date()).toLocaleString() + "</h3>";

	var sys_data = summer.getStorage("sys_data");
	if (sys_data) {
		if (sys_data["sys_memberId"])
			$("#memberId").val(sys_data["sys_memberId"]);
		if (sys_data["sys_qzId"])
			$("#qzId").val(sys_data["sys_qzId"]);
		if (sys_data["sys_accountId"])
			$("#accountId").val(sys_data["sys_accountId"]);
		if (sys_data["sys_imei"])
			$("#imei").val(sys_data["sys_imei"]);
		if (sys_data["sys_wifiName"])
			$("#wifiName").val(sys_data["sys_wifiName"]);
		if (sys_data["sys_wifiMac"])
			$("#wifiMac").val(sys_data["sys_wifiMac"]);
		if (sys_data["sys_deviceModel"])
			$("#deviceModel").val(sys_data["sys_deviceModel"]);
		if (sys_data["sys_deviceName"])
			$("#deviceName").val(sys_data["sys_deviceName"]);
	}

};

function save() {
	debugger;
	var sys_data = {};
	sys_data["sys_memberId"] = $("#memberId").val();
	sys_data["sys_qzId"] = $("#qzId").val();

	sys_data["sys_accountId"] = $("#accountId").val();
	sys_data["sys_imei"] = $("#imei").val();

	sys_data["sys_wifiName"] = $("#wifiName").val();
	sys_data["sys_wifiMac"] = $("#wifiMac").val();
	sys_data["sys_deviceModel"] = $("#deviceModel").val();
	sys_data["sys_deviceName"] = $("#deviceName").val();
	summer.setStorage("sys_data", sys_data);
	UM.toast("保存成功!");
}

function remove() {
	if (confirm("真的要清除缓存吗？")) {
		summer.rmStorage("sys_data");
		UM.toast("清除完毕!!");
	}
}

function toast(info) {
	UM.toast(info);
}

function signImg() {
	summer.execScript({
		winId : 'root',
		script : "sign()"
	});
}
