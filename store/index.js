import Vue from 'vue'
import Vuex from 'vuex'
import Constants from '../util/constants'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
	},
	mutations: {
		login(state, provider) {

			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: Constants.USERINFO,  
			    data: provider  
			}) 
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {}; 
			uni.removeStorage({  
			    key: Constants.TOKEN,  
            })
			uni.removeStorage({  
			    key: Constants.USERINFO,  
            })
		}
	},
	actions: {
	
	}
})

export default store
