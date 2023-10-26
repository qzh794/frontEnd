import {
	operationLog
} from '@/api/log'

export const tracking = async (module:string, operation_person:string, operation_object:string, operation_level:string,operation_status?:string) => {
	if (module == '管理员') {
		// 操作内容
		let operation_content = `对管理员'${operation_object}'进行了删除操作`
		await operationLog(operation_person, operation_content, operation_level)
	}
	if (module == '产品') {
		// 操作内容
		let operation_content = `对产品'${operation_object}'进行了审核操作，审核结果为'${operation_status}'`
		await operationLog(operation_person, operation_content, operation_level)
	}
}
