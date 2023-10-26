<template>
	<el-dialog v-model="dialogUserVisible" title='用户信息' width="500px" center draggable>
		<el-container>
			<el-aside width="200px">
				<el-avatar shape="square" :size="120" :src="userData.imageUrl" />
			</el-aside>
			<el-main>
				<div>账号：{{userData.account}}</div>
				<div>姓名：{{userData.name}}</div>
				<div>性别：{{userData.sex}}</div>
				<div>部门：{{userData.department}}</div>
				<div>邮箱：{{userData.email}}</div>
				<div>状态：
					<span v-if="userData.status==0">正常</span>
					<span v-else>冻结</span>
				</div>
			</el-main>
		</el-container>
		<el-footer>
			<span @click="openEdit(userData.id as number)">编辑</span>
			<span @click="openPromote(userData.id as number)">赋权</span>
			<span @click="openDelete(userData.id as number)">删除用户</span>
		</el-footer>
	</el-dialog>
	<promote ref="pro"></promote>
	<edit ref="edit_user"></edit>
	<remove ref="delete_user"></remove>
</template>

<script lang="ts" setup>
	import { reactive, ref,onBeforeUnmount } from 'vue'
	import {
		bus
	} from "@/utils/mitt.js"
	import promote from '../components/promote.vue'
	import edit from '../components/edit_user.vue'
	import remove from '../components/delete_admin.vue'
	bus.on('userId', (row : any) => {
		userData.id = row.id
		userData.imageUrl = row.imageUrl
		userData.account = row.account
		userData.name = row.name
		userData.sex = row.sex
		userData.email = row.email
		userData.department = row.department
		userData.status = row.status
	})

	const userData = reactive({
		id: null,
		imageUrl: '',
		account: null,
		name: '',
		sex: '',
		email: '',
		department: '',
		status: null,
	})
	bus.on('offDialog', (id : number) => {
		if (id) {
			dialogUserVisible.value = false
		}
	})
	// 对用户进行赋权
	const pro = ref()
	const openPromote = (id : number) => {
		bus.emit('promoteId', id)
		pro.value.open()
	}
	// 对用户进行编辑
	const edit_user = ref()
	const openEdit = (id : number) => {
		bus.emit('editId', id)
    edit_user.value.open()
	}
	// 删除用户
	const delete_user = ref()
	const openDelete = (id : number) => {
		let userInfo = {
			id:id,
			account:userData.account,
			name:userData.name
		}
		bus.emit('deleteUserId', userInfo)
    delete_user.value.open()
	}

	// 弹窗开关
	const dialogUserVisible = ref(false)

	// 打开编辑管理员的弹窗
	const open = () => {
		dialogUserVisible.value = true
	}

	defineExpose({
		open
	})

	onBeforeUnmount(()=>{
		bus.all.clear()
	})
</script>

<style lang="scss" scoped>
	.el-main>div {
		margin-bottom: 8px;
	}

	.el-main {
		--el-main-padding: 0px;
	}

	.el-footer {
		display: flex;
		justify-content: flex-end;
		--el-footer-height: 8px;

		span {
			margin-left: 8px;
			color: #409eff;
			cursor: pointer;
		}
	}
</style>
