<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="日期:">
              <el-tag>{{finance_info.time}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="总净重(kg):">
              <el-tag type="info">{{finance_info.pureWeight}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="废弃固渣(车):">
              <el-tag type="info">{{finance_info.carNum}}</el-tag>
          	</el-form-item>
          </el-col>
				</el-row>
        <el-row>
          <el-col :span="8">
          	<el-form-item label="加工油净重(kg):">
          		<el-tag type="info">{{finance_info.oilPureWeight}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="去杂净重(kg):">
          		<el-tag type="info">{{(finance_info.finalPureWeight*1).toFixed(2)}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="废物处置费(元):" prop="price">
          		<el-tag type="info">{{finance_info.totalAmount}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <hr>
				<el-form-item>
          <el-row>
              <el-button icon="el-icon-document-checked" type="warning" @click="account_examine" v-if="status==1">入账核对</el-button>
              <el-button type="info" disabled  v-if="status==0">已核对</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-row>

				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post,axios_get  } from '@/api/main'
	export default{
		data(){
			return{
        status:0 //0为已核对
      }
		},
    computed:{
      finance_info(){
      	return this.$store.state.finance.finance_info
      }
    },
    mounted(){
      var _self = this
      //判断是否核对
      axios_get('/api/fi/so/query/'+_self.finance_info.time).then(res => {
        if(res==0){ //0为已核对
          _self.status = 0
        }
        else{
          _self.status = 1
        }
      })
    },
		methods:{
			//返回
			back:function(){
				var _self = this
        _self.$router.push("/finance/rub/disposeList")
			},
      account_examine:function(){
      	var _self = this
        _self.$confirm(_self.finance_info.totalAmount + '元','出账金额',{type: 'info'}).then(()=> {
          var req = JSON.parse(JSON.stringify(_self.finance_info))
          req.totalAmount*=100
          axios_post('/api/fi/so/checkin',req).then(res => {
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
