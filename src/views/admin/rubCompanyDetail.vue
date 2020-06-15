<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="单位名称:" prop="name">
              <el-input placeholder="" v-model.trim="info.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系人:" prop="contacts">
							<el-input v-model.trim="info.contacts"></el-input>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:" prop="mobile">
          		<el-input v-model.trim="info.mobile"></el-input>
          	</el-form-item>
          </el-col>
				</el-row>
        <hr>
        <el-row>
        	<el-col :span="24">
        		<el-form-item label="地区:">
              <el-select v-model="other_info.cityId" @change="changeCity">
              	<el-option v-for="n in city_list" :label="n.bname" :value="n.bcode"></el-option>
              </el-select> &nbsp;
              <el-select v-model="info.areaId">
              	<el-option v-for="n in area_list" :label="n.name" :value="n.code"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="16">
        		<el-form-item label="详细地址:" prop="address">
              <el-input v-model.trim="info.address"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="预付金额:" prop="prepaidMoeny">
        			<el-input v-model.trim="info.prepaidMoeny"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="餐厨运输人:">
              <el-select v-model="info.rubbishDriverId" @change="changeRubDriver(false)" filterable>
              	<el-option v-for="n in driver_list" :label="n.name" :value="n.id"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="车牌号:">
              <el-select v-model="info.rubbishCarId">
              	<el-option v-for="n in rub_cars" :label="n.licensePlateNumber" :value="n.id"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:">
          		<el-tag type="info">{{other_info.rubMobile}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="油脂运输人:">
              <el-select v-model="info.greaseDriverId" @change="changeGreDriver(false)" filterable>
                <el-option label="无运输人" value="0"></el-option>
              	<el-option v-for="n in driver_list" :label="n.name" :value="n.id"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="车牌号:">
              <el-select v-model="info.greaseCarId">
                <el-option label="无" value="0"></el-option>
              	<el-option v-for="n in gre_cars" :label="n.licensePlateNumber" :value="n.id"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:">
          		<el-tag type="info">{{other_info.greMobile}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="修改备注:" prop="remark">
        	<el-input type="textarea" v-model.trim="info.remark"></el-input>
        </el-form-item>

        <el-form-item label="餐厨垃圾收运记录:">
          <el-row>
            <el-col :span="5" :offset="12">
              <el-date-picker v-model="search_month" type="month" placeholder="选择月份" value-format="yyyy-MM"></el-date-picker>
            </el-col>
            <el-button icon="el-icon-search" type="primary" @click="search(1)">搜索</el-button>
            <el-button icon="el-icon-download" type="success" @click="leadingOut()">导出</el-button>
          </el-row>
        </el-form-item>

				<el-form-item>
          <el-table border :data="list" height="350" show-summary>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column label="时间"><template slot-scope="scope">{{ time_format(scope.row.created_at) }}</template></el-table-column>
            <el-table-column prop="name" label="运输人"></el-table-column>
            <el-table-column prop="plate_number" label="车牌号"></el-table-column>
            <el-table-column prop="weight" label="台账重量(kg)"></el-table-column>
          </el-table>
				</el-form-item>
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { axios_get, axios_put } from '@/api/main'
import { appURL,baseURL } from '@/config'
import { checkNull, checkPhone, checkFlexd, time_format } from '@/lib/tools'
export default {
  data () {
    return {
      info: {
        id: '',
        name: '',
        contacts: '',
        mobile: '',
        areaId: '',
        address: '',
        prepaidMoeny: '',
        rubbishDriverId: '',
        rubbishCarId: '',
        greaseDriverId: '0',
        greaseCarId: '0',
        remark: ''
      },
      search_month: '2019-07',
      list: [
        { created_at: null, weight: '', name: '', plate_number: '' }
      ],
      other_info: {
        cityId: 510100000, // 市级编码
        rubMobile: '1',
        greMobile: '-'
      },
      driver_list: [], // 运输人列表
      rub_cars: [],
      gre_cars: [],
      city_list: [], // 市列表
      area_list: [],
      rules: {
        name: [
          { required: true, validator: checkNull, trigger: 'blur' }
        ],
        contacts: [
          { required: true, validator: checkNull, trigger: 'blur' }
        ],
        address: [
          { required: true, validator: checkNull, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        prepaidMoeny: [
          { required: true, validator: checkFlexd, trigger: 'blur' }
        ],
        remark: [
          { required: true, validator: checkNull, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    rub_company_id () {
      return this.$store.state.admin.rub_company_id
    }
  },
  mounted () {
    var _self = this
    axios_get('api/admin/rubbish_company/' + _self.rub_company_id).then(res => {
      if (res) {
        _self.info = res
        _self.info.prepaidMoeny = _self.info.prepaidMoeny / 100
      }
    })
    // 获取四川城市列表
    axios_get('api/admin/tip_login/area').then(res => {
      if (res) {
        res.forEach(value => {
          if (value.acode == 510000000) { // 抓取四川
            _self.city_list = value.children
          }
        })
        _self.city_list.forEach(value => {
          value.children.forEach(area => {
            if (area.code == _self.info.areaId) {
              _self.other_info.cityId = value.bcode
              _self.area_list = value.children
            }
          })
        })
      }
    })
    // 获取运输人列表
    axios_get('api/admin/rubbish_driver', { page: 1, limit: 1000, mobile: '', license_plate_number: '', company_name: '', name: '' }).then(res => {
      if (res) {
        _self.driver_list = res.list
        _self.changeRubDriver(_self.info.rubbishCarId)
        _self.changeGreDriver(_self.info.greaseCarId)
      }
    })
    _self.search_month = time_format({format:'YY-MM',time:null})
    _self.search(1)
  },
  methods: {
    // 收运记录
    search: function (_page) {
      var _self = this
      var req = { company_id: _self.rub_company_id, month: _self.search_month, page: 1, limit: 5000 }
      axios_get('api/admin/rubbish_company/records', req).then(res => {
        if (res) {
          _self.list = res.list
        }
      })
    },
    // 导出
    leadingOut:function() { 
      window.open(baseURL+'/api/admin/rubbish_company/records_export?'+'token='+ this.$store.state.token+'&company_id=' + this.rub_company_id + '&month=' + this.search_month);
    },
    handleEdit: function () {
      var _self = this
      _self.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          _self.$confirm('确认修改单位信息？').then(() => {
            var req = JSON.parse(JSON.stringify(_self.info)) // 深拷贝
            req.prepaidMoeny *= 100
            axios_put('api/admin/rubbish_company/' + _self.rub_company_id, req).then(res => {
              if (res) {
                _self.$router.push('/admin/rub/companyList')
              }
            })
          })
        } else {

        }
      })
    },
    // 修改状态
    back: function () {
      var _self = this
      _self.$confirm('确认放弃修改并返回？').then(() => {
        _self.$router.push('/admin/rub/companyList')
      })
    },
    // 时间戳格式化
    time_format: function (req) {
      return time_format({time:req})
    },
    // 切换市
    changeCity: function () {
      var _self = this
      _self.city_list.forEach(value => {
        if (_self.other_info.cityId == value.bcode) {
          _self.area_list = value.children
          _self.info.areaId = _self.area_list[0].code
        }
      })
    },
    // 改变餐厨运输人
    changeRubDriver: function (_id) {
      var _self = this
      _self.driver_list.forEach(value => {
        if (value.id == _self.info.rubbishDriverId) {
          _self.rub_cars = value.rubbishCars
          if (_self.rub_cars.length > 0) {
            _self.info.rubbishCarId = _id || _self.rub_cars[0].id // 抓取第一个车辆信息
          }
          _self.other_info.rubMobile = value.mobile // 获取手机号
        }
      })
    },
    // 改变油脂运输人
    changeGreDriver: function (_id) {
      var _self = this
      if(_self.info.greaseDriverId==0){
        _self.info.greaseDriverId = '0'
        _self.info.greaseCarId = '0'
        _self.other_info.greMobile = '-'
        return false
      }
      _self.driver_list.forEach(value => {
        if (value.id == _self.info.greaseDriverId) {
          _self.gre_cars = value.rubbishCars
          if (_self.gre_cars.length > 0) {
            _self.info.greaseCarId = _id || _self.gre_cars[0].id // 抓取第一个车辆信息
          }
          _self.other_info.greMobile = value.mobile // 获取手机号
        }
      })
    }
  }
}
</script>

<style scoped>
	.out_info_box{
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
