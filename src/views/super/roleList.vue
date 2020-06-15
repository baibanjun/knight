<template>
	<div>
		<el-table :data="role_list" border class="role_table">
			<el-table-column type="index" label="#" width="80"></el-table-column>
			<el-table-column label="账号角色" width="150" prop="roleName"></el-table-column>
			<el-table-column label="角色状态"><template slot-scope="scope">{{'启用中'}}</template></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.roleCode,scope.row.roleName)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { axios_get } from '@/api/main'
	export default {
		data(){
			return {
				role_list:[]
			}
		},
		created() {
			var _self = this
			axios_get('api/super/getUserRoles').then(res => {
				_self.role_list = res
			})
		},
		methods:{
			handleEdit:function(_id,_name){
				this.$store.commit('set_role_id',{role_id:_id}),
        this.$store.commit('set_role_name',{role_name:_name})
				this.$router.push("/super/editRole")
			}
		}
	}
</script>

<style scoped>
  .role_table{
    width: 60%;
    margin-left: 20%;
  }
  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>> th{
    padding: 8px 0;
  }
  .el-table>>> td{
    padding: 8px 0;
  }
</style>
