<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px">
        <table class="info_table" cellspacing="0">
          <tr>
            <td class="tac" width="20%" >日期</td>
            <td class="tac" colspan="2">
              {{info.dateStr}}
            </td>
          </tr>
          <tr>
            <td class="tac">红油</td>
            <td colspan="2">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="净重:" prop="account">
                      <el-tag type="info">{{info.redWeight}}</el-tag>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="去杂净重:" prop="password">
                      <el-tag type="info">{{info.redWeightPure}}</el-tag>
                    </el-form-item>
                  </el-col>
                </el-row>

            </td>
          </tr>

          <tr>
            <td class="tac" rowspan="2">地沟油</td>
            <td width="15%" class="tac">
              加工前
            </td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="净重(kg):" prop="account">
                    <el-tag type="info">{{(info.illegalWeightBefore*1).toFixed(2)}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="去杂净重(kg):" prop="account">
                    <el-tag type="info">{{ (info.illegalWeightPureBefore*1).toFixed(2) }}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="tac">
              加工后
            </td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="去杂净重(kg):" prop="account">
                    <el-tag type="info">{{(info.illegalWeightPureAfter*1).toFixed(2)}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="水/固渣(kg):" prop="account">
                    <el-tag type="info">{{ (info.illegalWeightAfter - info.illegalWeightPureAfter).toFixed(2) }}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <td class="tac" rowspan="2">餐厨垃圾废油</td>
            <td width="15%" class="tac">
              加工前
            </td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="垃圾净重(kg):" prop="account">
                    <el-tag type="info">{{info.trashWeightBefore}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="tac">
              加工后
            </td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="加工油净重(kg):" prop="account">
                    <el-tag type="info">{{info.trashOilWeightAfter}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
        </table>
        <hr>
        <el-form-item label="出入库记录:" prop="roleType">
          <el-select v-model="search_info.grease_type">
          	<el-option label="全部" value="0"></el-option>
            <el-option label="红油" value="3"></el-option>
            <el-option label="地沟油" value="4"></el-option>
            <el-option label="加工地沟油" value="1"></el-option>
            <el-option label="加工餐厨废油" value="2"></el-option>
          </el-select>&nbsp;
          <el-button icon="el-icon-search" @click="search()" type="primary">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-table border :data="list" height="400">
            <el-table-column label="时间"><template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template></el-table-column>
            <el-table-column prop="sn" label="出入库编号"></el-table-column>
            <el-table-column label="油脂类型">
              <template slot-scope="scope">{{ get_oil_type(scope.row.table_name,scope.row.type) }}</template>
            </el-table-column>
            <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
            <el-table-column label="含油率(%)"><template slot-scope="scope">{{ (scope.row.oil_content*100).toFixed(2) }}</template></el-table-column>
            <el-table-column prop="net_weight_without_impurity" label="去杂净重(kg)">
              <template slot-scope="scope">{{ (scope.row.net_weight_without_impurity*1).toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get } from '@/api/main'
	import { time_format } from '@/lib/tools.js'
	export default{
		data(){
			return{
        info:{
          "id": null,
          "dateStr": "",
          "redWeight": '',
          "redWeightPure": '',
          "trashWeightBefore": '',
          "trashOilWeightAfter": '',
          "illegalWeightBefore": '',
          "illegalWeightPureBefore": '',
          "illegalWeightAfter": '',
          "illegalWeightPureAfter": ''
        },
        list:[
          {
            "oil_content": 0.21,
            "create_time": 1562294196000,
            "net_weight_without_impurity": 12,
            "sn": "15629049485474",
            "type": 2,
            "net_weight": 3,
            "table_name": "stock"
          }
        ],
        search_info:{
          page:1,
          limit:5000,
          day:'',
          grease_type:'0'
        }
			}
		},
		computed:{
			gre_summary_id(){
				return this.$store.state.admin.gre_summary_id
			}
		},
    mounted() {
      var _self = this
      axios_get('api/admin/grease_day_auto/'+_self.gre_summary_id).then(res => {
        if(res){
          _self.info = res
          _self.search_info.day = res.dateStr
          _self.search()
        }
      })
    },
		methods:{
      search:function(){
      	var _self = this
        axios_get('api/admin/grease_day_auto/records',_self.search_info).then(res => {
      	  if(res){
            console.log(res.list)
      	    _self.list = res.list
      	  }
      	})
      },
			back:function(_index){
        this.$router.push('/admin/gre/summary')
			},
      get_oil_type:function(table_name,_type){
        if(table_name == 'stock'){
          if(_type == 2) return '红油'
          if(_type == 3) return '地沟油'
        }
        else{
          if(_type == 1) return '加工餐厨废油'
          if(_type == 2) return '加工地沟油'
        }
        return '-'
      },
      //时间戳格式化
      time_format:function(req){
        return time_format({time:req})
      }
		}
	}
</script>

<style scoped>
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
