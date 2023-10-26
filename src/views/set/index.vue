<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<!-- 外壳 -->
	<div class="common-wrapped">
		<!-- 内容 -->
		<div class="common-content">
			<el-tabs v-model="activeName" class="demo-tabs">
				<el-tab-pane label="账号详情" name="first">
					<div class="account-info-wrapped">
						<span>用户头像：</span>
						<div class="account-info-content">
							<!-- action 是上传头像的接口 -->
							<el-upload class="avatar-uploader" action="http://127.0.0.1:3007/user/uploadAvatar"
								:show-file-list="false" :on-success="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload">
								<img v-if="userStore.imageUrl" :src="userStore.imageUrl" class="avatar" alt="用户头像"/>
								<el-icon v-else class="avatar-uploader-icon">
									<Plus />
								</el-icon>
							</el-upload>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户账号：</span>
						<div class="account-info-content">
							<el-input v-model="userData.account" disabled></el-input>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户密码：</span>
						<div class="account-info-content">
							<el-button type="primary" @click="openChangePassword">修改密码</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户姓名：</span>
						<div class="account-info-content">
							<el-input v-model="userData.name"></el-input>
						</div>
						<div class="account-save-button">
							<el-button type="primary" @click="saveName">保存</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户性别：</span>
						<div class="account-info-content">
							<el-select v-model="userData.sex">
								<el-option label="男" value="男" />
								<el-option label="女" value="女" />
							</el-select>
						</div>
						<div class="account-save-button">
							<el-button type="primary" @click="saveSex">保存</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户身份：</span>
						<div class="account-info-content">
							<el-input v-model="userData.identity" disabled></el-input>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户部门：</span>
						<div class="account-info-content">
							<el-input v-model="userData.department" disabled></el-input>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>用户邮箱：</span>
						<div class="account-info-content">
							<el-input v-model="userData.email"></el-input>
						</div>
						<div class="account-save-button">
							<el-button type="primary" @click="saveEmail">保存</el-button>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="公司信息" name="second">
					<div class="account-info-wrapped">
						<span>公司名称</span>
						<div class="account-info-content">
							<el-input v-model="companyName"></el-input>
						</div>
						<div class="account-save-button">
							<el-button type="primary" @click="resetCompanyName">编辑公司名称</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>公司介绍</span>
						<div class="account-info-content">
							<el-button type="success" @click="openEditor(1)">编辑公司介绍</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>公司架构</span>
						<div class="account-info-content">
							<el-button type="success" @click="openEditor(2)">编辑公司介绍</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>公司战略</span>
						<div class="account-info-content">
							<el-button type="success" @click="openEditor(3)">编辑公司介绍</el-button>
						</div>
					</div>
					<div class="account-info-wrapped">
						<span>公司高层</span>
						<div class="account-info-content">
							<el-button type="success" @click="openEditor(4)">编辑公司介绍</el-button>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="首页管理" name="third">
					<div class="home-wrapped">
						<!-- 提示 -->
						<div class="tips">
							<span>
								提示: 点击图片框进行切换首页轮播图
							</span>
						</div>
						<!-- 轮播图 -->
						<div class="swiper-wrapped" v-for="(item,index) in swiperData" :key="index">
							<div class="swiper-name">轮播图{{index+1}}:&nbsp;&nbsp;</div>
							<el-upload class="avatar-uploader" action="http://127.0.0.1:3007/set/uploadSwiper"
								:show-file-list="false" :on-success="handleSwiperSuccess"
								:before-upload="beforeAvatarUpload" :data='item'>
								<template #trigger>
									<img v-if="imageUrl[index]" :src="imageUrl[index]" class="swiper" alt="轮播图"/>
									<img src="@/assets/雪碧图.png" alt="" v-else>
								</template>
							</el-upload>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="其他设置" name="fourth">
					<div class="other-set">
						<div class="department-set">
							<span>部门设置</span>
							<el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable
								:disable-transitions="false" @close="handleClose(tag)">
								{{ tag }}
							</el-tag>
							<el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20"
								size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
							<el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
								+ 添加部门
							</el-button>
						</div>
						<div class="product-set">
							<span>产品设置</span>
							<el-tag v-for="tag in dynamicProductTags" :key="tag" class="mx-1" closable
								:disable-transitions="false" @close="handleProductClose(tag)">
								{{ tag }}
							</el-tag>
							<el-input v-if="inputProductVisible" ref="InputProductRef" v-model="inputProductValue"
								class="ml-1 w-20" size="small" @keyup.enter="handleInputProductConfirm"
								@blur="handleInputProductConfirm" />
							<el-button v-else class="button-new-tag ml-1" size="small" @click="showProductInput">
								+ 添加产品
							</el-button>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
	<!-- 修改密码弹窗 -->
	<change ref="changeP"></change>
	<editor ref="editorP"></editor>
</template>

