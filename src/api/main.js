import HttpRequest from '@/lib/axios'
const axios = new HttpRequest()

const axios_get = (_url,req) =>{
  return axios.request({
  	url:_url,
  	method:'get',
    params:req
  })
}
const axios_post = (_url,req) =>{
  return axios.request({
  	url:_url,
  	method:'post',
    data:req
  })
}
const axios_put = (_url,req) =>{
  return axios.request({
  	url:_url,
  	method:'put',
    data:req
  })
}
const axios_delete = (_url,req) =>{
  return axios.request({
  	url:_url,
  	method:'delete',
    params:req
  })
}
//form-data格式传数据
const axios_post_fd = (_url,req) =>{
  return axios.request({
  	url:_url,
  	method:'post',
    transformRequest: [function (data) {
    	let ret = ''
    	for (let it in data) {
    		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    	}
    	return ret
    }],
    data:req
  })
}
export {
  axios_get,
  axios_post,
  axios_put,
  axios_delete,
  axios_post_fd
}
