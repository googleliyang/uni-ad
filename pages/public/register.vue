<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<!-- <view class="left-top-sign">LOGIN</view> -->
			<view class="welcome">
				<!-- 欢迎回来！ -->
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input 
						type="number" 
						:value="mobile" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view> 

				<view class="input-item">
					<div class="panel"> 
						<text class="tit">验证码</text>
						<text :class="endTime > 0 ? 'tit captcha forbidden' : 'tit captcha'" @click="sendSms">发送验证码{{endTime > 0 ? endTime : ''}}</text> 
					</div>
					<input 
						type="text" 
						value="" 
						placeholder="请输入验证码"
						placeholder-class="input-empty"
						maxlength="20"
						captcha 
						data-key="captcha"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>

				<view class="input-item">
					<text class="tit">密码</text>
					<input 
						type="mobile" 
						value="" 
						placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>

                
			</view>
			<button class="confirm-btn" @click="toRegist" :disabled="logining">注册</button>
			<view class="forget-section" @click="toForget">
				忘记密码?
			</view>
		</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	
	export default{
		data(){
			return {
				endTime: 0,
				mobile: '',
				password: '',
				captcha: '',
				logining: false
			}
		},
		onLoad(){
			
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			sendSms() {
				if (!this.mobile) {
					this.$api.msg('请先输入手机号')
				} else if (!(/^1[3456789]\d{9}$/.test(this.mobile))) {
					this.$api.msg('手机号不合法') 
				} 

				this.$http.post('/sendSms', {
					mobile: this.mobile
				}, (res) => {
					if (res.code == 200) {
						this.$api.msg('短信发送成功')
					}
				}, fail => {

				}, done => { 
					this.endTime = 60
					let interval = setInterval(() => {
						this.endTime -- 
						if (this.endTime <= 0) {
							clearInterval(interval)
							this.endTime = 0
						}
					}, 1000)
				})
			},
			toForget() {
				uni.navigateTo({
					url: '/pages/public/reset'
				})
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				this.$http.register( '/register', {
					code: this.captcha,
					name: this.mobile,
					mobile: this.mobile,
					password: this.password,
					c_password: this.password,
				}, (res) => {
					if (res.data.code == 200) {
						this.$api.msg('注册成功')
					}
					let token = res.data.token
				}, (err) => {
					console.error(err)
				}, ()=> {
					this.logining = false
				})

			},
			async toLogin(){
				this.logining = true;
				const {mobile, password} = this;
				/* 数据验证模块
				if(!this.$api.match({
					mobile,
					password
				})){
					this.logining = false;
					return;
				}
				*/
				const sendData = {
					mobile,
					password
				}; 

				this.$http.post( '/login', sendData, (res) => {
					let token = res.data.token
					console.log('token is --->', token)	
					uni.navigateBack();
				}, (err) => {
					console.error(err)
				}, ()=> {
					this.logining = false
				})

				// const result = await this.$api.json('userInfo');
				// if(result.status === 1){
				// 	this.login(result.data);
                //     uni.navigateBack();  
				// }else{
				// 	this.$api.msg(result.msg);
				// 	this.logining = false;
				// }
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
		background-image: url('../../static/login_bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%; 
	}
	.wrapper{
		position:relative;
		padding-top: 300upx;
		z-index: 90;
		// background: #fff;
		padding-bottom: 40upx;
		
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
	
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		.panel {
			width: 100%;
			display: flex;
			.tit {
				flex: 1;
			}
			.captcha {
				color: #6298EA;
				text-align: right;
				text-decoration: underline;
			}
			.forbidden{
				color: lightgray;
			}
		}
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
