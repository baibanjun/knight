<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.create_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="车牌号">
				<el-input placeholder="" v-model="search_info.plate_number"></el-input>
			</el-form-item>
      <el-form-item label="运输人">
      	<el-input placeholder="" v-model="search_info.driver"></el-input>
      </el-form-item>
			<el-form-item label="电话">
				<el-input placeholder="" v-model="search_info.phone"></el-input>
			</el-form-item>
      <el-form-item label="油脂类别">
      	<el-select v-model="search_info.recycle_type">
      		<el-option label="全部" value=""></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
      	</el-select>
      </el-form-item>
			<el-form-item label="开票状态">
				<el-select v-model="search_info.invoice_status">
					<el-option label="全部" value=""></el-option>
          <el-option label="已开票" value="1"></el-option>
          <el-option label="未开票" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="add()">新增记录</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border show-summary>
			<el-table-column type="index" label="#" width="50"></el-table-column>
			<el-table-column label="入库时间" width="160">
        <template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template> 
      </el-table-column>
			<el-table-column label="出入库编号"> 
        <template slot-scope="scope">{{ scope.row.sn }}</template>
      </el-table-column>
      <el-table-column label="车牌号"> 
        <template slot-scope="scope">{{ scope.row.plate_number }}</template>
      </el-table-column>
      <el-table-column label="运输人"> 
        <template slot-scope="scope">{{ scope.row.driver }}</template>
      </el-table-column>
      <el-table-column prop="rough_weight" label="毛重(kg)"> </el-table-column>
      <el-table-column prop="tare_weight" label="皮重(kg)"> </el-table-column>
      <el-table-column prop="net_weight" label="净重(kg)"> </el-table-column>
      <el-table-column label="含油率(%)">
        <template slot-scope="scope">{{ (scope.row.oil_content*100).toFixed(2) }}</template> 
      </el-table-column>
      <el-table-column label="去杂净重(kg)">
        <template slot-scope="scope">
          {{ scope.row.net_weight_without_impurity?(scope.row.net_weight_without_impurity*1).toFixed(2):'0' }}
        </template>
      </el-table-column>
      <el-table-column prop="without_impurity_offset" label="除粗渣量(kg)"> </el-table-column>
      <el-table-column label="油脂类别" width="80"><template slot-scope="scope">{{ scope.row.recycle_type==2?'红油':scope.row.recycle_type==3?'地沟油':'固渣' }}</template></el-table-column>
			<el-table-column label="状态" width="70"><template slot-scope="scope">{{ scope.row.invoice_status==1?'已开票':'未开票' }}</template></el-table-column>
			<el-table-column label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)" v-if="!scope.row.account_id">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.page"
        @current-change="search"
        >
      </el-pagination>
    </div>
	</div>
</template>

<script>
import {baseURL} from '../../config/index.js'
	import { axios_get,axios_delete,axios_put  } from '@/api/main'
  import { time_format } from '@/lib/tools.js'
	export default {
		data(){
			return {
        list:[
          {
            id:'',
            "oil_content": '',
            "create_time": '',
            "rough_weight": '',
            "without_impurity_offset": '',
            "net_weight": '',
            "tare_weight": '',
            "recycle_type": '',
            "driver": '',
            "phone": '',
            "net_weight_without_impurity": '',
            "sn": '',
            "plate_number": '',
            "invoice_status": ''
          }
        ],
        sums_data:{},
        total:0,
				search_info:{
					page:1,
					limit:10,
          create_time:'',
					phone:'',
					plate_number:'',
					driver:'',
          invoice_status:'',//开票状态
          recycle_type:''
				}
			}
		},
		mounted() {
			var _self = this
      _self.search(1)
		},
		methods:{
      // 导出
    leadingOut() {
      window.open(baseURL+'/api/admin/grease_day/export?'+'token='+ this.$store.state.token+'&create_time='+this.search_info.create_time+'&phone='+this.search_info.phone+'&plate_number='+this.search_info.plate_number+'&driver='+this.search_info.driver+'&invoice_status='+this.search_info.invoice_status+'&recycle_type='+this.search_info.recycle_type);
    },
			search:function(currentPage){
				var _self = this
        if(currentPage){
          _self.search_info.page = currentPage
        }
        axios_get('api/admin/grease_day',_self.search_info).then(res => {
				  if(res){
				    _self.list = res.list
            _self.total = res.totalCount
            _self.sums_data = res.sum
				  }
				})
			},
      add:function(){
        this.$router.push("/admin/gre/addDay")
      },
			handleEdit:function(_id){
        this.$store.commit('admin_gre_day',{_id:_id})
				this.$router.push("/admin/gre/dayDetail")
			},
			handleDelete:function(_id){
				var _self = this
				_self.$prompt('确认删除该账号?','提示',{
          inputPlaceholder:'请填写删除理由',
          inputPattern:/\S{2,40}/,
          inputErrorMessage:'字数在2-40之间'
        }).then(({value})=> {
						axios_put('api/admin/grease_day/'+_id,{deleteReason:value,deletedAt:time_format({})}).then(res => {
						  if(res) _self.search(1)
						})
					})
					.catch(()=> {});
			},
      //时间戳格式化
      time_format:function(req){
        return time_format({time:req})
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
            case "without_impurity_offset":
            sums[index] = _self.sums_data.without_impurity_offset
            break;
            case "rough_weight":
            sums[index] = _self.sums_data.rough_weight
            break;
            case "tare_weight":
            sums[index] = _self.sums_data.tare_weight
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
