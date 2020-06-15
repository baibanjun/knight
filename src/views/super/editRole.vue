<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%" class="tac">角色信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="名称:" prop="company_name">
                    <el-tag type="info">{{now_role_name}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-table :data="list" border>
                  <el-table-column type="index" label="#" width="40"></el-table-column>
                  <el-table-column prop="userName" label="账号"> </el-table-column>
                  <el-table-column prop="realName" label="所属人"> </el-table-column>
                  <el-table-column prop="mobile" label="手机号"> </el-table-column>
                  <el-table-column label="账号状态">
                    <template slot-scope="scope">{{scope.row.status==1?'已禁用':'启用中'}}</template>
                  </el-table-column>
                  <el-table-column label="操作">
                  	<template slot-scope="scope">
                  		<el-button size="mini" @click="handleFreeze(scope.row.userId,1)" v-if="scope.row.status==0" type="warning">禁用</el-button>
                      <el-button size="mini" @click="handleFreeze(scope.row.userId,0)" v-if="scope.row.status==1" type="success">启用</el-button>
                  		<el-button size="mini" @click="handleDelete(scope.row.userId)" type="danger">删除</el-button>
                  	</template>
                  </el-table-column>
                </el-table>
              </el-row>
            </td>
          </tr>
        </table>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-row>
            <el-col :span="8">
              <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
            </el-col>
          </el-row>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post_fd } from '@/api/main'
	export default{
		data(){
			return{
        list:[{name:1}]
			}
		},
		computed:{
			now_role_id(){
				return this.$store.state.superUser.now_role_id
			},
      now_role_name(){
				return this.$store.state.superUser.now_role_name
			}
		},
    mounted() {
      this.search()
    },
		methods:{
      search:function(){
        var _self = this
        var req = {
          page_index:1,page_size:200,roleType:_self.now_role_id
        }
        axios_post_fd('api/super/listUsers',req).then(res => {
          if(res){
            _self.list = res.accounts
          }
        })
      },
      //冻结、解冻
      handleFreeze:function(_id,_type){
      	var _self = this
        var msg = '确认冻结该用户？'
        if(_type==0) msg = '确认启用该用户？'
        _self.$confirm(msg).then(() => {
          axios_post_fd('api/super/modifyFreezeOrNot',{user_id:_id,type:_type}).then(res => {
            if(res){
              _self.$message({
                message: '操作成功',
                type: 'success',
                offset:200
              })
              _self.search()
            }
          })
        })
      },
      handleDelete:function(_id){
        var _self = this
        _self.$confirm('确认删除该用户').then(() => {
          axios_post_fd('api/super/deleteUser',{user_id:_id}).then(res => {
            if(res){
              _self.$message({
                message: '操作成功',
                type: 'success',
                offset:200
              })
              _self.search()
            }
          })
        })
      },
			back:function(_index){
				var _self = this
        this.$router.push('/super/roleList')
			}
		}
	}
</script>

<style scoped>
  .el-table >>>.cell {
    text-align: center;
  }
  .el-table >>> td{
    padding: 6px 0;
  }
	.out_info_box{
		margin-left: 2%;
		width: 96%;
		box-shadow: 0 0 5px #ccc;
		padding: 20px 20px;
	}
  .info_table{
    width: 100%;
    margin: 10px 0;
  }
  .info_table td{
    border: 1px solid #ccc;
    padding: 20px 10px;
  }
  .tac{
    text-align: center;
  }
</style>
