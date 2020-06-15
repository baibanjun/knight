<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
      <el-form-item label="运输人">
      	<el-input placeholder="" v-model="search_info.name"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
      	<el-input placeholder="" v-model="search_info.license_plate_number"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
      	<el-input placeholder="" v-model="search_info.mobile"></el-input>
      </el-form-item>
      <el-form-item label="负责单位">
      	<el-input placeholder="" v-model="search_info.company_name"></el-input>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="add_driver()">新增运输人</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="name" label="运输人"> </el-table-column>
      <el-table-column prop="mobile" label="手机号"> </el-table-column>
      <el-table-column label="绑定车牌号">
        <template slot-scope="scope">
          <p v-for="n in scope.row.rubbishCars">{{ n.licensePlateNumber }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="bankCard" label="银行卡号"> </el-table-column>
      <el-table-column label="负责单位">
        <template slot-scope="scope">
          <p v-for="n in scope.row.rubbishCompanies">{{ n.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="处置费单价(元)"><template slot-scope="scope">{{scope.row.price/100}}</template> </el-table-column>
      <el-table-column prop="company" label="车险到期">
        <template slot-scope="scope">
          <p v-for="n in scope.row.rubbishCars" class="danger_text">{{ is_expire(n.insuranceExpirationTime)==true?n.licensePlateNumber:'' }}</p>
        </template>
      </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelect(scope.row.id)">删除</el-button>
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
	import { axios_get,axios_delete } from '@/api/main'
	export default {
		data(){
			return {
        list:[
          {
            id:1,
            company:'',
            mobile:'',
            rubbishCars:[{insuranceExpirationTime:'',licensePlateNumber:''}],
            bankCard:'',
            price:'2.5',
            name:''
          }
        ],
        total:1,
				search_info:{
					page:1,
					limit:10,
          mobile:'',
          license_plate_number:'',
          company_name:'',
          name:''
				}
			}
		},
		mounted() {
			var _self = this
      _self.search_info.license_plate_number = _self.$store.state.admin.state_search_info.rub_driver_number
      _self.search_info.mobile = _self.$store.state.admin.state_search_info.rub_driver_mobile
      _self.search_info.company_name = _self.$store.state.admin.state_search_info.rub_driver_company_name
      _self.search_info.name = _self.$store.state.admin.state_search_info.rub_driver_name
      _self.search(1)
		},
		methods:{
      // 导出
      leadingOut() {
        window.open(baseURL+'/api/admin/rubbish_driver/export?'+'token='+ this.$store.state.token+'&mobile='+this.search_info.mobile+'&license_plate_number='+this.search_info.license_plate_number+'&company_name='+this.search_info.company_name+'&name='+this.search_info.name);
      },
			search:function(currentPage){
        var _self = this

        _self.$store.commit('set_admin_search_info',{
          rub_driver_number:_self.search_info.license_plate_number,
          rub_driver_mobile:_self.search_info.mobile,
          rub_driver_company_name:_self.search_info.company_name,
          rub_driver_name:_self.search_info.name,
        })

        if(currentPage){
          _self.search_info.page = currentPage
        }
        axios_get('api/admin/rubbish_driver',_self.search_info).then(res => {
          if(res){
            _self.list = res.list
            _self.total = res.totalCount
          }
        })
      },
			handleEdit:function(_id){
				this.$store.commit('admin_rub_driver',{_id:_id})
				this.$router.push("/admin/rub/driverDetail")
			},
      handleDelect:function(_id){
        var _self = this
        _self.$prompt('是否确认删除该运输人？','提示',{
          inputPlaceholder:'请填写删除理由',
          inputPattern:/\S{2,40}/,
          inputErrorMessage:'字数在2-40之间'
        }).then(({value})=> {
        		axios_delete('api/admin/rubbish_driver/'+_id,{deleteReason:value}).then(res => {
              if(res===null) _self.search(1)
            })
        	})

      },
      add_driver:function(){
        this.$router.push("/admin/rub/addDriver")
      },
      out:function(){

      },
      //车险1个月
      is_expire:function(str){
        var now = (new Date()).valueOf();
        var date = new Date(str);
        var expire_time = date.valueOf();
        if((expire_time-now)>30*86400*1000){
          return false
        }
        else{
          return true
        }
      }
		}
	}
</script>

<style scoped>
  .danger_text{
    color:#F56C6C
  }
</style>
