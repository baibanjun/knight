<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:" prop="plateNumber">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="info.plateNumber"
                :fetch-suggestions="searchDriver"
                placeholder="请输入车牌号"
                @select="handleSelectDriver"
              >
                <template slot-scope="{ item }">
                    <div class="name">{{ item.license_plate_number }}</div>
                    <span class="label">{{ item.name }}( {{ item.mobile}} )</span>
                  </template>
              </el-autocomplete>
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
              	<el-option label="餐厨垃圾" value="1"></el-option>
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="含油率(%):">
              <el-input v-model.trim="info.oilContent"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="除粗渣量(kg):">
              <el-input v-model.trim="info.withoutImpurityOffset"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价(元):">
              <el-input v-model.trim="info.trashPrice"></el-input>
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
          oilContent:'',
          withoutImpurityOffset:'',
          trashPrice:'',
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
        var _info = JSON.parse(JSON.stringify(_self.info))
        _info.oilContent /= 100
        _info.trashPrice *= 100
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认新增记录信息?', '提示').then(()=> {
              axios_post('/api/stock/rubbish_day',_info).then( res => {
                if(res){
                  _self.$router.push("/warehousing/stock")
                }
              })
            })
          }
        })
			},
			//返回
			back:function(){
				this.$router.push("/warehousing/stock")
			},
      searchDriver:function(queryString, cb){
        let _self = this
        if(queryString){
          axios_post('api/stock/search_driver',{license_plate_number:queryString,name:'',mobile:''}).then( res => {
            cb(res)
          })
        }
      },
      handleSelectDriver:function(value){
        let _self = this
        _self.info.plateNumber = value.license_plate_number
        _self.info.driver = value.name
        _self.info.phone = value.mobile
      },
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
  .my-autocomplete li{
      padding: 7px;
      line-height: 25px !important;
  }
  .my-autocomplete li .name{
      text-overflow: ellipsis;
      overflow: hidden;
  }
  .my-autocomplete li .label{
      font-size: 12px;
      color: #b4b4b4;
  }
</style>
