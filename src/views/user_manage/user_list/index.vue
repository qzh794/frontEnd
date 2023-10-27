<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<div class="table-wrapped">
		<!-- 顶部 -->
		<div class="table-top">
			<!-- 表格顶部 -->
			<div class="table-header">
				<!-- 搜索框 -->
				<div class="left-wrapped">
					<div class="search-wrapped">
						<el-input v-model="adminAccount" class="w-50 m-2" size="large" placeholder="输入账号进行搜索"
							 @change='searchUserByAccount()' >
              <template #prefix>
                <Search />
              </template>
            </el-input>
					</div>
					<div class="select-wrapped">
						<el-select v-model="department" placeholder="请选择部门" clearable @change="searchForDepartment"
							@clear="clearOperation">
							<el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
						</el-select>
					</div>
				</div>
				<div class="button-wrapped">
					<el-button plain type="primary" @click="banUserList">筛选冻结用户</el-button>
					<el-button plain type="primary" @click="getFirstPageList">显示全部用户</el-button>
				</div>
			</div>
			<!-- 表格内容 -->
			<div class="table-content">
				<el-table :data="tableData" style="width: 100%" border @row-dblclick='openUser'>
					<el-table-column type="index" width="50" />
					<el-table-column prop="account" label="账号" />
					<el-table-column prop="name" label="姓名" />
					<el-table-column prop="sex" label="性别" />
					<el-table-column prop="department" label="部门" />
					<el-table-column prop="email" label="邮箱" />
					<el-table-column prop="status" label="状态">
						<template #default="{row}">
							<div>
								<el-tag v-if="row.status=='1'" class="ml-2">冻结</el-tag>
								<el-tag class="ml-2" type="success" v-else>正常</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="创建时间">
						<template #default="{row}">
							<div>{{row.create_time?.slice(0,10)}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="update_time" label="更新时间">
						<template #default="{row}">
							<div>{{row.update_time?.slice(0,10)}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template #default="{row}">
							<div>
								<el-button type="primary" @click="banUserById(row.id)"
									:disabled='row.status==1'>冻结</el-button>
								<el-button type="success" @click="hotUserById(row.id)"
									:disabled='row.status==0'>解冻</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 底部 -->
		<div class="table-footer">
			<el-pagination :page-size="1" :current-page="paginationData.currentPage" :pager-count="7"
				:total="adminTotal" :page-count="paginationData.pageCount" @current-change="currentChange"
				layout="prev, pager, next" />
		</div>
	</div>
	<userinfo ref="user_info"></userinfo>
</template>

<script lang="ts" setup>
	import {
		ref, reactive,onBeforeUnmount
	} from 'vue'
	import { Search } from '@element-plus/icons-vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import userinfo from '../components/user_infor.vue'
	import {
		bus
	} from "@/utils/mitt"
	import {
		searchUser, searchDepartment,
		getAdminListLength, returnListData, getBanList, banUser, hotUser
	} from '@/api/userinfor.js'
	import { getDepartment } from '@/api/setting'
	import { ElMessage } from 'element-plus'

	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '用户管理',
		second:'用户列表'
	})
	// 搜索框的modelValue
	const adminAccount = ref<number>()
	// 表格内容
	const tableData = ref<object[]>([])

	// 通过账号进行搜索
	const searchUserByAccount = async () => {
		tableData.value = await searchUser(adminAccount.value as number,'用户') as any
	}
	// 部门数据
	const departmentData = ref([])
	const getDepartmentData = async () => {
		departmentData.value = await getDepartment() as any
	}
	getDepartmentData()
	// 部门
	const department = ref()
	const searchForDepartment = async () => {
		tableData.value = await searchDepartment(department.value) as any
	}
	// 清空选择框
	const clearOperation = () => {
		getFirstPageList()
	}

	// 分页数据
	const paginationData = reactive({
		// 总页数
		pageCount: 1,
		// 当前所处页数
		currentPage: 1,
	})
	const adminTotal = ref<number>(0)
	// 获取管理员的数量
	const returnAdminListLength = async () => {
		const res = await getAdminListLength('用户') as any
		adminTotal.value = res.length
		paginationData.pageCount = Math.ceil(res.length / 10)
	}
	returnAdminListLength()
	// 默认获取第一页的数据
	const getFirstPageList = async () => {
		tableData.value = await returnListData(1, '用户') as any
	}
	getFirstPageList()
	// 监听换页
	const currentChange = async (value : number) => {
		paginationData.currentPage = value
		tableData.value = await returnListData(value, '用户') as any
	}


	// 筛选冻结用户
	const banUserList = async () => {
		tableData.value = await getBanList() as any
	}

	// 冻结用户
	const banUserById = async (id : number) => {
		const res = await banUser(id)
		if (res.status == 0) {
			ElMessage({
				message: '冻结用户成功',
				type: 'success',
			})
			tableData.value = await returnListData(paginationData.currentPage, '用户') as any
		} else {
			ElMessage.error('冻结用户失败')
		}
	}

	// 解冻用户
	const hotUserById = async (id : number) => {
		const res = await hotUser(id)
		if (res.status == 0) {
			ElMessage({
				message: '解冻用户成功',
				type: 'success',
			})
			tableData.value = await returnListData(paginationData.currentPage, '用户') as any
		} else {
			ElMessage.error('解冻用户失败')
		}
	}


	const user_info = ref()
	const openUser = (row : any) => {
		bus.emit('userId', row)
    user_info.value.open()
	}

	bus.on('offDialog', async (id : number) => {
		// 当前页数
		const current = paginationData.currentPage
		if (id) {
			tableData.value = await returnListData(paginationData.currentPage, '用户') as any
			if (tableData.value.length == 0) {
				paginationData.currentPage = current - 1
				await returnAdminListLength()
			}
		}
	})

	onBeforeUnmount(() => {
		bus.all.clear()
	})
</script>

<style lang='scss' scoped>
</style>
