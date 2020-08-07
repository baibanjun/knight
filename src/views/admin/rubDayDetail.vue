<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:">
              <el-tag type="info">{{info.plateNumber}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="运输人:">
              <el-tag type="info">{{info.driver}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:">
              <el-tag type="info">{{info.phone}}</el-tag>
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
        		<el-form-item label="出入库编号:">
        			<el-tag type="info">{{info.sn}}</el-tag>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="台账总量(kg):">
          		<el-tag type="info">{{ standing_books_weight }}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="毛重(kg):">
              <el-tag type="info">{{info.roughWeight}}</el-tag>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="皮重(kg):" prop="tareWeight">
        			<el-input v-model.trim="info.tareWeight"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="净重(kg):">
          		<el-tag type="info">{{info.netWeight}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
				<el-form-item label="来源单位:">
          <el-table border style="width: 80%" :data="info.standingBooks">
            <el-table-column prop="name" label="单位名称"></el-table-column>
            <el-table-column prop="weight" label="台账量(kg)"></el-table-column>
          </el-table>
				</el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="add_books" icon="el-icon-plus">添加台账</el-button>
        </el-form-item>
        <el-form-item label="行驶路线图:">
          <span  v-show="!has_map">暂无路线图</span>
          <div  id="driver_map" v-show="has_map"></div>
        </el-form-item>
        <el-form-item label="修改备注:">
        	<el-input type="textarea" v-model.trim="info.updateReason"></el-input>
        </el-form-item>
				<el-form-item>
					<el-col :span="8">
            <el-button type="info" disabled="" v-if="info.accountId">已核对</el-button>
            <el-button type="primary" icon="el-icon-finished" @click="handleEdit" v-if="!info.accountId">保存修改</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-col>
          <el-col :span="8">
          	<el-button type="success" @click="start_print" icon="el-icon-printer" round>打印入库单</el-button>
          </el-col>
				</el-form-item>
			</el-form>
      <!--打印-->
      <el-dialog
      	width="50%"
      	title="打印预览"
      	:visible.sync="print_status"
      	:close-on-click-modal="false"
      	:show-close="false"
      	append-to-body>
        <div id="print_info">
          <p>
            <span>车牌号: {{info.plateNumber}}</span>
            <span>运输人: {{info.driver}}</span>
            <span>手机号: {{info.phone}}</span>
            <span>入库时间: {{info.createTime}}</span>
          </p>
          <table cellspacing="0">
            <tr>
              <td>入库类型</td>
              <td>出入库编号</td>
              <td>毛重</td>
              <td>皮重</td>
              <td>净重</td>
            </tr>
            <tr>
              <td>{{info.recycleType==1?'餐厨垃圾':info.recycleType==2?'红油':'地沟油'}}</td>
              <td>{{info.sn}}</td>
              <td>{{info.roughWeight}}kg</td>
              <td>{{info.tareWeight}}kg</td>
              <td>{{info.netWeight}}kg</td>
            </tr>
          </table>
        </div>
      	<span slot="footer" class="dialog-footer">
      		<el-button @click="print_status = false">取 消</el-button>
      		<el-button type="primary" @click="print()">确认打印</el-button>
      	</span>
      </el-dialog>
      <!--打印-->
      <el-dialog
        width="30%"
        title="添加台账"
        :visible.sync="books_status"
        :close-on-click-modal="false"
        :show-close="false"
        append-to-body>
        <div>
          <el-form label-width="100px">
              <el-form-item label="车牌号:">
                <el-tag type="info">{{info.plateNumber}}</el-tag>
              </el-form-item>
              <el-form-item label="台账量(kg):">
                <el-input v-model.trim="books_req.weight"></el-input>
              </el-form-item>
              <el-form-item label="单位名称:">
                <el-select v-model="books_req.companyId">
                  <el-option :label="n.name" :value="n.id" v-for="n in company_list"></el-option>
                </el-select>
              </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="books_status = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddBooks()">确认添加</el-button>
        </span>
      </el-dialog>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put,axios_post } from '@/api/main'
	import { checkNull,checkPhone,checkFlexd,time_format } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
          id:'',
          sn:'',
          recycleType:'', //回收类别
					plateNumber:'',
          driver:'',
          phone:'',
          roughWeight:'',//毛重
          netWeight:'',//净重
          tareWeight:'',//皮重
          standingBooks:[],//行驶路线
          updateReason:''
				},
        has_map:true,
        print_status:false,
        books_status:false,
        books_req:{
          companyId:"",
          weight:null,
        },
        company_list:[],
        rules:{
        	driver:[
        		{ required: true,validator: checkNull, trigger: 'blur' }
        	],
          tareWeight:[
            { required: true,validator: checkFlexd, trigger: 'blur' }
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
      //id
			rub_day_id(){
				return this.$store.state.admin.rub_day_id
			},
      //台账总量
      standing_books_weight(){
        var _self = this
        let weight = 0
        _self.info.standingBooks.forEach(item => {
          weight += Number(item.weight)
        })
        return weight
      }
		},
    mounted() {
      var _self = this
      _self.getInfo()
      //单位表
      axios_get('api/admin/rubbish_company',{page:1,limit:1000,}).then(res => {
        if(res){
          _self.company_list = res.list
        }
      })
    },
		methods:{
      getInfo:function(){
        var _self = this
        axios_get('api/admin/rubbish_day/'+_self.rub_day_id).then(res => {
          if(res){
            _self.info = res
            _self.info.recycleType += '' //字符串化
            if(!res.standingBooks||res.standingBooks.length<2){
              _self.has_map = false
              return
            }
            var map = new BMap.Map("driver_map");
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
            map.clearOverlays();                        //清除地图上所有的覆盖物
            var driving = new BMap.DrivingRoute(map);    //创建驾车实例

            var pointArr = res.standingBooks
            // 生成坐标点
            var trackPoint = [];
            for (var i = 0, j = pointArr.length; i < j; i++) {
              trackPoint.push(new BMap.Point(pointArr[i].lng, pointArr[i].lat));
            }
            for (var i = 0; i < trackPoint.length; i++) {
              if(i != trackPoint.length -1 ){
                driving.search(trackPoint[i], trackPoint[i+1]);
              }
            }
            driving.setSearchCompleteCallback(function(){
              var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
              var polyline = new BMap.Polyline(pts);
              map.addOverlay(polyline);

              // 画图标、想要展示的起点终点途经点
              for (var i = 0; i < trackPoint.length; i++) {
                var lab;
                  if(i == 0){
                    lab = new BMap.Label("起点",{position:trackPoint[i]});
                    }else if(i == trackPoint.length - 1){
                      lab = new BMap.Label("终点",{position:trackPoint[i]});
                    }else{
                      /* lab = new BMap.Label("途径点",{position:trackPoint[i]}) */
                    }
                  var marker = new BMap.Marker(trackPoint[i])
                  map.addOverlay(marker);
                  map.addOverlay(lab);
              }
              map.setViewport(trackPoint);
            });
          }
        })
      },
			handleEdit:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            var req = {
              id:_self.info.id,
              tareWeight:_self.info.tareWeight,
              driver:_self.info.driver,
              phone:_self.info.phone,
              updateReason:_self.info.updateReason,
              recycleType:_self.info.recycleType
            }
            _self.$confirm('确认保存修改信息?', '提示').then(()=> {
              axios_put('api/admin/rubbish_day/'+_self.rub_day_id,req).then( res => {
                if(res){
                  _self.$router.push("/admin/rub/dayList")
                }
              })
            })
          }else{

          }
        })
			},
			//返回
			back:function(){
				this.$router.push("/admin/rub/dayList")
			},
      //时间格式化
      time_format:function(time){
        return time_format({time:time})
      },
      //打印弹窗
      start_print:function(){
        var _self = this
        _self.print_status = true
      },
      //打印弹窗
      add_books:function(){
        var _self = this
        _self.books_status = true
      },
      //打印入库单
      print:function(){
        var _self = this
        axios_put('api/admin/rubbish_day/'+_self.rub_day_id,{id:_self.rub_day_id,invoiceStatus:1}).then( res => {
          if(res){
            let wpt = document.getElementById('print_info')
            let bdhtml = window.document.body.innerHTML;//获取当前页的html代码
            let prnhtml = wpt.outerHTML
            window.document.body.innerHTML=prnhtml;
            window.print();
            window.location.reload();
          }
        })
      },
      confirmAddBooks:function(){
        var _self = this
        var req = {stockId:_self.info.id,plateNumber:_self.info.plateNumber}
        req = Object.assign(req,_self.books_req);
        if(req.weight<=0 || !req.companyId){
          _self.$message.error({
             message: '数据有误,请检查后提交',
             offset:150
          })
          return
        }
        axios_post('api/admin/rubbish_day/book',req).then( res => {
          if(res){
            _self.books_status = false
            _self.books_req = {companyId:"",weight:null}
            _self.getInfo()
          }
        })
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
  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>> th{
    padding: 4px 0;
  }
  #driver_map{
    width: 600px;
    height: 500px;
    border: 1px solid #ccc;
  }
  #print_info p span{
    padding: 0 20px;
  }
  #print_info table{
    width: 100%;
  }
  #print_info table td{
    border: 1px solid #ccc;
    padding: 10px 20px;
    text-align: center;
  }
</style>
