/*
 加密模式：ECB
 填充：pkcs7padding
 数据块：128位
 密码：light-app-123456
 偏移量：
 输出：hex
 字符集：utf-8
 * */
var AES_ONLINE = false;
summerready = function() {
	// here is your code...
	var top = $summer.offset($summer.byId('header')).h;
	var bottom = $summer.offset($summer.byId('footer')).h;

	summer.openFrame({
		id : 'main',
		url : 'html/main.html',
		bounces : true,
		position : {
			top : top,
			bottom : bottom,
			left : 0,
			right : 0
		}
	});
}
function sign() {
	getToeknByLogin();
}

function enAndSign(token) {
	/*
	 window.cordovaHTTP.settings = {
	 timeout : 5000
	 };
	 */
	var longitudeMin = 116.241999;
	var longitudeMax = 116.245323;
	var x = Math.random() * (longitudeMax - longitudeMin) + longitudeMin;

	var latitudeMin = 40.071687;
	var latitudeMax = 40.075001;
	var y = Math.random() * (latitudeMax - latitudeMin) + latitudeMin;

	var qzId = getParam("qzId");

	var accountId = getParam("accountId");
	var imei = getParam("imei");
	var wifiName = getParam("wifiName");
	var wifiMac = getParam("wifiMac");
	var deviceModel = getParam("deviceModel");
	var deviceName = getParam("deviceName");

	if (!qzId || !accountId || !imei || !wifiName || !wifiMac || !deviceModel || !deviceName) {
		return
	}

	//设置5秒超时
	var mydata = {
		"signTime" : (new Date()).valueOf(), //1516709376012
		"isRoot" : 0,
		"longitude" : x,
		"latitude" : y,
		"wifiName" : wifiName, //"emm",
		"deviceModel" : deviceModel, //"iPhone10,3",
		"address" : "用友产业园",
		"accountId" : accountId, //102031
		"wifiMac" : wifiMac, //"ae:fd:ce:d:5e:30",
		"imei" : imei, //865422039357389",
		"deviceName" : deviceName, //"Xiaomi",
		"szId" : qzId//5417
	}
	//alert(JSON.stringify(mydata));
	if (AES_ONLINE) {
		var xx = "m=ecb_pad=pkcs7_block=128_p=light-app-123456_o=1_s=utf-8_t=0";
		summer.ajax({
			type : "post",
			url : "http://tool.chacuo.net/cryptaes",
			param : {
				data : JSON.stringify(mydata),
				type : "aes",
				arg : xx
			}
		}, function(response) {
			//alert(response.status);
			//alert(response.data);
			var result = JSON.parse(response.data);
			var endata = result.data[0];
			//alert("aes加密数据为" + endata);

			encryptSignIn(token, endata);

		}, function(response) {

			alert(response.error);
			if (confirm("aes加密失败，要走默认逻辑?")) {

				var raw = {
					"signTime" : 1521870629234,
					"isRoot" : 0,
					"longitude" : "116.2363677300347",
					"latitude" : "40.06752522786459",
					"wifiName" : "360wifi-001",
					"deviceModel" : "Mi Note 3",
					"address" : "用友产业园",
					"accountId" : 102031,
					"wifiMac" : "ae:fd:ce:d3:5e:30",
					"imei" : "865422039357389",
					"deviceName" : "GNote",
					"szId" : 5417
				};
				var endata = "0b7cd06d412d63eeafc35eb6b8996a4b3a958dbcf828d92179324b47fc8b3411276fba6a76b959d3946d0cfdffd4ab5be14edaae56f283b1c3d9adfdf1b761ea0844beaee4ca0384b8794217c97a1d227166bc6ce2cb45faaa03b6d66bb136d72afcf3a75db6a051b4b1839e59027440813a5f616caf426525cd8145a64cfd44280f69ccf014751de8db3cf91ba1a0646f294329274ce0226d16dba3c0d4bcb55ec9ced70ae8f25ba49495827122194adb5c9428c0b0d5e3b69690c747a040dd275e9d42bb6132d1ccf830f5a533f21c56370fa53c8ae641853898765a6c4411bbbdb8f0d1fbfd3a2bd51f7874b824c601a1856849655ab1703585eb2ff64b7918ef41132695ecd6a3554339e6bd37493e611087a6fa2a3dee675faeb24ad41a";
				encryptSignIn(token, endata);
			}

		});
	} else {
		if (!confirm("将采取JS AES加密，是否继续?"))
			return;
		var endata = CryptoJS_AES_Encrypt(JSON.stringify(mydata), "light-app-123456");
		encryptSignIn(token, endata);
	}
}

function CryptoJS_AES_Encrypt(word, key, mode) {
	if (!key) {
		key = "light-app-123456";
	}
	key = CryptoJS.enc.Utf8.parse(key);
	if (!mode) {
		mode = {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		}
	}
	var srcs = CryptoJS.enc.Utf8.parse(word);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, mode);
	var cipher = encrypted.ciphertext.toString();
	var hex = CryptoJS.enc.Hex.parse(cipher);

	return hex.toString();
}

function getToeknByLogin() {
	var url = summer.getStorage("sys_url_webLogin");
	if (!url) {
		url = "https://ezone.yonyoucloud.com/signin/index/webLogin";
	}

	var memberId = getParam("memberId");
	var qzId = getParam("qzId");
	if (!memberId || !qzId) {
		return
	}

	summer.ajax({
		type : "post",
		url : url,
		param : {
			memberId : memberId,
			qzId : qzId
		}
	}, function(response) {
		//alert(response.status);
		//alert(response.data);
		var result = JSON.parse(response.data);
		var code = result.code;
		var token = result.data;

		if (code == 0) {

			enAndSign(token);

		} else {
			alert("fail to get token by login")
			alert(response.data);
			return;
		}

	}, function(response) {
		alert(response.error);
	});

}

function encryptSignIn(token, encryptedAttentance) {

	var url = summer.getStorage("url");
	if (!url) {
		url = "https://ezone.yonyoucloud.com/signin/attentance/encryptSignIn";
	}
	if (!confirm("确认签到？")) {
		return;
	}
	summer.ajax({
		type : "post",
		url : url,
		param : {
			encryptedAttentance : encryptedAttentance,
			token : token
		}
	}, function(response) {
		//alert(response.status);
		//alert(response.data);
		var result = JSON.parse(response.data);
		var code = result.code;
		var state = result.data.state;
		var signTime = result.data.signTime;
		var message = result.data.message;
		if (code == 0) {
			var info = "您于 " + signTime + " 签到成功!" + " </br> " + message;
			//alert(info);
			summer.execScript({
				winId : 'root',
				frameId : 'main',
				script : "toast('" + info + "')"
			});
		} else {
			alert(response.data);
		}

	}, function(response) {
		alert(response.error);
	});
}

var G_sys_data = null;
function getParam(param) {
	G_sys_data = summer.getStorage("sys_data");
	if (!G_sys_data) {
		alert("没有基础数据，请先录入基础数据，然后保存再使用签到功能");
		return false;
	}

	//var paramValue = summer.getStorage("sys_" + param);
	var paramValue = G_sys_data["sys_" + param];
	if (!paramValue) {
		paramValue = prompt("请输入您的" + param, "");
		if (!paramValue) {
			alert("没有" + param + "签什么到啊！");
		}
	}
	return paramValue;
}