import axios from 'axios'
import { baseURL } from '@/config'
import { Loading,Message } from 'element-ui';
import router from '@/router';
import store from '@/store'
class HttpRequest {
	constructor(baseUrl = baseURL) { //每个类必须有的方法  参数意思是baseUrl = baseUrl||baseURL
	    this.baseUrl = baseUrl
      this.queue = {}
	}
	getInsideConfig () {  //全局默认配置
		const config = {
			baseURL:this.baseUrl,
			headers:{
				// 'Content-Type':'multipart/form-data',
				// 'X-Requested-With': 'XMLHttpRequest'
				'token':store.state.token
			}
			// transformRequest: [function (data) {
			// 	let ret = ''
			// 	for (let it in data) {
			// 		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			// 	}
			// 	return ret
			// }]

		}
		return config
	}
	interceptors(instance){  //拦截器
		let loadingInstance
		instance.interceptors.request.use(config =>{
			//添加全局的loading...
			loadingInstance = Loading.service({text:'请求中。。。',background: 'rgba(0, 0, 0, 0)',})
			return config
		},error => {
			Message.error({
				message: '请求失败',
				offset:200
			})
			return Promise.reject(error)
		})
		instance.interceptors.response.use(res =>{
			loadingInstance.close()
			if(res.data.errno == 1000||res.data.errno == "-10001"||res.data.errno == "-10002"){//未登录拦截
				store.commit('log_out',{}) //调用store实例的mutations内方法
				router.push("/login")
				return false
			}


      if(res.data.errno == 12001){ //抽样没数据
        return false
      }

			if(res.data.errno != 0 ){
				Message.error({
					message: res.data.errmsg,
          duration:2500,
					offset:130
				})
				return false
			}
			return res.data.data
		},error => {
			loadingInstance.close()
			Message.error({
				message: '请求失败',
				offset:200
			})
			return Promise.reject(error)
		})
	}
	request (options){ //
		const instance = axios.create()  //创建一个实例
		options = Object.assign(this.getInsideConfig(),options) //assign方法进行配置对象合并，相同字段覆盖，没有的新增。把传入的options放在后面，
		this.interceptors(instance)
		return instance(options)
	}
}
export default HttpRequest
