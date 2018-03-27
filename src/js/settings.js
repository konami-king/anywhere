summerready = function() {
	// here is your code...
}﻿
var vm = new Vue({
	el: '#app',
	data: {
		memberId:"2887096",
		qzId:"5417",
		accountId:"102031",
		imei:"865422039357389",
		wifiName:"test-360-10-1",
		wifiMac:"ad:ed:c3:d:5e:20",
		deviceModel:"Mi Note 3",
		deviceName:"GNote"
	},
	methods: {
		back:function(){
			if(confirm("要返回吗")){
				summer.closeWin();
			}
		},
		save: function () {
			debugger;
			alert(JSON.stringify(this.$data))
			summer.setStorage("sys_data", this.$data);
			UM.toast("保存成功!");
		},

		remove:function () {
			if (confirm("真的要清除缓存吗？")) {
				summer.rmStorage("sys_data");
				UM.toast("清除完毕!!");
			}
		}
	}
})