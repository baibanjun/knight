<template>
	<div>
		<h3 class="user_info_title">账号信息</h3>
		<div class="add_user_info">
			<el-form class="demo-form-inline" label-width="100px" ref="ruleForm" :rules="rules" :model="user_info">
				<el-row>
					<el-col :span="12">
						 <el-form-item label="账号:" prop="account">
							<el-input placeholder="请输入账号" v-model="user_info.account" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="密码:" prop="password">
							<el-input type="password" v-model="user_info.password" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        <el-form-item label="所属角色:" prop="roleType">
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
					<el-button type="primary" icon="el-icon-finished" @click="add_user()">保存</el-button>
					<el-button icon="el-icon-d-arrow-left" @click="$router.push('/super/userList')">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post_fd } from '@/api/main'
	import { checkNull,checkSelect,checkPhone,checkPwd } from '@/lib/tools'
	export default{
		data(){
			return{
				role_list:[],
        driver_list:[],
				user_info:{
					account:'',
					password:'',
					phone:'',
					realName:'',
					roleType:'',
					remark:'',
          driver_id:''
				},
				rules:{
					account:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
					password:[
						{ required: true,validator: checkNull, trigger: 'blur' },
            { required: true,validator: checkPwd, trigger: 'blur' }
					],
					realName:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
					phone:[
						{ required: true,validator: checkPhone, trigger: 'blur' }
					],
					roleType:[
						{ required: true,validator: checkSelect, trigger: 'blur' }
					],
          driver_id:[
          	{ required: true,validator: checkSelect, trigger: 'blur' }
          ],
					remark:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					]
				}
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
		methods:{
			add_user:function(){
				var _self = this
				_self.$refs['ruleForm'].validate((valid) => {
					if (valid) {
            var req = JSON.parse(JSON.stringify(_self.user_info))
            if(req.roleType!=15) delete req.driver_id
            console.log(req)
						_self.$confirm('确认新增该用户？').then(()=> {
              axios_post_fd('api/super/addUser',req).then( res => {
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
		width: 60%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
</style>
