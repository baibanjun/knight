<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="查询月份">
			  <el-date-picker v-model="search_info.time" type="month" placeholder="选择月份" value-format="yyyy-MM"></el-date-picker>
			</el-form-item>
			<el-form-item label="查询日期">
			  <el-date-picker v-model="search_info.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="账目分类">
				<el-select v-model="search_info.categoryId">
					<el-option label="全部" value="0"></el-option>
          <el-option v-for="n in categoryList" :label="n.name" :value="n.id"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="到账状态">
      	<el-select v-model="search_info.status">
      		<el-option label="全部" value="0"></el-option>
          <el-option label="已到账" value="3"></el-option>
          <el-option label="未到账" value="2"></el-option>
      	</el-select>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="handleAdd()">新建账目</el-button>
				<!-- <el-button type="success" icon="el-icon-download" @click="handleDelete()">导出数据</el-button> -->
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="id" label="账目编号"> </el-table-column>
      <el-table-column prop="name" label="账目名称"> </el-table-column>
      <el-table-column label="账目分类">
        <template slot-scope="scope">{{scope.row.categoryName}}</template>
      </el-table-column>
      <el-table-column prop="trader" label="交易对象"> </el-table-column>
      <el-table-column label="金额(元)">
        <template slot-scope="scope">{{scope.row.totalAmount/100}}</template>
      </el-table-column>
      <el-table-column label="入账时间"><template slot-scope="scope">{{time_format(scope.row.payDate)}}</template> </el-table-column>
      <el-table-column label="到账状态">
        <template slot-scope="scope">{{scope.row.status==3?'已到账':'未到账'}}</template>
      </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)" v-if="scope.row.status!=3">删除</el-button>
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
	import { axios_post } from '@/api/main'
  import { time_format } from '@/lib/tools.js'
	export default {
		data(){
			return {
        list:[
          {
            "id": '',
            "name": '',
            "categoryName": '',
            "status": '',
            "trader":'',
            "totalAmount": '',
            "time": ''
          }
        ],
        categoryList:[],
        total:1,
        search_info:{
          offset:1,
          limit:10,
        	time:'',
          date:'',
        	categoryId:'0',
          status:'0',
        	type:'1'
        }
			}
		},
		created() {
      var _self = this
      axios_post('/api/ac/list',{offset:1,limit:100,type:'1',status:'1',flag:'0',}).then(res => {
      	if(res){
          _self.categoryList = res.records
      	}
      })
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
				axios_post('/api/sa/inout/list',_self.search_info).then(res => {
					if(res){
					  _self.list = res.records
					  _self.total = res.total
					}
				})
			},
      handleAdd:function(){
        this.$router.push("/super/addIncome")
      },
			handleEdit:function(_id){
			  var _self = this
			  _self.$store.commit('super_income',{_id:_id})
				_self.$router.push("/super/incomeDetail")
			},
      handleDelete:function(_id){
        var _self = this
        _self.$confirm('确认删除该账目？').then(() => {
          axios_post('/api/sa/inout/del/'+_id).then(res => {
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
