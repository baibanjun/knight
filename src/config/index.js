//api 域名
const baseURL = process.env.NODE_ENV === 'production'
	// ? 'http://192.168.20.253:8765'
	? "http://47.93.58.100:8765"
	:"http://47.93.58.100:8765"
  // : 'http://knight-api.sichuanjqs.com'
//网站域名
const appURL = process.env.NODE_ENV === 'production'
	? 'http://knight.sichuanjqs.com'
	: 'http://knight.sichuanjqs.com'

export {baseURL,appURL}
