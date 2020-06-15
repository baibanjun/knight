<template>
	<div>
		<h3 class="day_info_title">详情信息</h3>
		<div class="add_day_info">
			<el-form class="demo-form-inline" label-width="140px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:" prop="account">
              <el-tag type="info">{{info.license_plate_number}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
        <hr>
        <el-row>
          <el-col :span="8">
          	<el-form-item label="本月入库次数:" prop="password">
          		<el-tag type="info">{{info.warehouse_number}}</el-tag>
          	</el-form-item>
          </el-col>
        	<el-col :span="8">
        		<el-form-item label="月总净重(kg):" prop="password">
        			<el-tag type="info">{{info.net_weight}}</el-tag>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="月去杂净重(kg):" prop="password">
          		<el-tag type="info">{{ (info.net_weight_without_impurity*1).toFixed(2) }}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>

				<el-form-item label="入库记录:" prop="roleType">
          <el-table border :data="list">
            <el-table-column label="入库时间" width="160"><template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template></el-table-column>
            <el-table-column label="出入库编号"><template slot-scope="scope">{{scope.row.sn}}</template></el-table-column>
            <el-table-column prop="rough_weight" label="毛重(kg)"></el-table-column>
            <el-table-column prop="tare_weight" label="皮重(kg)"></el-table-column>
            <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
            <el-table-column label="含油率(%)"><template slot-scope="scope">{{ (scope.row.oil_content*100).toFixed(2) }}</template></el-table-column>
            <el-table-column label="去杂净重(kg)">
              <template slot-scope="scope">{{ (scope.row.net_weight_without_impurity*1).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="without_impurity_offset" label="除粗渣量(kg)"></el-table-column>
            <el-table-column label="类别"><template slot-scope="scope">{{ scope.row.recycle_type==2?'红油':scope.row.recycle_type==3?'地沟油':'固渣' }}</template></el-table-column>
            <el-table-column label="状态"><template slot-scope="scope">{{ scope.row.invoice_status==1?'已开票':'未开票' }}</template></el-table-column>
          </el-table>
				</el-form-item>

				<el-form-item>
          <el-col :span="10">
          	<el-button icon="el-icon-download" type="success" @click="leadingOut()">导出</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-col>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put  } from '@/api/main'
	import { time_format } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					id:'',
					license_plate_number:'',
					mobile:'',
					name:'',
					warehouse_number:'',
					net_weight:'',
          net_weight_without_impurity:''
				},
				list:[
				  {
				    create_time:'',
				    oil_content:'',
				    sn:'',
				    without_impurity_offset:'', //粗渣
				    rough_weight:'', //毛
				    tare_weight:'',
				    net_weight:'',
            net_weight_without_impurity:'',
				    invoice_status:'',
				    recycle_type:''
				  }
				]
			}
		},
		computed:{
		  gre_month_id(){
		  	return this.$store.state.admin.gre_month_id
		  },
		  admin_month(){
		  	return this.$store.state.admin.admin_month
		  },
      admin_plate_number(){
        return this.$store.state.admin.admin_plate_number
      }
		},
		mounted() {
		  var _self = this
		  axios_get('api/admin/grease_month/'+_self.gre_month_id,{month:_self.admin_month,license_plate_number:_self.admin_plate_number}).then(res => {
		    if(res){
		      _self.info = res
		    }
		  })
		  axios_get('api/admin/grease_month/stock_in_records',{id:_self.gre_month_id,month:_self.admin_month,page:1,limit:5000,license_plate_number:_self.admin_plate_number}).then(res => {
		    if(res){
		      _self.list = res.list
		    }
		  })
		},
		methods:{
			//返回
			back:function(){
				this.$router.push("/admin/gre/monthList")
			},
			time_format:function(_time){
				return time_format({time:_time})
			},
			// 导出
			leadingOut:function() { 
				let _self = this
				console.log(_self.list)
				require.ensure([], () => {
				    const { export_json_to_excel } = require("@/vendor/Export2Excel");
				    const tHeader = [
				      "入库时间",
				      "出入库编号",			      
				      "毛重(kg)",
				      "皮重(kg)",
				      "净重(kg)",
				      "含油率(%)",
				      "去杂净重(kg)",
				      "除粗渣量(kg)",
				      "类别",
				      "状态"
				    ]; // 对应表格输出的title
				    const filterVal = [
				      "create_time",
				      "sn",
				      "rough_weight",
				      "tare_weight",
				      "net_weight",
				      "oil_content",
				      "net_weight_without_impurity",
				      "without_impurity_offset",
				      "recycle_type",
				      "invoice_status"
				    ]; // 对应表格输出的数据
				    var list = JSON.parse(JSON.stringify(_self.list));
				    list.forEach(item => {
				      item.create_time = _self.time_format(item.create_time)
				      item.oil_content = (item.oil_content*100).toFixed(2)
				      item.net_weight_without_impurity = (item.net_weight_without_impurity*1).toFixed(2)
				      item.recycle_type = (item.recycle_type==2?'红油':item.recycle_type==3?'地沟油':'固渣')
				      item.invoice_status = (item.invoice_status==1?'已开票':'未开票')
				    });

				    const data = _self.formatJson(filterVal, list);
				    export_json_to_excel(tHeader, data, "餐厨油脂(月)入库记录"); // 对应下载文件的名字
				});
			},
			formatJson: function(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]));
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
