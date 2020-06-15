<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%" class="tac">基本信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="账目名称:" prop="name">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="账目类别:">
                    <el-radio v-model="info.type" label="1">入账</el-radio>
                    <el-radio v-model="info.type" label="2">出账</el-radio>
                    <el-radio v-model="info.type" label="3">抵扣款</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注信息:">
                    <el-input v-model.trim="info.remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <el-switch
                      v-model="info.status"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="启用"
                      active-value="1"
                      inactive-text="禁用"
                      inactive-value="2"
                      >
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
        </table>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleEdit">确认修改</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post,axios_get } from '@/api/main'
	import { checkNull } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          type:'1',
          name:'',
          status:'0',
          remark:''
        },
				rules:{
					name:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
          remark:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ]
				}
			}
		},
		computed:{
			account_id(){
				return this.$store.state.finance.account_id
			}
		},
    mounted() {
      var _self = this
      axios_get('/api/ac/detail/'+_self.account_id).then(res => {
        if(res){
          _self.info = res
          _self.info.type += ''
          _self.info.status += ''
        }
      })
    },
		methods:{
      handleEdit:function(){
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            _self.$confirm('确认保存修改信息?', '提示').then(()=> {
              axios_post('/api/ac/save',_self.info).then( res => {
                if(res===null) _self.$router.push("/finance/fin/accounts")
              })
            })
        	}
        })

      },
			back:function(_index){
				var _self = this
				_self.$confirm('确认放弃修改并返回？').then(() => {
          this.$router.push('/finance/fin/accounts')
        })
			}
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 1%;
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
