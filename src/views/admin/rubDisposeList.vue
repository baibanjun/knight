<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.month" type="month" placeholder="选择日期" value-format="yyyy-MM"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%;">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="dateStr" label="日期"> </el-table-column>
      <el-table-column prop="netWeightTotal" label="总净重(kg)"> </el-table-column>
      <el-table-column prop="solidRubbishAmount" label="废弃固渣(车)"> </el-table-column>
      <el-table-column prop="netWeightOil" label="加工油净重(kg)"> </el-table-column>
      <el-table-column prop="netWeightWithoutImpurity" label="去杂净重(kg)"> </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        @current-change="search"
        >
      </el-pagination>
    </div>
	</div>
</template>

<script>
import {baseURL} from '../../config/index.js'
	import { axios_get } from '@/api/main'
  import { time_format } from '@/lib/tools'
	export default {
		data(){
			return {
        list:[
          {
            id:1,
            dateStr:'',
            netWeightTotal:'',
            solidRubbishAmount:'',
            netWeightWithoutImpurity:'',
            netWeightOil:''
          }
        ],
        sums_data:{},
        total:1,
				search_info:{
					page:1,
					limit:10,
					month:''
				}
			}
		},
		mounted() {
			var _self = this
      _self.search_info.month = time_format({time:null,format:'YY-MM'})
      _self.search(1)
		},
		methods:{
        // 导出
    leadingOut() {
      window.open(baseURL+'/api/admin/rubbish_day_auto/export?'+'token='+ this.$store.state.token+'&month='+this.search_info.month);
    },
      search:function(currentPage){
        var _self = this
        if(currentPage){
          _self.search_info.page = currentPage
        }

        //删除月份时
        if(_self.search_info.month===null){
          _self.search_info.month = time_format({time:null,format:'YY-MM'})
        }

        axios_get('api/admin/rubbish_day_auto',_self.search_info).then(res => {
          if(res){
            _self.list = res.list
            _self.total = res.totalCount
            _self.sums_data = res.sum
          }
        })
      },
			handleEdit:function(_id){
				this.$store.commit('admin_rub_dispose',{_id:_id})
				this.$router.push("/admin/rub/disposeDetail")
			},
      //合计
      getSummaries:function(param){
        var _self = this
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          switch(column.property) {
            case "netWeightWithoutImpurity":
            sums[index] = _self.sums_data.net_weight_without_impurity
            break;
            case "solidRubbishAmount":
            sums[index] = _self.sums_data.solid_rubbish_amount
            break;
            case "netWeightTotal":
            sums[index] = _self.sums_data.net_weight_total
            break;
            case "netWeightOil":
            sums[index] = _self.sums_data.net_weight_oil
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

</style>
