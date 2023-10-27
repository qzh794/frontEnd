<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<div class="table-wrapped">
		<!-- 顶部 -->
		<div class="table-top">
			<!-- 表格顶部 -->
			<div class="table-header">
				<!-- 搜索框 -->
				<div class="search-wrapped">
					<el-input v-model="adminAccount" class="w-50 m-2" size="large" placeholder="输入账号进行搜索"
						 @change='searchAdmin()' >
            <template #prefix>
              <Search />
            </template>
          </el-input>
				</div>
				<div class="button-wrapped">
					<el-button type="primary" @click="openCreate(2)">添加用户管理员</el-button>
				</div>
			</div>
			<!-- 表格内容 -->
			<div class="table-content">
				<el-table :data="tableData" style="width: 100%" border>
					<el-table-column type="index" width="50" />
					<el-table-column prop="account" label="账号" />
					<el-table-column prop="name" label="姓名" />
					<el-table-column prop="department" label="部门" />
					<el-table-column prop="email" label="邮箱" />
					<el-table-column label="操作">
						<template #default="{row}">
							<div>
								<el-button type="success" @click="openEdit(row.id)">编辑</el-button>
								<el-button type="danger" @click="openDelete(row.id)">删除</el-button>
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
  <createA ref="create_admin"></createA>
  <editA ref='edit_admin'></editA>
  <deleteA ref="delete_admin"></deleteA>
</template>

<script lang="ts" setup>
	import {
		ref, reactive,onBeforeUnmount
	} from 'vue'
	import { Search } from '@element-plus/icons-vue'
	import breadCrumb from '@/components/bread_crumb.vue'
  import createA from '../components/create_admin.vue'
  import editA from '../components/edit_admin.vue'
	import deleteA from '../components/delete_admin.vue'
	import { searchUser, getAdminListLength, returnListData } from '@/api/userinfor'
	import {
		bus
	} from "@/utils/mitt"
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '用户管理',
		second:'用户管理员'
	})
	const adminAccount = ref<number>()

	// 表格内容
	const tableData = ref()
	// 搜索函数
	const searchAdmin = async () => {
		tableData.value = await searchUser(adminAccount.value as number,'用户管理员') as any
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
		const res = await getAdminListLength('用户管理员') as any
		adminTotal.value = res.length
		paginationData.pageCount = Math.ceil(res.length / 10)
	}
	returnAdminListLength()
	// 默认获取第一页的数据据
	const getFirstPageList = async () => {
		tableData.value = await returnListData(1, '用户管理员')
	}
	getFirstPageList()
	// 监听换页
	const currentChange = async (value : number) => {
		paginationData.currentPage = value
		tableData.value = await returnListData(paginationData.currentPage, '用户管理员')
	}

	bus.on('adminDialogOff', async (id : number) => {
		// 当前页数
		const current = paginationData.currentPage
		// 1为创建管理员
		if (id == 1) {
			await getFirstPageList()
		}
		// 2为编辑管理员
		if (id == 2) {
			tableData.value = await returnListData(paginationData.currentPage, '用户管理员')
		}
		// 3为对管理员进行降职
		if (id == 3) {
			tableData.value = await returnListData(paginationData.currentPage, '用户管理员')
			if (tableData.value.length == 0) {
				paginationData.currentPage = current - 1
				await returnAdminListLength()
			}
		}
	})
	// 新建管理员
	const create_admin = ref()
	const openCreate = (id : number) => {
		bus.emit('createId', id)
    create_admin.value.open()
	}

	// 编辑管理员
	const edit_admin = ref()
	const openEdit = (id : number) => {
		bus.emit('editId', id)
    edit_admin.value.open()
	}
	// 降级管理员
	const delete_admin = ref()
	const openDelete = (id : number) => {
		bus.emit('deleteId', id)
    delete_admin.value.open()
	}

	onBeforeUnmount(() => {
		bus.all.clear()
	})
</script>

<style lang='scss' scoped>
</style>
