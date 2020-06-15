<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="时间">
        <el-date-picker v-model="search_info.time" type="month" placeholder="选择月份" value-format="yyyy-MM"></el-date-picker>
			</el-form-item>
			<el-form-item label="送货人">
				<el-input placeholder="" v-model="search_info.driverName"></el-input>
			</el-form-item>
			<el-form-item label="清账状态">
				<el-select v-model="search_info.clearStatus">
					<el-option label="全部" value="0"></el-option>
			    <el-option label="已清账" value="3"></el-option>
			    <el-option label="未清账" value="2"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="账单类型">
      	<el-select v-model="search_info.type">
      		<el-option label="全部" value="0"></el-option>
          <el-option label="餐厨垃圾" value="1"></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
      	</el-select>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<!-- <el-button type="success" icon="el-icon-download" @click="handleDelete()">导出数据</el-button> -->
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="id" label="账单编号"> </el-table-column>
      <el-table-column prop="carNumber" label="车牌号"></el-table-column>
      <el-table-column label="送货人"><template slot-scope="scope">{{scope.row.driverName||'--'}}</template> </el-table-column>
      <el-table-column label="手机号"><template slot-scope="scope">{{scope.row.phone||'--'}}</template> </el-table-column>
      <el-table-column prop="bankCard" label="银行账号"></el-table-column>
      <el-table-column label="累积结欠(元)">
        <template slot-scope="scope">
          <el-button type="danger" circle size="mini" disabled v-if="scope.row.inOutType==2">出</el-button>
          <el-button type="success" circle size="mini" disabled v-if="scope.row.inOutType==1">入</el-button>&nbsp;
          <el-tag type="info">{{scope.row.totalAmount/100}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="还款日期">
        <template slot-scope="scope">{{scope.row.payDate===null?'--':time_format(scope.row.payDate) }}</template>
      </el-table-column>
      <el-table-column label="清账状态">
        <template slot-scope="scope">{{scope.row.status==3?'已清账':'未清账'}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
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
	import { axios_post,axios_get } from '@/api/main'
  import { time_format } from '@/lib/tools.js'
	export default {
		data(){
			return {
        list:[
          {
            "id": '-',
            "driverName": '-',
            "phone":'-',
            "categoryName": '-',
            "status": '2',
            'bankCard':'-',
            "totalAmount": '0',
            "remark": ''
          }
        ],
        total:1,
        search_info:{
          offset:1,
          limit:10,
        	time:'',
        	driverName:'',
          clearStatus:'0',
        	type:'0'
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
				axios_post('/api/ca/payment/list',_self.search_info).then(res => {
					if(res){
					  _self.list = res.records
					  _self.total = res.total
					}
				})
			},
      handleAdd:function(){
        this.$router.push("/cashier/addStatement")
      },
			handleEdit:function(_id){
			  var _self = this
				_self.$store.commit('cashier_statement',{_id:_id})
				_self.$router.push("/cashier/statementDetail")
			},
      handleDelete:function(_id){
        var _self = this
        _self.$confirm('确认删除该对账表？').then(() => {
          axios_get('/api/ca/payment/del/'+_id).then(res => {
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
