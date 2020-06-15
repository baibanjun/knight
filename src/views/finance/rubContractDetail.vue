<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm">
        <el-row>
        	<el-col :span="6">
        		<el-form-item label="合同编号:">
              <el-tag type="info">{{info.no}}</el-tag>
        		</el-form-item>
        	</el-col>
					<el-col :span="6">
						<el-form-item label="单位名称:">
              <el-tag type="info">{{info.companyName}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="联系人:">
              <el-tag type="info">{{info.companyContacts}}</el-tag>
						</el-form-item>
					</el-col>
				  <el-col :span="6">
				  	<el-form-item label="手机号:">
              <el-tag type="info">{{info.companyMobile}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="公司地址:">
              <el-tag type="info">{{info.companyAddress}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="卫生许可证号:">
              <el-tag type="info">{{info.hygienicLicense}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<hr>
				<el-row>
					<el-col :span="8">
						<el-form-item label="签订时间:">
              <el-tag type="info">{{info.signAContractTime}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="到期时间:">
              <el-tag type="info">{{info.expirationTime}}</el-tag>
						</el-form-item>
					</el-col>
				  <el-col :span="3">
				  	<el-form-item label="是否预付金额:">
				  		<el-switch
                disabled
				  			v-model="info.isPrepaid"
				  			active-color="#13ce66"
				  			inactive-color="#ff4949"
				  			active-text="是"
				  			active-value="1"
				  			inactive-text="否"
				  			inactive-value="0"
				  			>
				  		</el-switch>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="4" v-if="info.isPrepaid=='1'">
				  	<el-form-item prop="prepaidMoeny">
              <el-tag type="info">{{info.prepaidMoeny}}元</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="日预估量(kg):">
              <el-tag type="info">{{info.dayEstimate}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="结算模式:">
              <el-tag type="info">{{info.clearingForm==1?'按单位重量':info.clearingForm==2?'包月付费':'包年付费'}}</el-tag>
						</el-form-item>
					</el-col>
				  <el-col :span="8">
				  	<el-form-item label="单价(元/kg):">
              <el-tag type="info">{{info.price}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="开票:">
				      <el-switch
                disabled
				        v-model="info.isInvoice"
				        active-color="#13ce66"
				        inactive-color="#ff4949"
				        active-text="是"
				        active-value="1"
				        inactive-text="否"
				        inactive-value="0"
				        >
				      </el-switch>
						</el-form-item>
					</el-col>
				  <el-col :span="8" v-if="info.isInvoice=='1'">
				  	<el-form-item label="发票抬头:">
              <el-tag type="info">{{info.invoiceName}}</el-tag>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.isInvoice=='1'">
				  	<el-form-item label="发票账号:">
              <el-tag type="info">{{info.invoiceAccount}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<hr />
				<el-row>
					<el-col :span="8">
						<el-form-item label="签订人员:">
              <el-tag type="info">{{info.signAContractUser}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="手机号:">
              <el-tag type="info">{{info.signAContractMobile}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="运输人员:">
              <el-tag type="info">{{info.transportationUser}}</el-tag>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="手机号:">
              <el-tag type="info">{{info.transportationMobile}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<hr />
				<el-row>
					<el-col :span="8">
						<el-form-item label="地沟油收运:">
				      <el-switch
                disabled
				        v-model="info.isGutterOil"
				        active-color="#13ce66"
				        inactive-color="#ff4949"
				        active-text="是"
				        active-value="1"
				        inactive-text="否"
				        inactive-value="0"
				        >
				      </el-switch>
						</el-form-item>
					</el-col>
				  <el-col :span="8" v-if="info.isGutterOil=='1'">
				  	<el-form-item label="收运人员:">
				      <el-tag type="info">{{info.gutterOilUser}}</el-tag>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.isGutterOil=='1'">
				  	<el-form-item label="手机号:">
				  		<el-tag type="info">{{info.gutterOilMobile}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>

				<el-form-item>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put  } from '@/api/main'
	import { checkNull,checkPhone,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					"id": 3,
          "companyName": "",
          "companyContacts": "",
          "companyMobile": "",
          "companyAddress": "",
          "hygienicLicense": "",
          "signAContractTime": "",
          "expirationTime": "",
          "isPrepaid": '1',
          "prepaidMoeny":'',
          "dayEstimate":'',
          "clearingForm": "1",
          "price": '',
          "isInvoice": '1',
          "invoiceAccount":'',//发票账号
          "invoiceName":'', //发票抬头
          "signAContractUser": "",
          "signAContractMobile": "",
          "transportationUser": "",
          "transportationMobile": "",
          "isGutterOil": '1',
          "gutterOilUser": "",
          "gutterOilMobile": "",
          "remark": ""
				}
			}
		},
		computed:{
			rub_contract_id(){
				return this.$store.state.finance.rub_contract_id
			}
		},
    mounted() {
      var _self = this
      axios_get('/api/fi/rubbish_contract/'+_self.rub_contract_id).then(res => {
        if(res){
          _self.info = res
          _self.info.clearingForm+=''
          _self.info.isPrepaid+=''
          _self.info.isInvoice+=''
          _self.info.isGutterOil+='' //字符串化
          _self.info.prepaidMoeny = _self.info.prepaidMoeny/100 //分转元
          _self.info.price = _self.info.price/100
        }
      })
    },
		methods:{
			handleEdit:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认修改合同信息？').then(()=> {
              var req = JSON.parse(JSON.stringify(_self.info))
              req.prepaidMoeny*=100//元转分
              req.price*=100
              axios_put('/api/fi/rubbish_contract/'+_self.rub_contract_id,req).then(res => {
                if(res){
                  _self.$router.push("/finance/rub/contractList")
                }
              })
            })
          }else{

          }
        })
			},
			back:function(){
				var _self = this
        _self.$router.push("/finance/rub/contractList")
			}
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 2%;
		width: 96%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
</style>
