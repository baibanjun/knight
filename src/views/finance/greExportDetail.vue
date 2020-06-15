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
                  <el-form-item label="名称:">
                    <el-tag type="info">{{info.company_name}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系人:">
                    <el-tag type="info">{{info.contacts}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="手机号:">
                    <el-tag type="info">{{info.mobile}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="地址:">
                    <el-tag type="info">{{info.address}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <td class="tac">交易方式</td>
            <td class="tac">
              {{info.type==1?'送货':'自提'}}
            </td>
          </tr>

          <tr>
            <td colspan="2">
              <el-row>
              	<el-col :span="8">
              		<el-form-item label="结算去杂净重(kg):">
              		  <el-tag type="info">{{info.settle_net_weight_without_impurity.toFixed(2)}}</el-tag>
              		</el-form-item>
              	</el-col>
                <el-col :span="8">
                	<el-form-item :label="info.type==1?'送货单价:':'自提单价:'" prop="trash_price">
                		<el-input v-model.trim="info.trash_price"></el-input>
                	</el-form-item>
                </el-col>
                <el-col :span="8">
                	<el-form-item label="发生额(元):">
                    <el-tag type="info">{{ (info.net_weight*info.settle_oil_content*info.trash_price).toFixed(2) }}</el-tag>
                	</el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                	<el-form-item label="拉运费用(元):">
                		<el-input v-model.trim="info.pull_amount"></el-input>
                	</el-form-item>
                </el-col>
              </el-row>

               <el-row v-if="info.type==1">
                <el-col :span="8">
                	<el-form-item label="运输人:" prop="driver">
                    <el-tag type="info">{{info.driver}}</el-tag>
                	</el-form-item>
                </el-col>

                <el-col :span="8">
                	<el-form-item label="手机号:" prop="phone">
                    <el-tag type="info">{{info.phone}}</el-tag>
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
            <td class="tac">核对状态</td>
            <td class="tac">
              {{info.settle_status==0?'未核对':'已核对'}}
            </td>
          </tr>
        </table>

        <el-form-item label="修改备注:">
        	<el-input type="textarea" v-model.trim="info.fi_remark"></el-input>
        </el-form-item>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-col :span="6">
            <el-button icon="el-icon-document-checked" type="warning" @click="post_price(2)" v-if="info.settle_status==0">入账核对</el-button>
            <el-button type="info" disabled v-if="info.settle_status!=0">已核对</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-col>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post } from '@/api/main'
	import { checkNull,checkFlexd,checkInt } from '@/lib/tools'
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
          trash_price:null,
          pull_amount:null,
          "net_weight_without_impurity": 0,
          "company_name": "",
          "settle_oil_content": 0,
          "id": '',
          "sn": "0",
          "plate_number": "",
          "fi_remark":''
        },
				rules:{
          fi_remark:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          trash_price:[
            {required: true,validator: checkFlexd, trigger: 'blur'}
          ]
				}
			}
		},
		computed:{
			gre_export_id(){
				return this.$store.state.finance.gre_export_id
			}
		},
    mounted() {
      var _self = this
      axios_get('api/fi/grease_ex_warehouse/'+_self.gre_export_id).then(res => {
        if(res){
          _self.info = res
          _self.info.settle_status += ''
          _self.info.type += ''
          _self.info.trash_price = _self.info.trash_price/100
          _self.info.pull_amount = _self.info.pull_amount/100
        }
      })
    },
		methods:{
      handleEdit:function(){
      	var _self = this
        _self.$confirm('确认保存修改信息?', '提示').then(()=> {
          _self.post_price(1)
        })
      },
      post_price:function(_type){
        var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            var data = JSON.parse(JSON.stringify(_self.info))
            var req = {
              id: data.id,
              price: data.trash_price*100,
              remark: data.fi_remark
            }
            axios_post('/api/fi/oilout/update/price',req).then( res => {
              if(res===null){
                if(_type==1){
                  _self.$router.push("/finance/gre/export")
                }
                else{
                  _self.account_examine()
                }
              }
            })
          }
        })
      },
      //入账核对
      account_examine:function(){
      	var _self = this
        _self.$confirm((_self.info.net_weight*_self.info.settle_oil_content*_self.info.trash_price).toFixed(2) + ' 元','入账金额',{type: 'info'}).then(()=> {
          var req = {
            "trader":_self.info.company_name,
            "amount":(_self.info.net_weight*_self.info.settle_oil_content*_self.info.trash_price*100).toFixed(0), //发生额
            "pullAmount":data.pull_amount*100,
            "type": _self.info.recycle_type,
            "stockId": _self.info.id //编号列表，日 只有一个
          }
          axios_post('/api/fi/oilout/checkin',req).then(res => {
            if(res===null){
              this.$router.push("/finance/gre/export")
            }
          })
        })
      },
			back:function(_index){
				var _self = this
				_self.$confirm('确认放弃修改并返回？').then(() => {
          this.$router.push('/finance/gre/export')
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
