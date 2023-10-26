<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<div class="table-wrapped">
		<div class="table-top">
			<div class="table-header">
				<div>
					<el-input v-model="account" class="w-50 m-2" size="large" placeholder="输入账号进行搜索" @change="searchLoginAccount()" clearable @clear="getLoginFirstPageList" >
            <template #prefix>
              <Search />
            </template>
          </el-input>
				</div>
				<div class="upload-wrapped">
					<el-button type="danger" @click="clearList">清空操作日志</el-button>
				</div>
			</div>
			<div class="table-content">
				<el-table :data='tableData' style="width: 100%;">
					<el-table-column type="index" width="50"></el-table-column>
					<el-table-column prop="account" label="账号" />
					<el-table-column prop="name" label="名字" />
					<el-table-column prop="email" label="联系方式">
					</el-table-column>
					<el-table-column prop="login_time" label="登录时间" width="200">
						<template #default="{row}">
							<div>{{row.login_time?.slice(0,16)}}</div>
						</template>
					</el-table-column>

				</el-table>
			</div>
		</div>
		<div class="table-footer">
			<el-pagination :page-size="1" :current-page="paginationData.loginCurrentPage" :pager-count="7"
				:total="paginationData.loginTotal" :page-count="paginationData.loginPageCount"
				@current-change="loginCurrentChange" layout="prev, pager, next" />
		</div>
	</div>
	<tips ref="tip" @success='getLoginFirstPageList'></tips>
</template>

<script lang='ts' setup>
	import {
		ref,
		reactive
	} from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import tips from './components/tips.vue'
	import {
		loginLogListLength,
		returnLoginListData,
		searchLoginLogList
	} from '@/api/log'
	import {
		Search
	} from '@element-plus/icons-vue'
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '登录日志',
		second: ''
	})

	// 登录次数表格数据
	const tableData = ref<any[]>([])

	// 分页数据
	const paginationData = reactive({
		// 登录次数总数
		loginTotal: 1,
		// 登录次数列表总页数
		loginPageCount: 1,
		// 登录次数列表当前所处页数
		loginCurrentPage: 1,
	})
	// 获取登录次数列表的页数
	const getLoginListLength = async () => {
		const res = await loginLogListLength() as any
		paginationData.loginTotal = res.length
		paginationData.loginPageCount = Math.ceil(res.length / 10)
	}
	getLoginListLength()
	// 默认获取登录次数列表第一页的数据
	const getLoginFirstPageList = async () => {
		tableData.value = await returnLoginListData(1) as any
	}
	getLoginFirstPageList()


	// 登录次数列表监听换页
	const loginCurrentChange = async (value: number) => {
		paginationData.loginCurrentPage = value
		tableData.value = await returnLoginListData(paginationData.loginCurrentPage) as any
	}
	const account = ref()
	// 搜索之后函数
	const searchLoginAccount = async () => {
		tableData.value = await searchLoginLogList(account.value) as any
	}

	const tip = ref()
	const clearList = () => {
		tip.value.open()
	}
</script>

<style lang="scss" scoped>
	:deep(.el-table .cell) {
		font-weight: 400;
	}

	a {
		color: #fff;
		display: block;
		text-decoration: none;
	}
</style>
