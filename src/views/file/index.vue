<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<div class="table-wrapped">
		<div class="table-top">
			<div class="table-header">
				<div></div>
				<div class="upload-wrapped">
					<el-upload v-model:file-list="fileList" class="upload-demo"
						action="http://127.0.0.1:3007/file/uploadFile" multiple :limit='3' :on-exceed='handleExceed'
						:on-success="handleSuccess" :show-file-list='false'>
						<el-button type="primary">上传文件</el-button>
					</el-upload>
				</div>
			</div>
			<div class="table-content">
				<el-table :data='tableData' style="width: 100%;">
					<el-table-column type="index" width="50"></el-table-column>
					<el-table-column prop="file_name" label="文件名" />
					<el-table-column prop="file_size" label="文件大小" >
						<template #default="{row}">
							<div>{{row.file_size?.slice(0,2)}}KB</div>
						</template>
					</el-table-column>
					<el-table-column prop="upload_person" label="上传者" />
					<el-table-column prop="download_number" label="下载次数" />
					<el-table-column prop="upload_time" label="上传时间" width="200">
						<template #default="{row}">
							<div>{{row.upload_time?.slice(0,10)}}</div>
						</template>
					</el-table-column>

					<el-table-column label="操作" width="200" fixed="right">
						<template #default="{row}">
							<div>
								<el-button type="success">
									<template #default>
										<a :href="row.file_url"
											@click="changeClick(row.download_number,row.id)">下载文件</a>
									</template>
								</el-button>
								<el-button type="danger" @click="deleteFile(row.id)">删除</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="table-footer">
			<el-pagination :page-size="1" :current-page="paginationData.fileCurrentPage" :pager-count="7"
                     :total="paginationData.fileTotal" :page-count="paginationData.filePageCount"
                     @current-change="fileCurrentChange" layout="prev, pager, next" />
		</div>
	</div>
	<tips ref="tip" @success='getFileFirstPageList'></tips>
</template>

<script lang='ts' setup>
	import {
		ref,
		reactive
	} from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import tips from './components/tips.vue'
	import {
		bindFileAndUser,
		fileListLength,
		returnFilesListData,
		updateDownload
	} from '@/api/file'
	import type {
		UploadUserFile
	} from 'element-plus'
	import {
		ElMessage
	} from 'element-plus'
	import {
		bus
	} from "@/utils/mitt"
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '文件管理',
		second: ''
	})

	const fileList = ref < UploadUserFile[] > ([])
	// 文件数量限制回调
	const handleExceed = () => {
		ElMessage.warning(
			'最多上传三个文件！'
		)
	}
	// 文件上传成功回调
	const handleSuccess = (response: any) => {
		if (response.status == 0) {
			(async () => {
        let name:string | null = localStorage.getItem('name')
				await bindFileAndUser(name as string, response.url)
			})()
			ElMessage({
				message: '上传文件成功',
				type: 'success',
			})
			getFileFirstPageList()
		} else {
			ElMessage.error('上传文件失败，请检查网络问题！')
		}
	}

	// 文件表格数据
	const tableData = ref<any[]>([])

	// 分页数据
	const paginationData = reactive({
		// 文件总数
		fileTotal: 1,
		// 文件列表总页数
		filePageCount: 1,
		// 文件列表当前所处页数
		fileCurrentPage: 1,
	})
	// 获取文件列表的页数
	const getFiletListLength = async () => {
		const res = await fileListLength() as any
		paginationData.fileTotal = res.length
		paginationData.filePageCount = Math.ceil(res.length / 10)
	}
	getFiletListLength()
	// 默认获取文件列表第一页的数据
	const getFileFirstPageList = async () => {
		tableData.value = await returnFilesListData(1) as any
	}
	getFileFirstPageList()


	// 文件列表监听换页
	const fileCurrentChange = async (value: number) => {
		paginationData.fileCurrentPage = value
		tableData.value = await returnFilesListData(paginationData.fileCurrentPage) as any
	}
	// 更新点击率
	const changeClick = async (download_number: number, id: number) => {
		await updateDownload(download_number, id)
	}

	const tip = ref()
	const deleteFile = (id: number) => {
		bus.emit('deleteFile', id)
		tip.value.open()
	}
</script>

<style lang="scss" scoped>
	:deep(.el-table .cell) {
		font-weight: 400;
	}

	a {
		color:#fff;
		display: block;
		text-decoration: none;
	}
</style>
