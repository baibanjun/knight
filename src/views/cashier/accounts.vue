<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="账目分类">
				<el-select v-model="search_info.type">
					<el-option label="全部" value="0"></el-option>
			    <el-option label="入账" value="1"></el-option>
          <el-option label="出账" value="2"></el-option>
          <el-option label="抵扣款" value="3"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="状态">
      	<el-select v-model="search_info.status">
      		<el-option label="全部" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
      	</el-select>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="handleAdd()">新建账目</el-button>
				<!-- <el-button type="success" icon="el-icon-download" @click="out()">导出数据</el-button> -->
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="name" label="账目名称"> </el-table-column>
      <el-table-column label="账目类别">
        <template slot-scope="scope">{{scope.row.type==1?'入账':scope.row.type==2?'出账':'抵扣款'}}</template>
      </el-table-column>
      <el-table-column label="创建时间"><template slot-scope="scope">{{ time_format(scope.row.createdAt) }}</template></el-table-column>
      <el-table-column prop="userName" label="创建人"></el-table-column>
      <el-table-column label="当前状态">
        <template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.offset"
        @current-change="search"
        >
      </el-pagination>
    </div>
	</div>
</template>

<script>
	import { axios_post,axios_get  } from '@/api/main'
  import { time_format } from '@/lib/tools.js'
	export default {
		data(){
			return {
        list:[
          {
            "id": '',
            "name": '-',
            "type":'1',
            "createdAt": '',
            "status": '2',
            "userName": '',
            "remark":''
          }
        ],
        total:1,
        search_info:{
        	offset:1,
        	limit:10,
        	type:'0',
        	status:'0',
          flag:'1'
        }
			}
		},
		mounted() {
			var _self = this
		  _self.search(1)
		},
		methods:{
			search:function(currentPage){
				var _self = this
			  if(currentPage){
			    _self.search_info.offset = currentPage
			  }
				axios_post('/api/ac/list',_self.search_info).then(res => {
					if(res){
					  _self.list = res.records
					  _self.total = res.total
					}
				})
			},
      handleAdd:function(){
        this.$router.push("/cashier/addAccounts")
      },
			handleEdit:function(_id){
			  var _self = this
				_self.$store.commit('cashier_account',{_id:_id})
				_self.$router.push("/cashier/accountsDetail")
			},
      handleDelete:function(_id){
        var _self = this
        _self.$confirm('确认删除该账目？').then(() => {
          axios_get('/api/ac/del/'+_id).then(res => {
          	if(res===null) _self.search()
          })
        })
      },
      //时间戳格式化
      time_format:function(req){
        return time_format({time:req})
      }
		}
	}
</script>

<style>

</style>
