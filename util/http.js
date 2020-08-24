const base_url = 'http://127.0.0.1:8000/api'
import storage from './storage'
module.exports = {
	get: function (url, data, success, fail, complete) {
		url = base_url + url
		return request({
			url,
			data,
			success,
			fail,
			complete,
			method: 'get',
		})
	},
	post: function (url, data, success, fail, complete) {
		url = base_url + url
		return request({
			url,
			data,
			method: 'post',
			success,
			complete,
			fail
		})
	}
}

function request(params) {
	let url = params.url;
	let method = params.method;
	let header = params.header || {};
	header.Authorization = storage.getToken()
	console.log('header is', header)
	let data = params.data || {};
	//	请求方式 GET POST
	if (method) {
		method = method.toUpperCase();
		if (method == "POST") {
			header["content-type"] = "application/x-www-form-urlencoded" 
		}
	}
	//	发起请求 加载动画
	if (!params.hideLoading) {
		uni.showLoading({
			title: "加载中"
		})
	}
	//	发起网络请求
	uni.request({
		url: url,
		method: method || "GET",
		header: header,
		data: data,
		dataType: "json",
		sslVerify: false,	//	是否验证ssl证书
		success: res => {
			let path = url.split('/')[url.split('/').length - 1]
			console.log(path, '结果', res.data)
			//	api错误
			let data = res.data
			if (data.code != 200) {
				uni.showModal({
					content: data.msg
				})
				return;
			}
			if (['login', 'register'].indexOf(path) > -1) {
				storage.setToken(res.data.data.token)
			}
			typeof params.success == "function" && params.success(res.data);
		},
		fail: err => {
			console.error(err)
			uni.showModal({
				content: '服务器异常'// err.errMsg//err.msg
			})
			typeof params.fail == "function" && params.fail(err.data);
		},
		complete: (e) => {
			console.log("请求完成");
			uni.hideLoading()
			typeof params.complete == "function" && params.complete(e.data);
			return;
		}
	})
}