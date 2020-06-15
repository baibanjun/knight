<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.month" type="month" placeholder="选择月份" value-format="yyyy-MM"></el-date-picker>
			</el-form-item>
			<el-form-item label="车牌号">
				<el-input placeholder="" v-model="search_info.license_plate_number"></el-input>
			</el-form-item>
      <el-form-item label="运输人">
        <el-input placeholder="" v-model="search_info.driver"></el-input>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border show-summary>
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="运输人"> 
        <template slot-scope="scope">{{scope.row.driver}}</template>
      </el-table-column>
      <el-table-column label="车牌号"> 
        <template slot-scope="scope">{{scope.row.license_plate_number}}</template>
      </el-table-column>

      <el-table-column label="本月入库次数" prop="warehouse_number">
        <template slot-scope="scope">
          <el-tag :type="scope.row.warehouse_number>=25?'info':scope.row.warehouse_number>=20?'success':scope.row.warehouse_number>=15?'primary':scope.row.warehouse_number>10?'warning':'danger'"> {{scope.row.warehouse_number}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="net_weight" label="月总净重(kg)"></el-table-column>
      <el-table-column prop="net_weight_without_impurity" label="月去杂净重(kg)">
        <template slot-scope="scope">
          {{(scope.row.net_weight_without_impurity*1).toFixed(2)}}
        </template>
      </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id,scope.row.license_plate_number)">查看</el-button>
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
	import { axios_get  } from '@/api/main'
  import { time_format } from '@/lib/tools'
	export default {
		data(){
			return {
        list:[
          {
            "name": '',
            "mobile": '',
            "id": '',
            "warehouse_number": '',
            "net_weight": '',
            "license_plate_number": '',
            "net_weight_without_impurity":''
          }
        ],
        sums_data:{},
        total:1,
        search_info:{
        	page:1,
        	limit:10,
        	month:'',
          driver:'',
        	license_plate_number:''
        }
			}
		},
		created() {
		  //获取当前月
		  this.search_info.month = time_format({time:null,format:'YY-MM'})
		},
		mounted() {
			var _self = this
		  _self.search(1)
		},
		methods:{
      // 导出
    leadingOut() {
      window.open(baseURL+'/api/admin/grease_month/export?'+'token='+ this.$store.state.token+'&month='+this.search_info.month+'&license_plate_number='+this.search_info.license_plate_number);
    },
			search:function(currentPage){
				var _self = this
			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
				axios_get('api/admin/grease_month',_self.search_info).then(res => {
					if(res){
					  _self.list = res.list
					  _self.total = res.totalCount
            _self.sums_data = res.sum
					}
				})
			},
			handleEdit:function(_id,plate_number){
			  var _self = this
				_self.$store.commit('admin_gre_month',{_id:_id})
			  _self.$store.commit('set_admin_month',{month:_self.search_info.month})
        _self.$store.commit('set_admin_car',{plate_number:plate_number})
				_self.$router.push("/admin/gre/monthDetail")
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
            case "net_weight_without_impurity":
            sums[index] = _self.sums_data.net_weight_without_impurity
            break;
            case "warehouse_number":
            sums[index] = _self.sums_data.warehouse_number
            break;
            case "net_weight":
            sums[index] = _self.sums_data.net_weight
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

<style>

</style>
