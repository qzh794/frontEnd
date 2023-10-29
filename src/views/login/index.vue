<template>
	<div class="common-layout">
		<el-container>
			<el-header class="header-wrapped">
				<div class="header-content">
					<h3>通用后台管理系统</h3>
					<span class="welcome">欢迎您的登录</span>
				</div>
			</el-header>
			<el-main>
				<div class="login-wrapped">
					<el-card class="box-card">
						<el-tabs v-model="activeName" class="demo-tabs" :stretch='true'>
							<el-tab-pane label="登录" name="first">
								<el-form class="login-form">
									<el-form-item label="账号">
										<el-input v-model="loginData.account" placeholder="请输入账号" />
									</el-form-item>
									<el-form-item label="密码">
										<el-input v-model="loginData.password" placeholder="请输入密码" show-password />
									</el-form-item>
									<!-- 底部外壳 -->
									<div class="footer-wrapped">
										<div class="forget-password">
											<span class="forget-password-button" @click="openForget">忘记密码</span>
										</div>
										<div class="footer-button">
											<el-button type="primary" @click="Login">登录</el-button>
										</div>
										<div class="footer-go-register">
											还没有账号？<span class="go-register">马上注册</span>
										</div>
									</div>
								</el-form>
							</el-tab-pane>
							<el-tab-pane label="注册" name="second">
								<el-form class="login-form">
									<el-form-item label="账号">
										<el-input v-model="registerData.account" placeholder="账号长度6-12位" />
									</el-form-item>
									<el-form-item label="密码">
										<el-input v-model="registerData.password" placeholder="密码需长度6-12位含字母数字" />
									</el-form-item>
									<el-form-item label="确认密码">
										<el-input v-model="registerData.rePassword" placeholder="请再次输入密码" />
									</el-form-item>
									<div class="footer-button">
										<el-button type="primary" @click="Register">注册</el-button>
									</div>
								</el-form>
							</el-tab-pane>

						</el-tabs>
					</el-card>
				</div>
			</el-main>
			<el-footer class="footer-wrapped">
				<div class="footer-content">
					<div class="title">
						<span>阿里云博客专家</span> |
						<span>阿里云博客专家</span> |
						<span>阿里云博客专家</span>
					</div>
				</div>
			</el-footer>
		</el-container>
	</div>
	<forget ref='forgetP'></forget>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'
	import forget from './components/forget_password.vue'
	import {
		login, register
	} from '@/api/login'
	import { loginLog } from '@/api/log'
	import { useUserInfo } from '@/stores/userinfor'
  import {useMenu} from '@/stores/menu'
	const activeName = ref('first')
	const router = useRouter()
	const store = useUserInfo()
  const menuStore = useMenu()
	// 表单接口
	interface FormData {
		account : number|null;
		password : string;
    // 再次输入密码
		rePassword ?: string;
	}
	// 登录表单数据
	const loginData : FormData = reactive({
		account: null,
		password: '',
	})
	// 注册表单数据
	const registerData : FormData = reactive({
		account: null,
		password: '',
		rePassword: '',
	})
	// 登录
	const Login = async () => {
		const res = await login(loginData) as any
		console.log(res)
		if (res.message == "登录成功") {
			ElMessage({
				message: '登录成功',
				type: 'success',
			})
      const { id, name,account,email,department } = res.results
      const { token } = res
			localStorage.setItem('id', id)
			localStorage.setItem('token', token)
			localStorage.setItem('name', name)
			localStorage.setItem('department', department)
      await menuStore.setRouter()
			await loginLog(account,name,email)
			await store.userInfo(id)

			// 跳转
			await router.push('/home')
		} else {
			ElMessage.error('登录失败')
		}
	}


	// 注册
	const Register = async () => {
		if (registerData.password == registerData.rePassword) {
			const res = await register(registerData) as any
			if (res.message == "注册账号成功") {
				ElMessage({
					message: '注册成功',
					type: 'success',
				})
				activeName.value = 'first'
			} else {
				ElMessage.error('注册失败，请检查数据是否正确')
			}
		} else {
			ElMessage.error('注册失败')
		}
	}

	// 忘记密码弹窗
	const forgetP = ref()
	// 打开忘记密码弹窗
	const openForget = () => {
		forgetP.value.open()
	}
</script>

<style lang="scss" scoped>
	// 头部外壳
	.header-wrapped {

		// 头部内容
		.header-content {
			width: 1200px;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;

			// 欢迎语
			.welcome {
				font-size: 13px;
			}
		}
	}

	// 主体部分
	.el-main {
		background-image: url('@/assets/code.jpg');
		height: 600px;
		--el-main-padding: 0;

		// 登录外壳
		.login-wrapped {
			width: 1200px;
			height: 600px;
			margin: 0 auto;

			// 卡片样式
			.box-card {
				width: 350px;
				height: 375px;
				float: right;
				position: relative;
				top: 14%;

				.login-form {

					// 登录底部外壳
					.footer-wrapped {
						display: flex;
						flex-direction: column;

						.forget-password {
							display: flex;
							justify-content: flex-end;
							margin: 10px 0;

							.forget-password-button {
								font-size: 12px;
								color: #409eff;
								// 鼠标移入的效果
								cursor: pointer;
							}
						}


						.footer-go-register {
							font-size: 12px;
							margin: 12px 0;
							display: flex;
							justify-content: center;

							.go-register {
								font-size: 12px;
								color: #409eff;
								cursor: pointer;
							}
						}
					}

					// 底部登录按钮
					.footer-button {
						width: 100%;
						display: flex;
						justify-content: center;
					}
				}
			}
		}
	}

	// 底部外壳
	.footer-wrapped {
		margin-top: 10px;

		// 底部内容
		.footer-content {
			width: 1200px;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;

			// 底部介绍
			.title {
				color: #666;
			}

			span {
				color: #666;
				font-size: 12px;
			}
		}
	}

	// 表单边距
	.el-form {
		margin-top: 30px;
	}

	// tabs标签
	:deep(.el-tabs__item) {
		color: #333;
		font-size: 18px;
	}

	// 输入框高度
	:deep(.el-input__inner) {
		height: 40px;
	}

	// 输入框标签字体高度
	:deep(.el-form-item__label) {
		height: 40px;
		line-height: 40px;
	}

	// 登录按钮
	:deep(.el-button) {
		width: 300px;
		height: 45px;
		font-size: 16px;
	}
</style>
