//限制不能为空
const checkNull = (rule,value,callback) => {
  if ( !value ) {
    return callback(new Error('该项不能为空'));
  }else{
    callback()
  }
}
//小数点后两位
const checkFlexd = (rule,value,callback) => {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if ( !reg.test(value) ) {
    return callback(new Error('输入的格式有误'));
  }else{
    callback()
  }
}
//非负整数
const checkInt = (rule,value,callback) => {
  const reg = /^(0|\+?[1-9][0-9]*)$/
  if ( !reg.test(value) ) {
    return callback(new Error('请输入0或正整数'));
  }else{
    callback()
  }
}
//电话号码限制
const checkPhone = (rule,value,callback) => {
  var reg = /^1[3456789]\d{9}$/
  if(!reg.test(value)){
    return callback(new Error('手机号格式不正确'));
  }else{
    callback()
  }
}
//下拉未选
const checkSelect = (rule,value,callback) => {
  if(value == ''||value === null){
    return callback(new Error('请选择一项'));
  }else{
    callback()
  }
}
//限制密码
const checkPwd = (rule,value,callback) => {
  if(value!=''){
    if(value.length<6||value.length>20){
      return callback(new Error('密码应当在6-20位'));
    }
    else{
      callback()
    }
  }else{
    callback()
  }
}
//时间格式化工具 时间字符串和时间戳互换
//req配置对象{time:null,format:null} time参数为null时取当前时间,其他取值为数字格式时间戳或日期字符串
//format取值有'timestamp'(输出时间戳),'YY-MM-DD HH:MM:SS','YY-MM-DD','YY-MM','YY','MM','DD','MM-DD','HH:MM:SS',不填默认'YY-MM-DD HH:MM:SS'
const time_format = ( req ) => {
  var date = req.time?new Date(req.time):new Date()
  if(req.format == 'timestamp') return date.getTime()
  if(req.format == undefined) req.format = 'YY-MM-DD HH:MM:SS'
  var year = date.getFullYear()
  var month = date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1
  var day = date.getDate()<10 ? "0"+date.getDate() : date.getDate()
  var hours = date.getHours()<10 ? "0"+date.getHours() : date.getHours()
  var minutes = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes()
  var seconds = date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds()
  if(req.format == 'YY-MM-DD HH:MM:SS') return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
  if(req.format == 'YY-MM-DD') return year+"-"+month+"-"+day
  if(req.format == 'YY-MM') return year+"-"+month
  if(req.format == 'YY') return year
  if(req.format == 'MM') return month
  if(req.format == 'DD') return day
  if(req.format == 'MM-DD') return month+"-"+day
  if(req.format == 'HH:MM:SS') return hours+":"+minutes+":"+seconds
}

export{ checkNull,checkSelect,checkPhone,checkPwd,checkInt,checkFlexd,time_format }
