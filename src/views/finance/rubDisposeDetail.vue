<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="日期:">
              <el-tag>{{info.dateStr}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="总净重(kg):">
              <el-tag type="info">{{info.netWeightTotal}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="废弃固渣(车):">
              <el-tag type="info">{{info.solidRubbishAmount}}</el-tag>
          	</el-form-item>
          </el-col>
				</el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="废物处置费(元):" prop="price">
        			<!-- <el-tag type="info">{{info.price/100}}</el-tag> -->
              <el-input v-model.trim="info.price"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="加工油净重(kg):">
          		<el-tag type="info">{{info.netWeightOil}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="去杂净重(kg):">
          		<el-tag type="info">{{info.netWeightWithoutImpurity}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="修改备注:">
        	<el-input type="textarea" v-model.trim="info.remark"></el-input>
        </el-form-item>
        <hr>
				<el-form-item>
          <el-row>
            <!-- <el-col :span="6">
              <el-button icon="el-icon-document-checked" type="warning" @click="account_examine">入账核对</el-button>
              <el-button type="info" disabled>已核对</el-button>
            </el-col> -->
            <el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-row>

				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post  } from '@/api/main'
  import { checkNull,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					id:'',
					dateStr:'',
					solidRubbishAmount:'',
					netWeightWithoutImpurity:'',//去杂
					netWeightTotal:'',//总净重
					netWeightOil:'',
					remark:'',
          price:''
				},
        rules:{
        	price:[
        		{ required: true,validator: checkFlexd, trigger: 'blur' }
        	],
          remark:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ]
        }
			}
		},
    mounted() {
      var _self = this
      //详情
      axios_get('/api/fi/rubbish_day_auto/'+_self.rub_dispose_id).then(res => {
        if(res){
          _self.info = res
          _self.info.price = _self.info.price/100
        }
      })
      
    },
    computed:{
      rub_dispose_id(){
      	return this.$store.state.finance.rub_dispose_id
      }
    },
		methods:{
			//返回
			back:function(){
				var _self = this
        _self.$router.push("/finance/rub/disposeList")
			},
      account_examine:function(){
      	var _self = this
        _self.$confirm(_self.info.price/100 + '元','出账金额',{type: 'info'}).then(()=> {

        })
      },
      handleEdit:function(){
        var _self = this
        _self.$confirm('确认修改废物处置费?', '提示').then(()=> {
          axios_post('/api/fi/so/update/price',{id:_self.rub_dispose_id,remark:_self.info.remark,amount:_self.info.price*100}).then(res => {
            if(res===null){
              _self.$router.push("/finance/rub/disposeList")
            }
          })
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