<script lang='ts' setup>
	import {
		onMounted,
		reactive,
		ref,
		nextTick,
		toRaw
	} from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import {
		ElInput
	} from 'element-plus'
	import {
		ElMessage
	} from 'element-plus'
	import {
		Plus
	} from '@element-plus/icons-vue'
	import change from './components/change_password.vue'
	import editor from './components/editor.vue'
	import {
		bus
	} from "@/utils/mitt"
	import {
		bind,
		changeName,
		changeSex,
		changeEmail,
		getUserInfo
	} from '@/api/userinfor'
	import {
		getCompanyName,
		changeCompanyName,
		getAllSwiper,
		setDepartment,
		getDepartment,
		setProduct,
		getProduct
	} from '@/api/setting'
	import {
		useUserInfo
	} from '@/stores/userinfor'
	const userStore = useUserInfo()

	onMounted(async () => {
		let id = localStorage.getItem('id') as unknown as number
		const res = await getUserInfo(id) as any
		userData.account = res.account
		userData.name = res.name
		userData.sex = res.sex
		userData.identity = res.identity
		userData.department = res.department
		userData.email = res.email
	})

	const changeP = ref()
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '系统设置',
	})
	// 默认打开的标签页
	const activeName = ref('first')

	interface user {
		account: number|null,
		name: string,
		sex: string,
		identity: string,
		department: string,
		email: string
	}

	const userData: user = reactive({
		account: null,
		name: '',
		sex: '',
		identity: '',
		department: '',
		email: ''
	})


	// 头像上传成功的函数 response回应
	const handleAvatarSuccess = (
		response:any
	) => {
		// imageUrl.value = URL.createObjectURL(uploadFile.raw!)
		if (response.status == 0) {
			userStore.$patch({
				imageUrl: response.url
			})
			ElMessage({
				message: '更新头像成功',
				type: 'success',
			});
			(async () => {
				const res = await bind( localStorage.getItem('account') as unknown as number, response.onlyId, response.url)
				console.log(res)
			})()
		} else {
			ElMessage.error('更新头像失败！请重新上传')
		}
	}
	// 头像上传之前的函数
	const beforeAvatarUpload = (rawFile:any) => {
		if (rawFile.type !== 'image/jpeg') {
			ElMessage.error('头像必须是jpg格式！')
			return false
		} else if (rawFile.size / 1024 / 1024 > 2) {
			ElMessage.error('头像必须小于2MB!')
			return false
		}
		return true
	}
	// 打开密码弹窗
	const openChangePassword = () => {
		changeP.value.open()
	}
	// 保存姓名
	const saveName = async () => {
		const res = await changeName(userData.name, localStorage.getItem('id') as unknown as number)
		if (res.status == 0) {
			ElMessage({
				message: '修改成功',
				type: 'success',
			})
		} else {
			ElMessage.error('修改姓名失败，请重新输入！')
		}
	}

	// 保存性别
	const saveSex = async () => {
		const res = await changeSex(userData.sex, localStorage.getItem('id') as unknown as number)
		if (res.status == 0) {
			ElMessage({
				message: '修改成功',
				type: 'success',
			})
		} else {
			ElMessage.error('修改性别失败，请重新输入！')
		}
	}

	// 保存邮箱
	const saveEmail = async () => {
		const res = await changeEmail(userData.email, localStorage.getItem('id') as unknown as number)
		if (res.status == 0) {
			ElMessage({
				message: '修改成功',
				type: 'success',
			})
		} else {
			ElMessage.error('修改邮箱失败，请重新输入！')
		}
	}

	// 公司信息
	// 公司名称
	const companyName = ref()
	// 获取公司名字
	const returnCompanyName = async () => {
		companyName.value = await getCompanyName()
	}
	returnCompanyName()

	// 修改公司名字
	const resetCompanyName = async () => {
		const res = await changeCompanyName(companyName.value)
		if (res.status == 0) {
			ElMessage({
				message: '修改公司名称成功',
				type: 'success',
			})
		} else {
			ElMessage.error('修改公司名称失败，请重新输入！')
		}
	}

	const editorP = ref()
	// 打开富文本
	const openEditor = (id: number) => {
		// 第一个参数是 标记,第二个参数要传入的值
		bus.emit('editorTitle', id)
		editorP.value.open()
	}

	// 首页管理
	const swiperData = [{
		name: 'swiper1'
	}, {
		name: 'swiper2'
	}, {
		name: 'swiper3'
	}, {
		name: 'swiper4'
	}, {
		name: 'swiper5'
	}, {
		name: 'swiper6'
	}]

	// 上传轮播图成功
	const handleSwiperSuccess = () => {
		returnAllSwiper()
	}
	// 轮播图
	const imageUrl = ref<string[]>([])
	// 获取轮播图
	const returnAllSwiper = async () => {
    imageUrl.value = await getAllSwiper() as any
	}
	returnAllSwiper()


	// 其他设置
	// setDepartment
	// getDepartment
	// 部门设置
	const inputValue = ref('')
	const dynamicTags = ref()
	const inputVisible = ref(false)
	const InputRef = ref < InstanceType < typeof ElInput >> ()
	// 产品设置
	const inputProductValue = ref('')
	const dynamicProductTags = ref()
	const inputProductVisible = ref(false)
	const InputProductRef = ref < InstanceType < typeof ElInput >> ()
	// 获取部门数据
	const getDepartmentData = async () => {
		dynamicTags.value = await getDepartment()
	}
	getDepartmentData()
	// 获取产品数据
	const getProductData = async () => {
		dynamicProductTags.value = await getProduct()
	}
	getProductData()
	// 部门设置关闭时的函数
	const handleClose = async (tag: string) => {
		dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
		const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
		if (res.status == 0) {
			ElMessage({
				message: '删除部门成功',
				type: 'success',
			})
		} else {
			ElMessage.error('删除部门失败，请重新输入！')
		}
	}
	// 产品设置关闭时的函数
	const handleProductClose = async (tag: string) => {
		dynamicProductTags.value.splice(dynamicProductTags.value.indexOf(tag), 1)
		const res = await setProduct(JSON.stringify(toRaw(dynamicProductTags.value)))
		if (res.status == 0) {
			ElMessage({
				message: '删除产品成功',
				type: 'success',
			})
		} else {
			ElMessage.error('删除产品失败，请重新输入！')
		}
	}
	// 点击部门按钮出现输入框
	const showInput = () => {
		inputVisible.value = true
		nextTick(() => {
			InputRef.value!.input!.focus()
		})
	}
	// 点击产品按钮出现输入框
	const showProductInput = () => {
		inputProductVisible.value = true
		nextTick(() => {
			InputProductRef.value!.input!.focus()
		})
	}
	// 输入数据后的一个函数 部门
	const handleInputConfirm = async () => {
		if (inputValue.value) {
			dynamicTags.value.push(inputValue.value)
			const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
			if (res.status == 0) {
				ElMessage({
					message: '添加部门设置成功',
					type: 'success',
				})
			} else {
				ElMessage.error('添加部门失败，请重新输入！')
			}
		}
		inputVisible.value = false
		inputValue.value = ''
	}
	// 输入数据后的一个函数 产品
	const handleInputProductConfirm = async () => {
		if (inputProductValue.value) {
			dynamicProductTags.value.push(inputProductValue.value)
			const res = await setProduct(JSON.stringify(toRaw(dynamicProductTags.value)))
			if (res.status == 0) {
				ElMessage({
					message: '添加产品设置成功',
					type: 'success',
				})
			} else {
				ElMessage.error('添加产品失败，请重新输入！')
			}
		}
		inputProductVisible.value = false
		inputProductValue.value = ''
	}
