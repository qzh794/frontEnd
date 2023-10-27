import instance from '@/http/index'

// 获取用户信息
export const getUserInfo = (id:number) => {
	return instance({
		url: '/user/getUserInfo',
		method: 'POST',
		data: {
			id
		}
	})
}
// 绑定图片地址跟账号
export const bind = (account:number, onlyId:any, url:any) => {
	return instance({
		url: '/user/bindAccount',
		method: 'POST',
		data: {
			account,
			onlyId,
			url
		}
	})
}

// 修改密码
export const changePassword = (id:number, oldPassword:string, newPassword:string) => {
	return instance({
		url: '/user/changePassword',
		method: 'POST',
		data: {
			id,
			oldPassword,
			newPassword
		}
	})
}

// 修改姓名
export const changeName = (name:string, id:number) => {
	return instance({
		url: '/user/changeName',
		method: 'POST',
		data: {
			name,
			id
		}
	})
}

// 修改性别
export const changeSex = (sex:string, id:number) => {
	return instance({
		url: '/user/changeSex',
		method: 'POST',
		data: {
			sex,
			id
		}
	})
}

// 修改邮箱
export const changeEmail = (email:string, id:number) => {
	return instance({
		url: '/user/changeEmail',
		method: 'POST',
		data: {
			email,
			id
		}
	})
}

// ----------------------------------------用户管理
// 添加管理员
export const createAdmin = (data:any) => {
	const {
		account,
		...identity
	} = data
	return instance({
		url: '/user/createAdmin',
		method: 'POST',
		data: {
			account,
			...identity
		}
	})
}

// 获取管理员列表
export const getAdminList = (identity:string) => {
	return instance({
		url: '/user/getAdminList',
		method: 'POST',
		data: {
			identity
		}
	})
}

// 编辑管理员账号信息
export const editAdmin = (data:any) => {
	const {
		id,
		...department
	} = data
	return instance({
		url: '/user/editAdmin',
		method: 'POST',
		data: {
			id,
			...department
		}
	})
}

// 对管理员取消赋权
export const changeIdentityToUser = (id:number) => {
	return instance({
		url: '/user/changeIdentityToUser',
		method: 'POST',
		data: {
			id
		}
	})
}

// 对用户进行赋权
export const changeIdentityToAdmin = (id:number, identity:string) => {
	return instance({
		url: '/user/changeIdentityToAdmin',
		method: 'POST',
		data: {
			id,
			identity
		}
	})
}

// 通过账号对用户搜索
export const searchUser = (account:number,identity:string) => {
	return instance({
		url: '/user/searchUser',
		method: 'POST',
		data: {
			account,
      identity
		}
	})
}

// 通过部门对用户搜索
export const searchDepartment = (department:string) => {
	return instance({
		url: '/user/searchUserByDepartment',
		method: 'POST',
		data: {
			department
		}
	})
}


// 冻结用户
export const banUser = (id:number) => {
	return instance({
		url: '/user/banUser',
		method: 'POST',
		data: {
			id
		}
	})
}

// 解冻用户
export const hotUser = (id:number) => {
	return instance({
		url: '/user/hotUser',
		method: 'POST',
		data: {
			id
		}
	})
}

// 获取冻结用户列表
export const getBanList = () => {
	return instance({
		url: '/user/getBanList',
		method: 'POST',
	})
}

// 删除用户  deleteUser
export const deleteUser = (id:number, account:number) => {
	return instance({
		url: '/user/deleteUser',
		method: 'POST',
		data: {
			id,
			account
		}
	})
}

// 获取对应身份的一个总人数
export const getAdminListLength = (identity:string) => {
	return instance({
		url: '/user/getAdminListLength',
		method: 'POST',
		data: {
			identity
		}
	})
}

// 监听换页返回数据
export const returnListData = (pager:number,identity:string) => {
	return instance({
		url: '/user/returnListData',
		method: 'POST',
		data: {
			pager,
			identity
		}
	})
}
