import instance from '@/http/index'

// 注册
export const register = (data:any) => {
	const {
		account,
		password
	} = data
	return instance({
		url: '/api/register',
		method: 'POST',
		data: {
			account,
			password
		}
	})
}

// 登录
export const login = (data:any) => {
	const {
		account,
		password
	} = data
	return instance({
		url: '/api/login',
		method: 'POST',
		data: {
			account,
			password
		}
	})
}

export const returnMenuList = (id:number) =>{
  return instance({
    url: '/api/returnMenuList',
    method: 'POST',
    data: {
      id
    }
  })
}

// 忘记密码验证
export const verify = (data:any) => {
	const {
		account,
		email
	} = data
	return instance({
		url: '/user/verifyAccountAndEmail',
		method: 'POST',
		data: {
			account,
			email
		}
	})
}

// 密码重置
export const reset = (id:number,newPassword:string) => {
	return instance({
		url: '/user/changePasswordInLogin',
		method: 'POST',
		data: {
			id,
			newPassword
		}
	})
}
