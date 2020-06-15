<template>
	<div>
		<h3 class="day_info_title">详情信息</h3>
		<div class="add_day_info">
			<el-form class="demo-form-inline" label-width="140px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:" prop="account">
              <el-tag type="info">{{info.carNumber}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
        <hr>
        <el-row>
          <el-col :span="8">
          	<el-form-item label="油脂类别:" prop="password">
          		<el-tag type="info">{{info.categoryId==2?'红油':'地沟油'}}</el-tag>
          	</el-form-item>
          </el-col>
        	<el-col :span="8">
        		<el-form-item label="月总净重(kg):" prop="password">
        			<el-tag type="info">{{info.pureWeight}}</el-tag>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="月发生额(元):" prop="password">
          		<el-tag type="info">{{info.occurAmount/100}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>

				<el-form-item label="入库记录:" prop="roleType">
          <el-table border :data="info.stockRecords">
            <el-table-column label="入库时间" width="160"><template slot-scope="scope">{{ time_format(scope.row.createdAt) }}</template></el-table-column>
            <el-table-column label="出入库编号"><template slot-scope="scope">{{scope.row.sn}}</template></el-table-column>
            <el-table-column prop="pureWeight" label="净重(kg)"></el-table-column>
            <el-table-column prop="oilPercent" label="含油率(%)"><template slot-scope="scope">{{(scope.row.oilPercent*100).toFixed(2)}}</template></el-table-column>
            <el-table-column prop="otherWeight" label="去杂净重(kg)">
              <template slot-scope="scope">{{ (scope.row.oilPercent*scope.row.pureWeight/100).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="otherWeight" label="除粗渣量(kg)"></el-table-column>
            <el-table-column label="单价"><template slot-scope="scope">{{ scope.row.price/100 }}</template></el-table-column>
            <el-table-column label="发生额"><template slot-scope="scope">{{ (scope.row.oilPercent*scope.row.pureWeight*scope.row.price/100).toFixed(2) }}</template></el-table-column>
          </el-table>
				</el-form-item>

				<el-form-item>
          <el-button icon="el-icon-document-checked" type="warning" @click="account_examine" v-if="finance_info.status==0||!finance_info.status">入账核对</el-button>
          <el-button type="info" disabled v-if="finance_info.status>=1">已核对</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post  } from '@/api/main'
	import { time_format } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          carNumber:'',
          driverName:'',
          phone:'',
          categoryId:'',
          pureWeight:'',
          occurAmount:'',
          stockRecords:[]
        },
				list:[
				  {
				    createdAt:'',
				    sn:'',
				    pureWeight:'',
				    oilPercent:'', //粗渣
				    otherWeight:'', //毛
				    price:''
				  }
				]
			}
		},
		computed:{
		  finance_info(){
		  	return this.$store.state.finance.finance_info
		  },
      gre_month_id(){
		  	return this.$store.state.finance.gre_month_id
		  }
		},
		mounted() {
		  var _self = this
		  if(!_self.finance_info.status||_self.finance_info.status==0){ //未核对
		    let req = {
		        time:_self.finance_info.time,
		        carNumber:_self.finance_info.carNumber,
		        driverName:_self.finance_info.driverName,
		        phone:_self.finance_info.phone,
		        type:_self.finance_info.type
		      }
		    axios_post('/api/fi/oil/unchecked/detail',req).then(res => {
		      if(res){
		        _self.info = res
		      }
		    })
		  }
		  else{ //已核对
        axios_get('/api/fi/oil/checked/detail/'+_self.gre_month_id).then(res => {
          if(res){
            _self.info = res
          }
        })
		  }
		},
		methods:{
			//返回
			back:function(){
				this.$router.push("/finance/gre/monthList")
			},
		  time_format:function(_time){
		    return time_format({time:_time})
		  },
      //入账核对
      account_examine:function(){
      	var _self = this
        _self.$confirm(_self.finance_info.occurAmount/100 + ' 元','入账金额',{type: 'info'}).then(()=> {
          var req = {
            "time": _self.finance_info.time,
            "carNumber":_self.finance_info.carNumber,
            "driverName": _self.finance_info.driverName,
            "phone": _self.finance_info.phone,
            "pureWeight":_self.finance_info.pureWeight,
            "occurAmount":_self.finance_info.occurAmount,
            "type": _self.finance_info.type,
            "records": []
          }
          _self.info.stockRecords.forEach(value => {
            req.records.push(value.sn)
          })
          axios_post('/api/fi/oil/checkin',req).then(res => {
            if(res===null){
              this.$router.push("/finance/gre/monthList")
            }
          })
        })
      }
		}
	}
</script>

<style scoped>
	.day_info_title{
		padding: 10px 30px;
	}
	.add_day_info{
		margin-left: 5%;
		width: 90%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>> th{
    padding: 4px 0;
  }
</style>
