<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:" prop="plateNumber">
              <el-input v-model.trim="info.plateNumber"></el-input>
						</el-form-item>
					</el-col>
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
				</el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="入库类型:">
              <el-select v-model="info.recycleType">
              	<el-option label="红油" value="2"></el-option>
              	<el-option label="地沟油" value="3"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="出入库时间:" prop="createTime">
        			<el-date-picker v-model="info.createTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="毛重(kg):" prop="roughWeight">
              <el-input v-model.trim="info.roughWeight"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="皮重(kg):" prop="tareWeight">
        			<el-input v-model.trim="info.tareWeight"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="净重(kg):">
          		<el-tag type="info">{{info.roughWeight-info.tareWeight}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
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
	import { checkNull,checkPhone,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					plateNumber:'',
          driver:'',
          phone:'',
          roughWeight:'',//毛重
          tareWeight:'',//皮重
          recycleType:'2',
          createTime:'',
          updateReason:''
				},
        rules:{
        	plateNumber:[
        		{ required: true,validator: checkNull, trigger: 'blur' }
        	],
          driver:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          createTime:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          tareWeight:[
            { required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          roughWeight:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          phone:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ]
        }
			}
		},
		methods:{
			handleAdd:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认新增记录信息?', '提示').then(()=> {
              axios_post('/api/admin/rubbish_day',_self.info).then( res => {
                if(res){
                  _self.$router.push("/admin/gre/dayList")
                }
              })
            })
          }
        })
			},
			//返回
			back:function(){
				this.$router.push("/admin/gre/dayList")
			}
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 5%;
		width: 80%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
</style>
