import { getAppName } from '@/api/app'

const actions = {
// 	updateAppName({ commit }){ //解构赋值
// 		getAppName().then(res => {
// 			commit({
// 				type:'set_app_name',
// 				new_data:res.info.appName
// 			})
// 		}).catch(err => {
// 			console.log(err)
// 		})
// 	}

	//ES8 的async方法做上述操作
	async updateAppName({ commit }){ //除了能解构到commit，还有state(当前state实例),rootState(根state实例),dispatch(可继续在当前实例内执行其他action),getters,rootGetters
		try{
			const { info: { appName }} = await getAppName()  //等待执行完后解构赋值
			commit('set_app_name',{new_data:appName})
		}catch(err){
			console.log(err)
		}

	}
}

export default actions
