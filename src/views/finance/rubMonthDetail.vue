<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:">
              <el-tag type="info">{{info.carNumber}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="运输人:">
              <el-tag type="info">{{info.driverName}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:">
              <el-tag type="info">{{info.phone}}</el-tag>
          	</el-form-item>
          </el-col>
				</el-row>
        <hr>
        <el-row>
          <el-col :span="8">
          	<el-form-item label="月净重(kg):">
          		<el-tag type="info">{{info.pureWeight}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="月发生额(元):">
          		<el-tag type="warning">{{info.occurAmount/100}}</el-tag>
          	</el-form-item>
          </el-col>

        </el-row>
				<el-form-item label="入库记录:" prop="roleType">
          <el-table border :data="info.stockRecords" show-summary  height="300">
            <el-table-column label="入库时间"><template slot-scope="scope">{{ time_format(scope.row.createdAt) }}</template></el-table-column>
            <el-table-column label="出入库编号"><template slot-scope="scope">{{ scope.row.sn }}</template></el-table-column>
            <el-table-column prop="totalWeight" label="台账总量(kg)"></el-table-column>
            <el-table-column prop="pureWeight" label="净重(kg)"></el-table-column>
            <el-table-column label="单价(元)"><template slot-scope="scope">{{ scope.row.price/100 }}</template></el-table-column>
            <el-table-column label="发生额(元)"><template slot-scope="scope">{{ scope.row.pureWeight*scope.row.price/100 }}</template></el-table-column>
          </el-table>
				</el-form-item>
				<el-form-item>
          <el-col :span="6">
            <el-button icon="el-icon-document-checked" type="warning" @click="account_examine" v-if="finance_info.status==0">入账核对</el-button>
            <el-button type="info" disabled v-if="finance_info.status>=1">已核对</el-button>
          </el-col>
          <el-col :span="6">
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-col>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post,axios_get  } from '@/api/main'
  import { time_format } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					id:'',
					carNumber:'',
					phone:'',
					driverName:'',
					pureWeight:'0',
					occurAmount:'0',
          stockRecords:[
            {
              createdAt:'',
              sn:'',
              totalWeight:'',
              pureWeight:'',
              price:''
            }
          ]
				}
			}
		},
    computed:{
      rub_month_id(){
      	return this.$store.state.finance.rub_month_id
      },
      finance_month(){
      	return this.$store.state.finance.finance_month
      },
      finance_info(){  //携带信息
      	return this.$store.state.finance.finance_info
      }
    },
    mounted() {
      var _self = this
      if(_self.finance_info.status>=1){ //已核对
        axios_get('/api/fi/rub/checked/detail/'+_self.rub_month_id).then(res => {
          if(res){
            _self.info = res
          }
        })
      }
      else{ //未核对
        axios_post('/api/fi/rub/unchecked/detail',{time:_self.finance_month,carNumber:_self.finance_info.carNumber,driverId:_self.finance_info.driverId}).then(res => {
          if(res){
            _self.info = res
          }
        })
      }
    },
		methods:{
			//返回
			back:function(){
				this.$router.push("/finance/rub/monthList")
			},
      time_format:function(_time){
        return time_format({time:_time})
      },
      //入账核对
      account_examine:function(){
      	var _self = this
        _self.$confirm(_self.info.occurAmount/100 + ' 元','入账金额',{type: 'info'}).then(()=> {
          var req = {
            "time": _self.info.time,
            "driverId": _self.info.driverId,
            "carNumber":_self.info.carNumber,
            "driverName": _self.info.driverName,
            "phone": _self.info.phone,
            "pureWeight":_self.info.pureWeight,
            "occurAmount":_self.info.occurAmount,
            "type": 1,
            "records": []
          }
          _self.info.stockRecords.forEach(value => {
            req.records.push(value.sn)
          })
          axios_post('/api/fi/rub/checkin',req).then(res => {
            if(res===null){
              this.$router.push("/finance/rub/monthList")
            }
          })
        })
      }
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 2%;
		width: 96%;
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
