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
        		<el-form-item label="预付金额(元):" prop="prepaidMoeny">
        			<el-input v-model.trim="info.prepaidMoeny"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="餐厨运输人:">
              <el-select v-model="info.rubbishDriverId" @change="changeRubDriver" filterable>
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
          	<el-form-item label="手机号:" prop="password">
          		<el-tag type="info">{{other_info.rubMobile}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="油脂运输人:">
              <el-select v-model="info.greaseDriverId" @change="changeGreDriver" filterable>
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
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleAdd">确认新增</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post  } from '@/api/main'
	import { checkNull,checkPhone,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					name:'',
					contacts:'',
					mobile:'',
					areaId:'',
					address:'',
					prepaidMoeny:'',
					rubbishDriverId:'',
          rubbishCarId:'',
          greaseDriverId:'0',
          greaseCarId:'0'
				},
        other_info:{
          cityId:510100000,//市级编码
          rubMobile:'1',
          greMobile:'-'
        },
        driver_list:[], //运输人列表
        rub_cars:[],
        gre_cars:[],
        city_list:[],//市列表
        area_list:[], //区域列表
				rules:{
          name:[
            { required: true,validator: checkNull, trigger: 'blur' }
          ],
          contacts:[
            { required: true,validator: checkNull, trigger: 'blur' }
          ],
          address:[
            { required: true,validator: checkNull, trigger: 'blur' }
          ],
          mobile:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ],
          prepaidMoeny:[
            { required: true,validator: checkFlexd, trigger: 'blur' }
          ]
				}
			}
		},
    mounted() {
      var _self = this
      //获取四川城市列表
      axios_get('api/admin/tip_login/area').then(res => {
        if(res){
          res.forEach(value => {
            if(value.acode==510000000){ //抓取四川
              _self.city_list = value.children
            }
          })
          _self.changeCity() //初始化成都
        }
      })
      //获取运输人列表
      axios_get('api/admin/rubbish_driver',{page:1,limit:1000,mobile:'',license_plate_number:'',company_name:'',name:''}).then(res => {
        if(res){
          _self.driver_list = res.list
          if(_self.driver_list.length>0){
            _self.info.rubbishDriverId = _self.driver_list[0].id
            // _self.info.greaseDriverId = _self.driver_list[0].id
          }
          _self.changeRubDriver()
          // _self.changeGreDriver()
        }
      })
    },
		methods:{
			handleAdd:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认提交新增信息？')
            .then(()=> {
              var req = JSON.parse(JSON.stringify(_self.info)) //深拷贝
              req.prepaidMoeny*=100
              axios_post('api/admin/rubbish_company',req).then( res => {
                if(res){
                  _self.$router.push("/admin/rub/companyList")
                }
              })
            })
          }else{

          }
        })

			},
			//返回
			back:function(){
				var _self = this
				_self.$confirm('确认放弃新增并返回？').then(() => {
          _self.$router.push("/admin/rub/companyList")
        })
			},
      //切换市
      changeCity:function(){
        var _self = this
        _self.city_list.forEach(value => {
          if(_self.other_info.cityId==value.bcode){
            _self.area_list = value.children
            _self.info.areaId = _self.area_list[0].code
          }
        })
      },
      //改变餐厨运输人
      changeRubDriver:function(){
        var _self = this
        _self.driver_list.forEach(value => {
          if(value.id==_self.info.rubbishDriverId){
            _self.rub_cars = value.rubbishCars
            if(_self.rub_cars.length>0){
              _self.info.rubbishCarId = _self.rub_cars[0].id //抓取第一个车辆信息
            }
            _self.other_info.rubMobile = value.mobile //获取手机号
          }
        })
      },
      //改变油脂运输人
      changeGreDriver:function(){
        var _self = this
        if(_self.info.greaseDriverId=='0'){
          _self.info.greaseCarId = '0'
          _self.other_info.greMobile = '-'
          return false
        }
        _self.driver_list.forEach(value => {
          if(value.id==_self.info.greaseDriverId){
            _self.gre_cars = value.rubbishCars
            if(_self.gre_cars.length>0){
              _self.info.greaseCarId = _self.gre_cars[0].id //抓取第一个车辆信息
            }
            _self.other_info.greMobile = value.mobile //获取手机号
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
