<template>
	<div>
		<div class="out_info_box">
      <table class="info_table" cellspacing="0">
      	<tr>
      		<td width="20%">运输人信息</td>
      		<td>
            <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
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
            </el-form>
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
                	<el-form-item label="车险费用(元):">
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

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleAdd">保存</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post } from '@/api/main'
	import { checkNull,checkPhone } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          name:'',
          mobile:'',
          bankCard:'',
          price:'',
          rubbishCars:[
            {licensePlateNumber:'',insuranceExpirationTime:'',insuranceExpenses:'',insuranceCompany:''}
          ]
        },
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
            { required: true, validator: checkNull, trigger: 'blur' }
          ]
        }
			}
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
      handleAdd:function(){
        var _self = this
        var req = JSON.parse(JSON.stringify(_self.info))
        req.price*=100
        req.rubbishCars.forEach((value,key) => {
          req.rubbishCars[key].insuranceExpenses*=100
        })
        _self.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            _self.$confirm('确认提交新增信息？').then(() => {
              axios_post('api/admin/rubbish_driver',req).then(res => {
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
          _self.info.rubbishCars.splice(_index,1)
        })
			},
      back:function(){
      	var _self = this
      	_self.$confirm('确认放弃新增并返回？').then(() => {
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
