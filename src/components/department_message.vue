<template>
	<el-dialog v-model="dialog" title="部门消息" width="912px" center destroy-on-close>
		<el-container>
			<el-aside width="416px">
				<div class="message-list-wrapped">
					<div class="list-table-content">
						<el-table :data="msgStore.msg_list.length >0 ? msgStore.msg_list : tableData"
							style="width: 100%;" highlight-current-row @row-click="getDetail">
							<el-table-column type="index" width="50" />
							<el-table-column width="5">
								<template #default='{ row}'>
									<div :class="idInList(row.id) ? 'readed' : 'noread'"></div>
								</template>
							</el-table-column>
							<el-table-column label="主题" prop="message_title">
								<template #default='{ row}'>
									<div class="title-wrapped">
										<div class="title">{{row.message_title}}</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="等级" prop="message_level">
								<template #default='{row}'>
									<el-tag class="mx-1" round
										v-if="row.message_level=='一般'">{{row.message_level}}</el-tag>
									<el-tag type="warning" class="mx-1" round
										v-if="row.message_level=='重要'">{{row.message_level}}</el-tag>
									<el-tag type="danger" class="mx-1" round
										v-if="row.message_level=='必要'">{{row.message_level}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="发布日期" prop="message_publish_time">
								<template #default='{row}'>
									<div>{{row.message_publish_time?.slice(0,10)}}</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-aside>
			<el-main>
				<div class="detail-wrapped" v-if="messageInfo.message_title!==''">
					<div>{{messageInfo.message_title}}</div>
					<div v-html="messageInfo.message_content"></div>
				</div>
				<div class="detail-wrapped" v-else>
					请点击列表中的消息进行查看
				</div>
			</el-main>
		</el-container>
	</el-dialog>
</template>

<script lang="ts" setup>
	import {
		reactive,
		ref,
	} from 'vue'
	import {
		getDepartmentMsg,
		getDepartmentMsgList,
		getReadListAndStatus,
		clickDelete
	} from '@/api/dep_msg'
	import { updateClick } from '@/api/message'
	import {
		useMsg
	} from '@/stores/message'
	const msgStore = useMsg()
	const tableData = ref([])

	const messageInfo = reactive({
		message_title: '',
		message_content: ''
	})
	// 当前未读消息
	const readList = ref<number[]>([])

	const getUserDepartmentMessage = async () => {
		const id = localStorage.getItem('id') as unknown as number
		const department = localStorage.getItem('department') as unknown as string
		if (department !== '') {
			const res = await getReadListAndStatus(id) as any
			tableData.value = await getDepartmentMsgList(department) as any
			if (res[0].read_status == 0) {
				const {
					read_list
				} = await getDepartmentMsg(id, department) as any
				readList.value = read_list
			} else {
				readList.value = JSON.parse(res[0].read_list)
			}
		}
	}
	getUserDepartmentMessage()


	const getDetail = async (row : any) => {
		await updateClick(row.message_click_number, row.id)
		await clickDelete(row.id, localStorage.getItem('id') as unknown as number)
		messageInfo.message_title = row.message_title
		messageInfo.message_content = row.message_content
		await getUserDepartmentMessage()
	}

	const idInList = (id : number) => {
		if (readList.value.indexOf(id) !== -1) {
			return 0
		} else {
			return 1
		}
	}
	// 弹窗默认为false
	const dialog = ref(false)
	// 暴露open
	const open = () => {
		dialog.value = true
	}
	defineExpose({
		open
	})
</script>

<style lang="scss" scoped>
	.el-aside {
		padding-left: 8px;
		min-height: 500px;
	}

	.el-main {
		min-height: 500px;
		--el-main-padding: 0px;
		border-left: 1px solid #eee;
	}

	.message-list-wrapped {
		height: 500px;
	}

	.list-table-content {
		min-height: 10px;
		padding: 8px;
	}

	.el-table {
		height: 100%;

		.title-wrapped {
			display: flex;
			align-items: center;
		}

		.title {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.readed {
		display: block;
		width: 5px;
		padding: 1px;
		height: 5px;
		border-radius: 50%;
		background: #A9A9A9;
	}

	.noread {
		display: block;
		width: 5px;
		padding: 1px;
		height: 5px;
		border-radius: 50%;
		background: #FFA500;
	}

	.detail-wrapped {
		padding: 8px;
	}
</style>
