<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="账号">
				<el-input placeholder="" v-model="search_info.account"></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input placeholder="" v-model="search_info.phone"></el-input>
			</el-form-item>
			<el-form-item label="所属人">
				<el-input placeholder="" v-model="search_info.realName"></el-input>
			</el-form-item>
			<el-form-item label="账号角色">
				<el-select value="0" v-model="search_info.roleType">
					<el-option label="全部" value="0"></el-option>
					<el-option :label="n.roleName" :value="n.roleCode" v-for="n in role_list"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
				<el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="user_list" border height="600">
			<el-table-column type="index" label="#" width="50"></el-table-column>
			<el-table-column prop="userName" label="账号"> </el-table-column>
			<el-table-column prop="realName" label="所属人"> </el-table-column>
			<el-table-column prop="mobile" label="手机号"> </el-table-column>
			<el-table-column label="账号角色"><template slot-scope="scope">
			{{ get_role_name(scope.row.roleType) }}
			</template> </el-table-column>
			<el-table-column prop="status" label="账号状态"><template slot-scope="scope">{{ scope.row.status==0?'启用中':'已冻结' }}</template></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.userId)">查看</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { axios_get,axios_post_fd } from '@/api/main'
	export default {
		data(){
			return {
				user_list: [],
				role_list:[{roleCode:'',roleName:''}],
				search_info:{
					page_index:1,
					page_size:10000,
					account:'',
					phone:'',
					realName:'',
					roleType:'0'
				}
			}
		},
		created() {
			var _self = this
			axios_get('/api/super/getUserRoles').then(res => {
        if(res){
          _self.role_list = res
          _self.search()
        }
			})
		},
		methods:{
			search:function(){
				var _self = this
				axios_post_fd('/api/super/listUsers',_self.search_info).then(res => {
				  if(res){
				    _self.user_list = res.accounts
				  }
				})
			},
      handleAdd:function(){
        this.$router.push('/super/addUser')
      },
			handleEdit:function(_id){
				this.$store.commit('set_user_id',{user_id:_id})
				this.$router.push("/super/editUser")
			},
			handleDelete:function(_id){
				var _self = this
				_self.$confirm('确认删除该用户?').then(()=> {
          axios_post_fd('/api/super/deleteUser', {user_id:_id}).then( res => {
            if(res){
              _self.search()
            }
          })
        })
			},
			get_role_name:function(_code){
				var _self = this
				var role_name = ''
				for(var i = 0;i<=_self.role_list.length;i++){
					if(_self.role_list[i].roleCode==_code){
						role_name = _self.role_list[i].roleName
						return _self.role_list[i].roleName
					}
				}
			}
		}
	}
</script>

<style scoped>
  .el-table>>>th{
    text-align: center;
    background: #f6f6f6;
  }
</style>
