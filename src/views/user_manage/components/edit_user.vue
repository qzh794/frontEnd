<template>
	<el-dialog v-model="dialogFormVisible" title='编辑用户信息' width="600px" align-center draggable>
		<div class="dialog-content">
			<el-form ref="ruleFormRef" :model="formDataInfo" :rules="rules" label-width="100px">
				<el-form-item label="账号" prop="account">
					<el-input v-model="formDataInfo.account" disabled />
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="formDataInfo.name" />
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="formDataInfo.sex" placeholder="请选择性别">
						<el-option label="男" value="男" />
						<el-option label="女" value="女" />
					</el-select>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="formDataInfo.email" />
				</el-form-item>
				<el-form-item label="部门" prop="department">
					<el-select v-model="formDataInfo.department" placeholder="请选择部门">
						<el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="edit">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { reactive, ref, onBeforeUnmount } from 'vue'
	import {
		bus
	} from "@/utils/mitt.js"
	import { editAdmin,getUserInfo } from '@/api/userinfor.js'
	import { getDepartment } from '@/api/setting'
	import { ElMessage } from 'element-plus'
	bus.on('editId', async (id : number) => {
		const res = await getUserInfo(id) as any
		formDataInfo.id = id
		formDataInfo.account = res.account
		formDataInfo.name = res.name
		formDataInfo.sex = res.sex
		formDataInfo.email = res.email
		formDataInfo.department = res.department
	})
	// 部门数据
	const departmentData = ref([])
	const getDepartmentData = async () => {
		departmentData.value = await getDepartment() as any
	}
	getDepartmentData()
	interface FormData {
		id:number|null,
		account : number|null,
		name : string,
		sex : string,
		email : string,
		department : string
	}

	const formDataInfo : FormData = reactive({
		id: null,
		account: null,
		name: '',
		sex: '',
		email: '',
		department: '',
		identity: '用户'
	})

	const rules = reactive({
		name: [
			{ required: true, message: '请输入要修改的名字', trigger: 'blur' },
		],
		sex: [
			{ required: true, message: '请输入要修改的性别', trigger: 'blur' },
		],
		email: [
			{ required: true, message: '请输入要修改的邮箱', trigger: 'blur' },
		],
		department: [
			{ required: true, message: '请输入要修改的部门', trigger: 'blur' },
		],
	})
	// 编辑用户
	const edit = async () => {
		const res = await editAdmin(formDataInfo)
		if (res.status == 0) {
			ElMessage({
				message: '编辑用户信息成功',
				type: 'success',
			})
			bus.emit('offDialog',1)
			dialogFormVisible.value = false
		} else {
			ElMessage.error('编辑用户信息失败')
			dialogFormVisible.value = false
		}
	}
	// 弹窗开关
	const dialogFormVisible = ref(false)

	// 打开编辑管理员的弹窗
	const open = () => {
		dialogFormVisible.value = true
	}

	defineExpose({
		open
	})

	onBeforeUnmount(() => {
		bus.all.clear()
	})
</script>

<style lang="scss" scoped>
	.dialog-content {
		display: flex;
		padding: 20px 30px;
	}

	:deep(.el-form-item) {
		margin: 30px;
	}
</style>
