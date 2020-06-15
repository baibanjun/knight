<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%">运输人信息</td>
            <td>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="运输人:" prop="name">
                    <el-input placeholder="" v-model="info.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="手机号:" prop="mobile">
                    <el-input placeholder="" v-model="info.mobile"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="银行卡号:" prop="bankCard">
                    <el-input v-model="info.bankCard"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="处置费单价:" prop="price">
                    <el-input v-model="info.price"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr v-for="(n,index) in info.rubbishCars">
            <td>
              车辆信息({{index+1}})
              <br><br><el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelect(index)" v-show="index!=0">删除</el-button></td>
            <td>
              <el-form class="demo-form-inline" label-width="140px" :model="info">
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="绑定车牌号:">
                      <el-input placeholder="" v-model="n.licensePlateNumber"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="车险到期:">
                      <el-date-picker v-model="n.insuranceExpirationTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="车险费用:">
                      <el-input v-model="n.insuranceExpenses"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="车险公司:">
                      <el-input v-model="n.insuranceCompany"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </td>
          </tr>
          <tr>
            <td></td>
            <td><el-button type="success" icon="el-icon-plus" @click="addCar()">新增车辆信息</el-button></td>
          </tr>
        </table>
        
        <el-form-item label="修改备注:" prop="remark">
        	<el-input type="textarea" v-model="info.remark"></el-input>
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
	import { axios_get,axios_put } from '@/api/main'
	import { checkNull,checkFlexd,checkPhone } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          id:'',
          name:'',
          mobile:'',
          bankCard:'',
          price:'',
          remark:'',
          rubbishCars:[
            {licensePlateNumber:'',insuranceExpirationTime:'',insuranceExpenses:'',insuranceCompany:''}
          ]
        },
        deleteIds:[],
        rules: {
          name:[
            { required: true, validator: checkNull, trigger: 'blur' }
          ],
          mobile:[
            { required: true, validator: checkPhone, trigger: 'blur' }
          ],
          bankCard:[
            { required: true, validator: checkNull, trigger: 'blur' }
          ],
          price:[
            { required: true, validator: checkFlexd, trigger: 'blur' }
          ],
          remark:[
            { required: true, validator: checkNull, trigger: 'blur' }
          ]
        }
			}
		},
		computed:{
			rub_driver_id(){
				return this.$store.state.admin.rub_driver_id
			}
		},
    mounted() {
      var _self = this
      axios_get('api/admin/rubbish_driver/'+_self.rub_driver_id).then(res => {
        if(res){
          _self.info = res
          _self.info.price = _self.info.price/100
          _self.info.rubbishCars.forEach((value,key) => {
             _self.info.rubbishCars[key].insuranceExpenses = _self.info.rubbishCars[key].insuranceExpenses/100
          })
        }
      })
    },
		methods:{
      //新增车辆信息
			addCar:function(){
				var _self = this
        if(_self.info.rubbishCars.length>=5){
          _self.$message.error({
            message: '车辆信息已达上限',
            offset:200
          })
        }else{
          _self.info.rubbishCars.push({licensePlateNumber:'',insuranceExpirationTime:'',insuranceExpenses:'',insuranceCompany:''})
        }
			},
      handleEdit:function(){
        var _self = this
        var req = JSON.parse(JSON.stringify(_self.info))//深拷贝
        var cars = JSON.parse(JSON.stringify(req.rubbishCars))//深拷贝所有车辆
        //元转分
        req.price*=100
        cars.forEach((value,key) => {
          cars[key].insuranceExpenses*=100
        })
        //删除字段
        delete req.rubbishCars
        //新增字段
        req.createCars = []
        req.updateCars = []
        req.deleteIds = _self.deleteIds
        cars.forEach(value => {
          if(value.id===undefined){
            req.createCars.push(value)
          }
          else{
            req.updateCars.push(value)
          }
        })
        _self.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            _self.$confirm('确认提交修改信息？').then(() => {
              axios_put('api/admin/rubbish_driver/'+_self.rub_driver_id,req).then(res => {
                if(res===null){
                  _self.$router.push("/admin/rub/driverList")
                }
              })
            })
          }
        })

      },
      //删除车辆信息
			handleDelect:function(_index){
				var _self = this
				_self.$confirm('确认删除该车辆信息？').then(() => {
          //删除原有，记录ID
          if(_self.info.rubbishCars[_index].id===undefined){}
          else{
            _self.deleteIds.push(_self.info.rubbishCars[_index].id)
          }
          _self.info.rubbishCars.splice(_index,1)
        })
			},
      back:function(){
      	var _self = this
      	_self.$confirm('确认放弃修改并返回？').then(() => {
          _self.$router.push("/admin/rub/driverList")
        })
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
    height: 180px;
    text-align: center;
  }
</style>
