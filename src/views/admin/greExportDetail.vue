<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%" class="tac">公司信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="名称:" prop="company_name">
                    <el-input v-model.trim="info.company_name"></el-input>
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
                <el-col :span="16">
                  <el-form-item label="地址:" prop="address">
                    <el-input v-model.trim="info.address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <td class="tac">交易方式</td>
            <td>
              <el-radio v-model="info.type" label="1">送货</el-radio>
              <el-radio v-model="info.type" label="2">自提</el-radio>
            </td>
          </tr>

          <tr>
            <td colspan="2">
              <el-row>
                <el-col :span="8">
                	<el-form-item label="油脂类别:">
                    <el-select v-model="info.recycle_type">
                      <el-option label="红油" value="2"></el-option>
                      <el-option label="地沟油" value="3"></el-option>
                    </el-select>
                	</el-form-item>
                </el-col>

              	<el-col :span="8">
              		<el-form-item label="出库含油率(%):">
                    <el-tag type="info">{{info.oil_content*100}}</el-tag>
              		</el-form-item>
              	</el-col>

                <el-col :span="8">
                	<el-form-item label="结算含油率(%):" prop="settle_oil_content">
                		<el-input v-model.trim="info.settle_oil_content"></el-input>
                	</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                	<el-form-item label="毛重(kg):">
                    <el-tag type="info">{{info.rough_weight}}</el-tag>
                	</el-form-item>
                </el-col>

              	<el-col :span="8" v-if="info.type==1">
              		<el-form-item label="到货含油率(%):" prop="delivery_oil_content">
              			<el-input v-model.trim="info.delivery_oil_content"></el-input>
              		</el-form-item>
              	</el-col>

                <el-col :span="8" v-if="info.type==1">
                  <el-form-item label="去杂净重(kg):">
                    <el-tag type="info">{{(info.net_weight_without_impurity*1).toFixed(2)}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                	<el-form-item label="皮重(kg):" prop="tare_weight">
                		<el-input v-model="info.tare_weight"></el-input>
                	</el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="净重(kg):">
                    <el-tag type="info">{{info.net_weight}}</el-tag>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="结算去杂净重(kg):">
                    <el-tag type="info">{{(info.settle_net_weight_without_impurity*1).toFixed(2)}}</el-tag>
                  </el-form-item>
                </el-col>
               </el-row>

               <el-row>
                <el-col :span="8">
                	<el-form-item label="运输人:" prop="driver">
                		<el-input v-model.trim="info.driver"></el-input>
                	</el-form-item>
                </el-col>

                <el-col :span="8">
                	<el-form-item label="手机号:" prop="phone">
                		<el-input v-model.trim="info.phone"></el-input>
                	</el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="车牌号:">
                    <el-tag type="info">{{info.plate_number}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <td class="tac">结算状态</td>
            <td class="tac">
              {{info.settle_status==1?'已结算':'未结算'}}
            </td>
          </tr>
        </table>

        <el-form-item label="修改备注:" prop="updateReason">
        	<el-input type="textarea" v-model.trim="info.updateReason"></el-input>
        </el-form-item>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-button type="info" disabled v-if="info.account_id">已核对</el-button>
          <el-button type="primary" icon="el-icon-finished" @click="handleEdit" v-if="!info.account_id">保存修改</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put } from '@/api/main'
	import { checkNull,checkPhone,checkFlexd,checkInt } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          "delivery_oil_content": 0,
          "oil_content": 0,
          "address": "",
          "create_time": '',
          "rough_weight": '',
          "contacts":'',
          "mobile": "",
          "settle_status": '',
          "delivery_net_weight_without_impurity": 0,
          "type": '1',
          "net_weight": 0,
          "settle_net_weight_without_impurity": 0,
          "tare_weight": 0,
          "recycle_type": '2',
          "driver": "",
          "phone": "",
          "net_weight_without_impurity": 0,
          "company_name": "",
          "settle_oil_content": 0,
          "id": '',
          "sn": "0",
          "plate_number": "",
          "updateReason":''
        },
				rules:{
					company_name:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
          contacts:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          mobile:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ],
          address:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          delivery_oil_content:[
          	{ required: true,validator: checkInt, trigger: 'blur' }
          ],
          settle_oil_content:[
          	{ required: true,validator: checkInt, trigger: 'blur' }
          ],
          tare_weight:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          driver:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          updateReason:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          phone:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ]
				}
			}
		},
		computed:{
			gre_export_id(){
				return this.$store.state.admin.gre_export_id
			}
		},
    mounted() {
      var _self = this
      axios_get('api/admin/grease_ex_warehouse/'+_self.gre_export_id).then(res => {
        if(res){
          _self.info = res
          _self.info.recycle_type += '' //字符串化
          _self.info.settle_status += ''
          _self.info.type += ''
          _self.info.delivery_oil_content *=100
          _self.info.settle_oil_content *=100
        }
      })
    },
		methods:{
      handleEdit:function(){
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            var req = {
              id:_self.info.id,
              companyName:_self.info.company_name,
              mobile:_self.info.mobile,
              address:_self.info.address,
              contacts:_self.info.contacts,
              type:_self.info.type,
              recycleType:_self.info.recycle_type,
              deliveryOilContent:(_self.info.delivery_oil_content)/100,
              settleOilContent:(_self.info.settle_oil_content)/100,
              driver:_self.info.driver,
              phone:_self.info.phone,
              updateReason:_self.info.updateReason
            }
            _self.$confirm('确认保存修改信息?', '提示').then(()=> {
              axios_put('api/admin/grease_ex_warehouse/'+_self.gre_export_id,req).then( res => {
                if(res===null){
                  _self.$router.push("/admin/gre/export")
                }
              })
            })
        	}else{

        	}
        })

      },
			back:function(_index){
				var _self = this
				_self.$confirm('确认放弃修改并返回？').then(() => {
          this.$router.push('/admin/gre/export')
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
    padding: 20px 10px;
  }
  .tac{
    text-align: center;
  }
</style>
