<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:" prop="account">
              <el-tag type="info">{{info.license_plate_number}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="运输人:" prop="account">
              <el-tag type="info">{{info.name}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:" prop="account">
              <el-tag type="info">{{info.mobile}}</el-tag>
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
        		<el-form-item label="月净重(kg):" prop="password">
        			<el-tag type="info">{{info.net_weight}}</el-tag>
        		</el-form-item>
        	</el-col>
        </el-row>
				<el-form-item label="入库记录:" prop="roleType">
          <el-table border :data="list" show-summary  height="400">
            <el-table-column label="入库时间"><template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template></el-table-column>
            <el-table-column label="出入库编号"><template slot-scope="scope">{{ scope.row.sn }}</template></el-table-column>
            <el-table-column prop="weight" label="台账总量(kg)"></el-table-column>
            <el-table-column prop="rough_weight" label="毛重(kg)"></el-table-column>
            <el-table-column prop="tare_weight" label="皮重(kg)"></el-table-column>
            <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
            <el-table-column label="状态"><template slot-scope="scope">{{ scope.row.invoice_status==1?'已开票':'未开票' }}</template></el-table-column>
            <el-table-column label="来源单位" width="250">
              <template slot-scope="scope">
                <p v-for="n in scope.row.standingBooks">{{n.rubbishCompany.name}}</p>
              </template>
            </el-table-column>
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
  import { appURL,baseURL } from '@/config'
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
					net_weight:''
				},
        list:[
          {
            create_time:'',
            mount:'',
            sn:'',
            weight:'',
            rough_weight:'',
            tare_weight:'',
            net_weight:'',
            invoice_status:'',
            standingBooks:[{rubbishCompany:{name:''}}]
          }
        ]
			}
		},
    computed:{
      rub_month_id(){
      	return this.$store.state.admin.rub_month_id
      },
      admin_month(){
      	return this.$store.state.admin.admin_month
      }
    },
    mounted() {
      var _self = this
      axios_get('api/admin/rubbish_month/'+_self.rub_month_id,{month:_self.admin_month}).then(res => {
        if(res){
          _self.info = res
        }
      })
      axios_get('api/admin/rubbish_month/stock_in_records',{id:_self.rub_month_id,month:_self.admin_month,page:1,limit:5000}).then(res => {
        if(res){
          _self.list = res.list
        }
      })
    },
		methods:{
			//返回
			back:function(){
				this.$router.push("/admin/rub/monthList")
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
              "台账重量(kg)",
              "毛重(kg)",
              "皮重(kg)",
              "净重(kg)",
              "状态",
              "来源单位"
            ]; // 对应表格输出的title
            const filterVal = [
              "create_time",
              "sn",
              "weight",
              "rough_weight",
              "tare_weight",
              "net_weight",
              "invoice_status",
              "standingBooks"
            ]; // 对应表格输出的数据
            var list = JSON.parse(JSON.stringify(_self.list));
            list.forEach(item => {
              item.create_time = _self.time_format(item.create_time)
              item.invoice_status = (item.invoice_status==1?'已开票':'未开票')
              item.standingBooks = (item.standingBooks.map(n => n.rubbishCompany.name).join('、'))
            });

            const data = _self.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "餐厨垃圾(月)入库记录"); // 对应下载文件的名字
          });
      },
      formatJson: function(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
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
