<template>
	<div>
		<div class="login">
			<el-form label-width="60px" ref="ruleForm" :rules="rules" :model="form">
        <el-form-item label="账号" prop="user">
          <el-input v-model="form.user"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
			  </el-form-item>
			  <el-form-item>
          <el-button type="primary" v-on:keyup.13="login()" @click="login()" style="padding:12px 130px">登录</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
  import { axios_post_fd } from '@/api/main'
	export default{
		created() {
      var _self = this
			_self.$store.commit('log_out')
      //回车登录
      document.onkeypress = function(e) {
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          _self.login()
          return false
        }
      }
		},
		data(){
			var chackUser = (rule,value,callback) => {
				if (!value.trim()) {
					return callback(new Error('账号不能为空'));
				}else{
					callback()
				}
			};
			var checkPwd = (rule,value,callback) => {
				if (!value.trim()) {
				  return callback(new Error('密码不能为空'));
				}else{
					callback()
				}
			};
			return{
				form:{
					user:'',
					password:''
				},
				rules:{
					user:[
						{ required: true,validator: chackUser, trigger: 'blur' }
					],
          password:[
						{ required: true,validator: checkPwd, trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			login() {
				var _self = this
				_self.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						axios_post_fd('/api/login/user',{user_name:_self.form.user,password:_self.form.password}).then(res => {
							if(res){
								var _url
                var _menu = res.roleType   //1超管,3出纳,5财务,7管理,9操作,11抽样,13入库,15司机
                switch(res.roleType){
                  case 1:_url = '/super'
                  break;
                  case 3:_url = '/cashier'
                  break;
                  case 5:_url = '/finance'
                  break;
                  case 7:_url = '/admin'
                  break;
                  case 9:
                  _url = '/operator';_menu = 0
                  break;
                  case 11:
                  _url = '/sampler';_menu = 0
                  break;
                  case 13:
                  _url = '/warehousing';
                  break;
                  case 15:
                  _url = '/login';_menu = 0
                  break;
                }
                _self.$store.commit('login_success',{role_type:res.roleType,user_name:_self.form.user,token:res.token,menu_type:_menu})
								_self.$router.push(_url)
							}
						})
					} else {
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped>
	.login{
		width: 350px;
		height: 200px;
		margin: 0 auto;
		margin-top: 60px;
		box-shadow: 0px 0px 5px #CCCCCC;
		padding: 40px;
	}
</style>
