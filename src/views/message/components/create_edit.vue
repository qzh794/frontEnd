<template>
	<el-dialog v-model="dialogFormVisible" :title='title' width="50%" align-center append-to-body
		:destroy-on-close='true'>
		<div class="dialog-content">
			<el-form :model="formData" label-width="120px" style="max-width: 600px;" :rules="rules"
				:label-position="labelPosition">
				<el-form-item label="主题" prop='message_title'>
					<el-input v-model="formData.message_title" />
				</el-form-item>
				<el-form-item label="发布部门" prop='message_publish_department' v-if="title=='发布公告'||title=='编辑公告' ">
					<el-select v-model="formData.message_publish_department" placeholder="请选择发布部门">
						<el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="发布人" prop='message_publish_name'>
					<el-input v-model="formData.message_publish_name" disabled />
				</el-form-item>
				<el-form-item label="接收部门" prop='message_receipt_object' v-if="title=='发布公告'||title=='编辑公告'">
					<el-select v-model="formData.message_receipt_object" placeholder="请选择接收部门">
						<el-option v-for="item in allOptions" :key="item.value" :label="item.value"
                       :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="公告等级" prop='message_level' v-if="title=='发布公告'||title=='编辑公告'">
					<el-select v-model="formData.message_level" placeholder="选择公告等级">
						<el-option label="一般" value="一般" />
						<el-option label="重要" value="重要" />
						<el-option label="必要" value="必要" />
					</el-select>
				</el-form-item>
				<el-form-item label="内容" prop='message_content'>
					<div style="border: 1px solid #ccc">
						<!-- wangEditor结构 -->
						<Toolbar style="border-bottom: 1px solid #ccc;width: 600px;" :editor="editorRef"
							:defaultConfig="toolbarConfig" :mode="mode" />
						<Editor style="height: 300px; overflow-y: hidden;width: 600px;" v-model="valueHtml"
							:defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
					</div>
				</el-form-item>

			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="yes">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
	import '@wangeditor/editor/dist/css/style.css'
	import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import type { FormProps } from 'element-plus'
	import { publishMessage, editMessage } from '@/api/message'
	import {
		getDepartment
	} from '@/api/setting'
	import {
		bus
	} from "@/utils/mitt.js"
	import { ElMessage } from 'element-plus'
	import { changeUserReadList } from '@/api/dep_msg'
	import {
		useMsg
	} from '@/stores/message'
	const msgStore = useMsg()
	// 标题
	const title = ref()

	const labelPosition = ref<FormProps['labelPosition']>('left')
	bus.on('createMessage', (id : number) => {
		if (id == 1) {
			title.value = "发布公告"
		}
		if (id == 2) {
			title.value = "发布系统消息"
		}

	})
	// const message_receipt_object = ref()
	// 不包括全体成员
	const options = ref<object[]>([])
	// 包括全体成员
	const allOptions = ref<object[]>([])

	const departmentData = async () => {
		const res = await getDepartment() as any
		const data:Array<object> = []
		const dataAddAll:Array<object> = []
		for (let i = 0; i < res.length; i++) {
			let obj = {
				value: res[i]
			}
			data.push(obj)
			dataAddAll.push(obj)
		}
		options.value = data
		dataAddAll.push({ value: "全体成员" })
		allOptions.value = dataAddAll
	}
	departmentData()

	bus.on('editMessage', (row : any) => {
		title.value = "编辑公告"
		formData.id = row.id
		formData.message_title = row.message_title
		formData.message_publish_department = row.message_publish_department
		formData.message_publish_name = row.message_publish_name
		formData.message_receipt_object = row.message_receipt_object
		formData.message_level = row.message_level
		formData.message_content = row.message_content
	})
	bus.on('editSystemMessage', (row : any) => {
		title.value = "编辑系统消息"
		formData.id = row.id
		formData.message_title = row.message_title
		formData.message_publish_name = row.message_publish_name
		formData.message_content = row.message_content
	})

	interface FormData {
		id : number|null;
		message_title : string;
		message_publish_department : string;
		message_publish_name : string|null;
		message_category : string;
		message_receipt_object : string;
		message_level : string;
		message_content : string;
	}
	// 表单数据
	const formData : FormData= reactive({
		id: null,
		message_title: '',
		message_publish_department: '',
		message_publish_name: localStorage.getItem('name'),
		message_category: '',
		message_receipt_object: '',
		message_level: '',
		message_content: '',
	})

	const rules = reactive({
		message_title: [
			{ required: true, message: '请输入公告标题', trigger: 'blur' },
		],
		message_publish_department: [
			{ required: true, message: '请选择发布部门', trigger: 'blur' },
		],
		message_publish_name: [
			{ required: true, message: '请输入发布人', trigger: 'blur' },
		],
		message_receipt_object: [
			{ required: true, message: '请选择的接收对象', trigger: 'blur' },
		],
		message_level: [
			{ required: true, message: '请选择公告等级', trigger: 'blur' },
		],
		message_content: [
			{ required: true, message: '请输入公告内容', trigger: 'blur' },
		],
	})

	// 编辑器实例，必须用 shallowRef
	const editorRef = shallowRef()
	// mode
	const mode = ref('default')
	// 内容 HTML
	const valueHtml = ref()
	const toolbarConfig = {
		excludeKeys: []
	}
	const editorConfig = {
		placeholder: '',
		MENU_CONF: {
			// uploadImage: {
			// 	//上传图片配置
			// 	server: 'http://127.0.0.1:3007/set/uploadCompanyPicture', //上传接口地址
			// 	fieldName: 'file', //上传文件名
			// 	methods: 'post',
			// 	metaWithUrl: true, // 参数拼接到 url 上
			// 	// 单个文件上传成功之后
			// 	// onSuccess(file, res) {
			// 	// },
			// 	// 自定义插入图片
			// 	customInsert(res, insertFn) {
			// 		insertFn(res.url)
			// 	},
			// },
		}
	}
	// 上传图片，修改 uploadImage 菜单配置
	// 需要注意的是，如何去修改参数？
	toolbarConfig.excludeKeys = [
		'blockquote',
		'bgColor',
		'color',
		'group-more-style',
		'fontFamily',
		'bulletedList',
		'numberedList',
		'lineHeight',
		'todo',
		'emotion',
		'insertLink',
		'group-video',
		'insertTable',
		'codeBlock',
		'divider',
		'fullScreen',
		'group-image',
		// 排除菜单组，写菜单组 key 的值即可
	] as never[]

	// 组件销毁时，也及时销毁编辑器
	onBeforeUnmount(() => {
		const editor = editorRef.value
		if (editor == null) return
		editor.destroy()
	})

	const handleCreated = (editor : any) => {
		editorRef.value = editor // 记录 editor 实例，重要！
	}
	const emit = defineEmits(['success'])
	const yes = async () => {
		if (title.value == '发布公告') {
			formData.message_category = '公司公告'
			const res = await publishMessage(formData) as any
			if (res.status == 0) {
				await changeUserReadList(res.id, formData.message_receipt_object)
				await msgStore.returnReadList(localStorage.getItem('id') as unknown as number)
				ElMessage({
					message: '发布公告成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('发布公告失败')
				dialogFormVisible.value = false
			}
		}
		if (title.value == '编辑公告') {
			const res = await editMessage(formData)
			await msgStore.returnReadList(localStorage.getItem('id') as unknown as number)
			if (res.status == 0) {
				ElMessage({
					message: '编辑公告成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('编辑公告失败')
				dialogFormVisible.value = false
			}
		}
		if (title.value == '发布系统消息') {
			formData.message_category = '系统消息'
			const res = await publishMessage(formData)
			if (res.status == 0) {
				ElMessage({
					message: '发布系统消息成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('发布系统消息失败')
				dialogFormVisible.value = false
			}
		}
		if (title.value == '编辑系统消息') {
			const res = await editMessage(formData)
			if (res.status == 0) {
				ElMessage({
					message: '编辑系统消息成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('编辑系统消息失败')
				dialogFormVisible.value = false
			}
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
		flex: 1;
		max-height: 800px;
		overflow: auto;
	}

	.el-dialog__body {
		padding: 0;
	}

	.el-input {
		width: 240px;
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
	}

	.el-form-item {
		margin: 16px;
	}

	:deep(.w-e-text-container p) {
		margin: 0;
	}
</style>
