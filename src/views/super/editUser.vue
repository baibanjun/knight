<template>
	<div>
		<h3 class="user_info_title">账号信息</h3>
		<div class="add_user_info">
			<el-form class="demo-form-inline" label-width="100px" ref="ruleForm" :rules="rules" :model="user_info">
				<el-row>
					<el-col :span="12">
						 <el-form-item label="账号:" prop="account">
							<el-input placeholder="" v-model="user_info.account"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="密码:" prop="password">
							<el-input type="password" v-model="user_info.password" placeholder="修改时填写"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="所属角色:">
					<el-select v-model="user_info.roleType">
						<el-option :label="n.roleName" :value="n.roleCode" v-for="n in role_list"></el-option>
					</el-select>
				</el-form-item>
        <el-row v-if="user_info.roleType!=15">
        	<el-col :span="12">
        		<el-form-item label="所属人:" prop="realName">
        			<el-input placeholder="" v-model="user_info.realName"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="12">
        		<el-form-item label="手机号:" prop="phone">
        			<el-input placeholder="" v-model="user_info.phone"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row v-if="user_info.roleType==15">
        	<el-col :span="12">
        		<el-form-item label="所属人:" prop="driver_id">
              <el-select v-model="user_info.driver_id" @change="change_driver()">
              	<el-option :label="n.name" :value="n.id" v-for="n in driver_list"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="12">
        		<el-form-item label="手机号:">
              <el-tag type="info">{{user_info.phone}}</el-tag>
        		</el-form-item>
        	</el-col>
        </el-row>
				<el-form-item label="备注:" prop="remark">
					<el-input type="textarea" v-model="user_info.remark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-col :span="18">
						<el-button type="primary" icon="el-icon-finished" @click="modify_user()">保存</el-button>
						<el-button icon="el-icon-d-arrow-left" @click="$router.push('/super/userList')">返回</el-button>
					</el-col>
					<el-col :span="6">
						<el-switch
							style="display: block"
							v-model="status"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="启用"
							active-value="0"
							inactive-text="冻结"
							inactive-value="1"
							@change="handleSwitch()"
							>
						</el-switch>
					</el-col>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post_fd } from '@/api/main'
	import { checkNull,checkPhone,checkPwd } from '@/lib/tools'
	export default{
		data(){
			return{
				role_list:[],
        driver_list:[],
				status:"0",
				user_info:{
					user_id:'',
					account:'',
					password:'',
					phone:'',
					realName:'',
					roleType:'',
					remark:''
				},
				rules:{
					account:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
					password:[
						{ required: false,validator: checkPwd, trigger: 'blur' }
					],
					realName:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
					phone:[
						{ required: true,validator: checkPhone, trigger: 'blur' }
					],
					remark:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					]
				}
			}
		},
		computed:{
			user_id(){
				return this.$store.state.superUser.now_user_id
			}
		},
		created() {
			var _self = this
			axios_get('api/super/getUserRoles').then(res => {
				if(res) _self.role_list = res
			})
      axios_get('api/admin/rubbish_driver',{page:1,limit:2000}).then(res => {
        if(res){
          _self.driver_list = res.list
        }
      })
		},
		mounted() {
      var _self = this
			axios_post_fd('api/super/getUser',{user_id:_self.user_id}).then(res => {
        if(res){
          this.user_info.user_id = res.userId
          this.user_info.account = res.userName
          this.user_info.phone = res.mobile
          this.user_info.realName = res.realName
          this.user_info.remark = res.remark
          this.user_info.roleType = res.roleType
          this.user_info.driver_id = res.driverId
          _self.status = res.status + ''
        }
			})
		},
		methods:{
			modify_user:function(){
				var _self = this
        console.log(_self.user_info)
				_self.$refs['ruleForm'].validate((valid) => { //rule方法必须callback()
					if (valid) {
            var req = JSON.parse(JSON.stringify(_self.user_info))
            if(req.roleType!=15) delete req.driver_id
						_self.$confirm('确认修改用户信息？').then(()=> {
              axios_post_fd('/api/super/modifyUserInfo',req).then( res => {
                if(res) _self.$router.push("/super/userList")
              })
            })
					} else {
						return false;
					}
				});
			},
      change_driver:function(){
        var _self = this
        _self.driver_list.forEach(val => {
          if(_self.user_info.driver_id == val.id){
            _self.user_info.realName = val.name
            _self.user_info.phone = val.mobile
          }
        })
      },
			//修改状态
			handleSwitch:function(){
				var _self = this
				axios_post_fd('/api/super/modifyFreezeOrNot',{user_id:_self.user_id,type:_self.status}).then(res => {
					if(!res) _self.status == '0'?_self.status='1':_self.status='0'
          else this.$message.success({message: '操作成功',offset:200})
				})
			}
		}
	}
</script>

<style scoped>
	.user_info_title{
		padding: 10px 30px;
	}
	.add_user_info{
		margin-left: 10%;
		width: 50%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
</style>
