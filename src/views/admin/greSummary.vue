<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.month" type="month" placeholder="选择日期" value-format="yyyy-MM"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border>
      <el-table-column label="餐厨油脂入库汇总">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="dateStr" label="日期"></el-table-column>
        <el-table-column label="红油">
          <el-table-column prop="redWeight" label="净重"> </el-table-column>
          <el-table-column prop="redWeightPure" label="去杂净重"> </el-table-column>
        </el-table-column>
        <el-table-column label="地沟油">
          <el-table-column label="加工前">
            <el-table-column prop="illegalWeightBefore" label="净重"></el-table-column>
            <el-table-column label="去杂净重">
              <template slot-scope="scope">{{ (scope.row.illegalWeightPureBefore*1).toFixed(2) }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="加工后">
            <el-table-column prop="illegalWeightAfter" label="净重"> </el-table-column>
            <el-table-column label="去杂净重">
              <template slot-scope="scope">{{ (scope.row.illegalWeightPureAfter*1).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="水/固渣" prop="water">
              <template slot-scope="scope">{{ (scope.row.illegalWeightAfter-scope.row.illegalWeightPureAfter).toFixed(2) }}</template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="餐厨垃圾废油">
          <el-table-column label="加工前">
            <el-table-column prop="trashWeightBefore" label="垃圾净重(kg)" width="140"> </el-table-column>
          </el-table-column>
          <el-table-column label="加工后">
            <el-table-column prop="trashOilWeightAfter" label="加工油净重"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table-column>

		</el-table>
	</div>
</template>

<script>
import {baseURL} from '../../config/index.js'
	import { axios_get  } from '@/api/main'
	import { time_format } from '@/lib/tools'
	export default {
		data(){
			return {
        list:[
          {
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
          }
        ],
        sums_data:{},
        total:0,
        search_info:{
        	page:1,
        	limit:31,
          month:'',
          in_out_type:1
        }
			}
		},
		mounted() {
			var _self = this
      _self.search_info.month = time_format({time:null,format:"YY-MM"})
		  _self.search(1)
		},
		methods:{
      // 导出
    leadingOut() {
      window.open(baseURL+'/api/admin/grease_day_auto/export?'+'token='+ this.$store.state.token+'&month='+this.search_info.month+'&in_out_type='+this.search_info.in_out_type);
    },
			search:function(currentPage){
				var _self = this
			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('api/admin/grease_day_auto',_self.search_info).then(res => {
				  if(res){
				    _self.list = res.list
			      _self.total = res.totalCount
            _self.sums_data = res.sum
				  }
				})
			},
			handleEdit:function(_id){
			  this.$store.commit('admin_gre_summary',{_id:_id})
				this.$router.push("/admin/gre/summaryDetail")
			},
      //合计
      getSummaries:function(param){
        var _self = this
        const { columns, data } = param;
        const sums = [];
        if(!_self.sums_data) _self.sums_data = {}
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          switch(column.property) {
            case "illegalWeightAfter":
            sums[index] = _self.sums_data.illegal_weight_after
            break;
            case "illegalWeightPureAfter":
            sums[index] = _self.sums_data.illegal_weight_pure_after
            break;
            case "trashWeightBefore":
            sums[index] = _self.sums_data.trash_weight_before
            break;
            case "illegalWeightPureBefore":
            sums[index] = _self.sums_data.illegal_weight_pure_before
            break;
            case "illegalWeightBefore":
            sums[index] = _self.sums_data.illegal_weight_before
            break;
            case "redWeight":
            sums[index] = _self.sums_data.red_weight
            break;
            case "redWeightPure":
            sums[index] = _self.sums_data.red_weight_pure
            break;
            case "trashOilWeightAfter":
            sums[index] = _self.sums_data.trash_oil_weight_after
            break;
            case "water":
            sums[index] = _self.sums_data.illegal_weight_after - _self.sums_data.illegal_weight_pure_after
            break;
            default:
            break;
          }
        });
        return sums;
      }
		}
	}
</script>

<style scoped>
  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>> th{
    padding: 8px 0;
  }
</style>