</script>

<style lang="scss" scoped>
	// 外壳
	.common-wrapped {
		padding: 8px;
		background: #f5f5f5;
		// 计算 减去了头部还有面包屑 + 2X8=16边距
		height: calc(100vh - 101px);

		// 内容
		.common-content {
			padding: 0 10px;
			height: 100%;
			background: #fff;

			// 账号信息外壳
			.account-info-wrapped {
				display: flex;
				align-items: center;
				padding-left: 50px;
				margin-bottom: 24px;
				font-size: 14px;

				// 账号信息内容
				.account-info-content {
					margin-left: 24px;
					margin-right: 16px;
				}

				// 按钮
				.account-save-button {
					margin-left: 16px;
				}
			}

			// 首页管理外壳
			.home-wrapped {
				padding-left: 50px;
				display: flex;
				flex-direction: column;

				// 提示
				.tips {
					display: flex;
					align-items: center;
					margin-bottom: 8px;

					span {
						font-size: 14px;
						color: silver;
					}
				}

				// 轮播图
				.swiper-wrapped {
					display: flex;
					margin-bottom: 16px;

					// 轮播图名字
					.swiper-name {
						font-size: 14px;
						margin-bottom: 24px;
					}

					.swiper {
						width: 336px;
						height: 96px;

					}
				}
			}
		}
	}

	// 其他设置
	.other-set {
		padding-left: 50px;
		font-size: 14px;

		.department-set {
			margin-bottom: 24px;

			span {
				margin-right: 24px;
			}
		}

		.product-set {

			span {
				margin-right: 24px;
			}
		}
	}

	// 标签页
	.demo-tabs>.el-tabs__content {
		padding: 32px;
		color: #6b778c;
		font-size: 32px;
		font-weight: 600;
	}

	// 上传头像
	.avatar-uploader .avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	// 输入框的长度
	:deep(.el-input) {
		width: 240px;
	}
</style>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: var(--el-transition-duration-fast);
	}

	.avatar-uploader .el-upload:hover {
		border-color: var(--el-color-primary);
	}

	.el-icon.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		text-align: center;
	}
</style>
