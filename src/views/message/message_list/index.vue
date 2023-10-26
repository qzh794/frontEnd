<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<!-- wrapper -->
	<div class="module-common-wrapped">
		<div class="module-common-content">
			<el-tabs v-model="activeName" class="demo-tabs" >
				<el-tab-pane label="公告管理" name="first">
					<div class="pane-content">
						<div class="pane-top">
							<div class="module-common-header">
								<div class="search-wrapped">
									<el-select v-model="department" placeholder="请选择部门" @change="getListByDepartment">
										<el-option v-for="item in departmentData" :key="item" :label="item as string"
											:value="item" />
									</el-select>
									<el-radio-group v-model="radio2" class="ml-4" @change="getMessageListByLevel">
										<el-radio label="一般">一般</el-radio>
										<el-radio label="重要">重要</el-radio>
										<el-radio label="必要">必要</el-radio>
									</el-radio-group>
								</div>
								<div class="button-wrapped">
									<el-button type="primary" plain @click="getCompanyFirstPageList">全部公告</el-button>
									<el-button type="primary" @click="createMessage(1)">发布公告</el-button>
								</div>
							</div>
							<!-- 表格部分 -->
							<div class="module-common-table">
								<el-table :data="companyTableData" border style="width: 100%">
									<el-table-column type="index" width="50"></el-table-column>
									<el-table-column prop="message_title" label="公告主题" width="320" />
									<el-table-column prop="message_category" label="类别" />
									<el-table-column prop="message_publish_department" label="发布部门" />
									<el-table-column prop="message_publish_name" label="发布人" />
									<el-table-column prop="message_receipt_object" label="接收对象" />
									<el-table-column prop="message_level" label="公告等级" />
									<el-table-column prop="message_publish_time" label="发布时间" width="200">
										<template #default="{row}">
											<div>{{row.message_publish_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>
									<el-table-column prop="message_update_time" label="最新编辑时间" width="200">
										<template #default="{row}">
											<div>{{row.message_update_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>
									<el-table-column prop="message_click_number" label="阅读人数" />
									<el-table-column label="操作" width="200" fixed="right">
										<template #default="{row}">
											<div>
												<el-button type="success" @click="editMessage(row)">编辑</el-button>
												<el-button type="danger" @click="deleteMessage(row)">删除</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="table-footer">
							<el-pagination :page-size="1" :current-page="paginationData.companyCurrentPage"
                             :pager-count="7" :total="paginationData.companyTotal"
								:page-count="paginationData.companyPageCount"
								@current-change="companyCurrentChange" layout="prev, pager, next" />
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="系统消息" name="second">
					<div class="pane-content">
						<div class="pane-top">
							<div class="module-common-header">
								<div class="search-wrapped">
								</div>
								<div class="button-wrapped">
									<el-button type="primary" @click="createMessage(2)">发布系统消息</el-button>
								</div>
							</div>
							<!-- 表格部分 -->
							<div class="module-common-table">
								<el-table :data="systemTableData" border style="width: 100%">
									<el-table-column type="index" width="50"></el-table-column>
									<el-table-column prop="message_title" label="消息主题" />
									<el-table-column prop="message_publish_name" label="发布者" />
									<el-table-column prop="message_click_number" label="阅读人数" />
									<el-table-column prop="message_publish_time" label="发布时间" width="200">
										<template #default="{row}">
											<div>{{row.message_publish_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>


									<el-table-column label="操作" width="200" fixed="right">
										<template #default="{row}">
											<div>
												<el-button type="success" @click="editSystemMessage(row)">编辑</el-button>
												<el-button type="danger" @click="deleteMessage(row.id)">删除</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="table-footer">
							<el-pagination :page-size="1" :current-page="paginationData.systemCurrentPage"
								:pager-count="7" :total="paginationData.systemTotal"
								:page-count="paginationData.systemCount"
								@current-change="systemCurrentChange" layout="prev, pager, next" />
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
	<createEdit ref="cre" @success='changeTwoPageList'></createEdit>
	<deleteM ref="delete_msg" @success='changeTwoPageList'></deleteM>
</template>

<script lang='ts' setup>
	import {
		ref,
		reactive
	} from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import {
		searchMessageBydepartment,
		searchMessageByLevel,
		getCompanyMessageLength,
		getSystemMessageLength,
		returnCompanyListData,
		returnSystemListData,
	} from '@/api/message'
	import {
		getDepartment
	} from '@/api/setting'
	import {
		bus
	} from "@/utils/mitt.js"
	import createEdit from '../components/create_edit.vue'
	import deleteM from '../components/delete.vue'
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '消息管理',
		second: '消息列表'
	})
  const activeName = ref('first')

	const department = ref<string>()
	// 部门数据
	const departmentData = ref<object[]>([])
  // 公司公告表格数据
  const companyTableData = ref<object[]>([])
  // 系统消息表格数据
  const systemTableData = ref<object[]>([])
	const getDepartmentList = async () => {
		departmentData.value = await getDepartment() as any
	}
	getDepartmentList()

	// 根据部门进行筛选
	const getListByDepartment = async () =>{
		companyTableData.value = await searchMessageBydepartment(department.value as string) as any
	}
	// 根据消息等级进行筛选
	const radio2 = ref()

	const getMessageListByLevel = async () =>{
		companyTableData.value = await searchMessageByLevel(radio2.value) as any
	}

	// 分页数据
	const paginationData = reactive({
		// 公司公告总数
		companyTotal: 1,
		// 公司公告列表总页数
		companyPageCount: 1,
		// 公司公告列表当前所处页数
		companyCurrentPage: 1,
		// 系统消息总数
		systemTotal: 1,
		// 系统消息总页数
		systemCount: 1,
		// 系统消息当前所处页数
		systemCurrentPage: 1,
	})
	// 获取公司公告列表的页数
	const getCompanyListLength = async () => {
		const res = await getCompanyMessageLength() as any
		paginationData.companyTotal = res.length
		paginationData.companyPageCount = Math.ceil(res.length / 10)
	}
	getCompanyListLength()
	// 获取系统消息列表的页数
	const getSystemListLength = async () => {
		const res = await getSystemMessageLength() as any
		paginationData.systemTotal = res.length
		paginationData.systemCount = Math.ceil(res.length / 10)
	}
	getSystemListLength()
	// 默认获取公司公告列表第一页的数据
	const getCompanyFirstPageList = async () => {
		companyTableData.value = await returnCompanyListData(1) as any
	}
	getCompanyFirstPageList()
	// 默认获取系统消息第一页的数据
	const getSystemFirstPageList = async () => {
		systemTableData.value = await returnSystemListData(1) as any
	}
	getSystemFirstPageList()

	// 更新公司公告列表及系统消息列表的第一页数据
	const changeTwoPageList = () => {
		getCompanyFirstPageList()
		getSystemFirstPageList()
	}

	// 公司公告列表监听换页
	const companyCurrentChange = async (value: number) => {
		paginationData.companyCurrentPage = value
		companyTableData.value = await returnCompanyListData(paginationData.companyCurrentPage) as any
	}

	// 系统消息列表监听换页
	const systemCurrentChange = async (value: number) => {
		paginationData.systemCurrentPage = value
		systemTableData.value = await returnSystemListData(paginationData.systemCurrentPage) as any
	}

	// 发布公告/编辑公告
	const cre = ref()
	const createMessage = (id: number) => {
		bus.emit('createMessage', id)
		cre.value.open()
	}

	const editMessage = (row: any) => {
		bus.emit('editMessage', row)
		cre.value.open()
	}

	const editSystemMessage = (row: any) => {
		bus.emit('editSystemMessage', row)
		cre.value.open()
	}

	const delete_msg = ref()
	// 删除公司公告/系统消息
	const deleteMessage = (row: any) => {
		bus.emit('deleteMessageId', row)
		delete_msg.value.open()
	}
</script>

<style lang="scss" scoped>
	.el-radio-group {
		margin-left: 20px;
	}

	:deep(.el-table .cell) {
		font-weight: 400;
	}
</style>
