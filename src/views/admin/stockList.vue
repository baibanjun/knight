<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="">
			  <el-date-picker
			    v-model="date"
          :clearable="false"
			    type="daterange"
			    value-format="yyyy-MM-dd"
			    range-separator="至"
			    start-placeholder="开始日期"
			    end-placeholder="结束日期">
			  </el-date-picker>
			</el-form-item>
      <el-form-item label="车牌号">
        <el-input  v-model="search_info.plate_number"></el-input>
      </el-form-item>
      <el-form-item label="运输人">
        <el-input  v-model="search_info.driver"></el-input>
      </el-form-item>
      <el-form-item label="运输人手机号">
        <el-input  v-model="search_info.phone"></el-input>
      </el-form-item>
      <el-form-item label="公司名">
        <el-input  v-model="search_info.company_name"></el-input>
      </el-form-item>
      <el-form-item label="入库类型">
        <el-select v-model="type" @change="change_stock()">
          <el-option label="全部" value=""></el-option>
          <el-option label="餐厨垃圾入库" value="1"></el-option>
          <el-option label="红油入库" value="2"></el-option>
          <el-option label="地沟油入库" value="3"></el-option>
          <el-option label="红油出库" value="4"></el-option>
          <el-option label="地沟油出库" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区">
        <el-select v-model="search_info.area">
          <el-option label="全部" value=""></el-option>
          <el-option :label="n.name" v-for="n in city_list" :value="n.name"></el-option>
        </el-select>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%;">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="起始时间">
        <template slot-scope="scope">{{search_info.start_date}}</template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">{{search_info.end_date}}</template>
      </el-table-column>
      <el-table-column prop="plate_number" label="车牌号"> </el-table-column>
      <el-table-column prop="driver" label="运输人"> </el-table-column>
      <el-table-column prop="phone" label="运输人手机号"> </el-table-column>
      <el-table-column prop="weight" label="净重(kg)"> </el-table-column>
      <el-table-column prop="in_out_type" label="入库类型">
        <template slot-scope="scope">
          {{scope.row.recycle_type==1?'餐厨垃圾':scope.row.recycle_type==2?'红油':'地沟油'}}
          {{scope.row.in_out_type==1?'入库':'出库'}}
        </template>
      </el-table-column>
      <el-table-column prop="area" label="地区"> </el-table-column>
      <el-table-column prop="company_name" label="公司单位"> </el-table-column>
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
  import { baseURL } from '@/config'
	import { axios_get } from '@/api/main'
  import { time_format } from '@/lib/tools'
	export default {
		data(){
			return {
        list:[],
        total:1,
        date:['2019-1-1','2019-2-2'],
        type:'',
        city_list:[],
				search_info:{
					page:1,
					limit:10,
          plate_number:'',
          driver:'',
          phone:'',
          company_name:'',
          area:'',
          start_date:'',
          end_date:'',
          in_out_type:'',
          recycle_type:''
				}
			}
		},
		mounted() {
			var _self = this
      let _now = time_format({'format':'YY-MM-DD'})
      let _before_timestamp = time_format({'format':'timestamp'}) - 3600 * 1000 * 24 * 90
      let _before = time_format({time:_before_timestamp,format:'YY-MM-DD'})
      _self.date = [_before,_now]
      _self.search(1)

      //获取四川城市列表
      axios_get('api/admin/tip_login/area').then(res => {
        if(res){
          res.forEach(value => {
            if(value.acode==510000000){ //抓取四川
              value.children.forEach(item => {
                if(item.bcode=='510100000'){ //抓取成都
                  _self.city_list = item.children
                }
              })
            }
          })
        }
      })
		},
		methods:{
        // 导出
      leadingOut() {
        var _self = this
        let [start_date,end_date] = _self.date
        _self.search_info.start_date = start_date
        _self.search_info.end_date = end_date
        var params = Object.keys(_self.search_info).map(function (key) {
                // body...
                return key + "=" + _self.search_info[key];
            }).join("&");

        window.open(baseURL+'/api/admin/statistic/export?'+'token='+ this.$store.state.token+'&'+params);
      },
      search:function(currentPage){
        var _self = this
        if(currentPage){
          _self.search_info.page = currentPage
        }
        let [start_date,end_date] = _self.date
        //查询区间不超过三个月
        if( time_format({'format':'timestamp',time:end_date}) - time_format({'format':'timestamp',time:start_date}) > 93*24*3600*1000){
          _self.$message.error({
            message: '查询区间不超过三个月',
            offset:200
          })
          return false
        }
        _self.search_info.start_date = start_date
        _self.search_info.end_date = end_date

        axios_get('/api/admin/statistic',_self.search_info).then(res => {
          if(res){
            _self.list = res.list
            _self.total = res.totalCount
          }
        })
      },
      change_stock:function(){
        var _self = this
        if(_self.type == ''){
          _self.search_info.in_out_type = ''
          _self.search_info.recycle_type = ''
        }
        else{
          if(_self.type>3){
            _self.search_info.in_out_type = '2'
            _self.search_info.recycle_type = _self.type == 4?'2':'3'
          }
          else{
            _self.search_info.in_out_type = '1'
            _self.search_info.recycle_type = _self.type == 1?'1':_self.type == 2?'2':'3'
          }
        }
      }

		}
	}
</script>

<style scoped>

</style>
