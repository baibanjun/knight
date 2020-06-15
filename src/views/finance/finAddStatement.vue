<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%" class="tac">个人信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="送货人:" prop="company_name">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="手机号:" prop="contacts">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <td class="tac">账单信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="账单类别:">
                    <el-select v-model="info.name">
                      <el-option label="餐厨垃圾" value="1"></el-option>
                      <el-option label="红油" value="2"></el-option>
                      <el-option label="地沟油" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="当月重量(kg):" prop="settle_oil_content">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="累计结欠(元):" prop="settle_oil_content">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="抵扣款项:"></el-form-item>
              </el-row>
              <el-row v-for="(n,index) in info.money_list">
                <el-col :span="8">
                  <el-form-item>
                    <el-select v-model="n.type">
                      <el-option label="社保" value="1"></el-option>
                      <el-option label="保险" value="2"></el-option>
                      <el-option label="公积金" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="抵扣金额(元):" prop="settle_oil_content">
                    <el-input v-model.trim="n.num"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-button type="success" icon="el-icon-plus" circle v-if="index==0" @click="add_project"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle  v-if="index!=0" @click="del_project(index)"></el-button>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注信息:" prop="settle_oil_content">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
        </table>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleAdd">确认新增</el-button>
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
          name:123,
          money_list:[
            {type:'1',num:12}
          ],
          "updateReason":''
        },
				rules:{
					company_name:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
          mobile:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ],
          delivery_oil_content:[
          	{ required: true,validator: checkInt, trigger: 'blur' }
          ],
          tare_weight:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
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
      // axios_get('api/admin/grease_ex_warehouse/'+_self.gre_export_id).then(res => {
      //   if(res){
      //     _self.info = res
      //     _self.info.recycle_type += '' //字符串化
      //     _self.info.settle_status += ''
      //     _self.info.type += ''
      //     _self.info.delivery_oil_content *=100
      //     _self.info.settle_oil_content *=100
      //   }
      // })
    },
		methods:{
      handleAdd:function(){
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            _self.$confirm('确认保存修改信息?', '提示').then(()=> {
              axios_put('api/admin/grease_ex_warehouse/'+_self.gre_export_id,req).then( res => {
                if(res===null){
                  _self.$router.push("/finance/gre/export")
                }
              })
            })
        	}else{

        	}
        })

      },
			back:function(_index){
				var _self = this
				_self.$confirm('确认放弃新增并返回？').then(() => {
          this.$router.push('/finance/fin/statement')
        })
			},
      //新增和删除扣款项
      add_project:function(){
        this.info.money_list.push({type:'1',num:''})
      },
      del_project:function(_index){
        this.info.money_list.splice(_index,1)
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
