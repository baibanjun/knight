const path = require('path')  //node的path模块

const resolve = dir => path.join(__dirname,dir)

const BASE_URL = process.env.NODE_ENV === 'production'?'/' : '/'  //iview-admin

module.exports = {
  transpileDependencies: [
    'vue-echarts',
		"resize-detector"
  ],
  lintOnSave: false,
	publicPath:BASE_URL ,//配置项目基本路径
	chainWebpack:config =>{
		config.resolve.alias
		  .set('@',resolve('src'))
			.set('_c',resolve('src/components'))
	},
	//打包时不生成.map文件,减小体积，加快速度
	productionSourceMap: false,
	devServer:{
    port: 8081,
    disableHostCheck: true
		// proxy:{
  //     '/develop':{
  //       target:'http://192.168.20.17:8765',
  //       secure: false,
  //       changeOrigin:true,
  //       pathRewrite: {
  //        '^/develop': ''
  //       }
  //     }
  //   }
    //设置请求代理
	}
}
