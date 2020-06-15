<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="公司名称">
				<el-input placeholder="" v-model="search_info.company_name"></el-input>
			</el-form-item>
      <el-form-item label="油脂类别">
      	<el-select v-model="search_info.recycle_type">
      		<el-option label="全部" value=""></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="交易方式">
      	<el-select v-model="search_info.type">
      		<el-option label="全部" value=""></el-option>
          <el-option label="送货" value="1"></el-option>
          <el-option label="自提" value="2"></el-option>
      	</el-select>
      </el-form-item>
			<el-form-item label="结算状态">
				<el-select v-model="search_info.settle_status">
					<el-option label="全部" value=""></el-option>
          <el-option label="未结算" value="0"></el-option>
          <el-option label="已结算" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border>
			<el-table-column type="index" label="#" width="50"></el-table-column>
			<el-table-column prop="company_name" label="公司名称"> </el-table-column>
      <el-table-column prop="contacts" label="联系人"> </el-table-column>
      <el-table-column prop="mobile" label="手机号"> </el-table-column>
      <el-table-column prop="sn" label="出入库编号" width="130"> </el-table-column>
      <el-table-column prop="rough_weight" label="毛重(kg)" width="90"> </el-table-column>
      <el-table-column prop="tare_weight" label="皮重(kg)" width="90"> </el-table-column>
      <el-table-column prop="net_weight" label="净重(kg)" width="90"> </el-table-column>
      <el-table-column label="结算含油率(%)" width="120"><template slot-scope="scope">{{ scope.row.settle_oil_content*100 }}</template></el-table-column>
      <el-table-column label="结算去杂净重(kg)" width="150">
        <template slot-scope="scope">{{ (scope.row.net_weight*scope.row.settle_oil_content).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="油脂类别" width="100"><template slot-scope="scope">{{ scope.row.recycle_type==2?'红油':scope.row.recycle_type==3?'地沟油':'固渣' }}</template></el-table-column>
      <el-table-column label="交易方式" width="90"><template slot-scope="scope">{{ scope.row.type==1?'送货':'自提' }}</template></el-table-column>
			<el-table-column label="结算状态" width="90"><template slot-scope="scope">{{ scope.row.settle_status==1?'已结算':'未结算' }}</template></el-table-column>
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
	import { axios_get,axios_delete  } from '@/api/main'
	export default {
		data(){
			return {
        list:[
          {
            "create_time": '',
            "rough_weight": '',
            "mobile": "",
            contacts:'',
            "settle_status": '',
            "type": '',
            "net_weight": '',
            "tare_weight": '',
            "recycle_type": '',
            "net_weight_without_impurity": '',
            "company_name": "公司A",
            "settle_oil_content": '',
            "id": '',
            "sn": "1562904948504"
          }
        ],
        sums_data:{},
        total:0,
        search_info:{
        	page:1,
        	limit:10,
          day:'',
        	company_name:'',
        	recycle_type:'',
        	type:'',
          settle_status:''//结算状态
        }
			}
		},
		mounted() {
			var _self = this
      _self.search_info.company_name = _self.$store.state.admin.state_search_info.gre_export_company_name
		  _self.search(1)
		},
		methods:{
      // 导出
    leadingOut() {
      window.open(baseURL+'/api/admin/grease_ex_warehouse/export?'+'token='+ this.$store.state.token+'&day='+this.search_info.day+'&company_name='+this.search_info.company_name+'&recycle_type='+this.search_info.recycle_type+'&type='+this.search_info.type+'&settle_status='+this.search_info.settle_status);
    },
			search:function(currentPage){
				var _self = this

        _self.$store.commit('set_admin_search_info',{
          gre_export_company_name:_self.search_info.company_name,
        })

			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('api/admin/grease_ex_warehouse',_self.search_info).then(res => {
				  if(res){
				    _self.list = res.list
			      _self.total = res.totalCount
            _self.sums_data = res.sum
				  }
				})
			},
			handleEdit:function(_id){
			  this.$store.commit('admin_gre_export',{_id:_id})
				this.$router.push("/admin/gre/exportDetail")
			},
			handleDelete:function(_id){
				var _self = this
				_self.$prompt('确认删除该出库记录?','提示',{
			    inputPlaceholder:'请填写删除理由',
			    inputPattern:/\S{2,40}/,
			    inputErrorMessage:'字数在2-40之间'
			  }).then(({value})=> {
						axios_delete('api/admin/grease_ex_warehouse/'+_id,{deleteReason:value}).then(res => {
              _self.search(1)
						})
					})
					.catch(()=> {});
			},
      DataToFixed:function(_num){
        return _num.toFixed(2)
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
            case "rough_weight":
            sums[index] = _self.sums_data.rough_weight
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
