<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
      <el-form-item label="地区">
      	<el-select v-model="cityId" @change="changeCity">
      	  <el-option label="全部" value=""></el-option>
      		<el-option v-for="n in city_list" :label="n.bname" :value="n.bcode"></el-option>
      	</el-select>
      	<el-select v-model="search_info.area_id">
      	  <el-option label="全部" value=""></el-option>
      		<el-option v-for="n in area_list" :label="n.name" :value="n.code"></el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="单位名">
      	<el-input placeholder="" v-model="search_info.company_name"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
      	<el-input placeholder="" v-model="search_info.company_contacts"></el-input>
      </el-form-item>
      <el-form-item label="电话">
      	<el-input placeholder="" v-model="search_info.mobile"></el-input>
      </el-form-item>
      <el-form-item label="餐厨运输人">
      	<el-input placeholder="" v-model="search_info.rubbish_driver_name"></el-input>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="add_company()">新增单位</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出单位数据</el-button>
			</el-form-item>
      <el-form-item label="导出日期">
        <el-date-picker v-model="month" type="month" placeholder="选择月份" value-format="yyyy-MM"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-download" @click="leadingOutAll()">导出所有记录</el-button>
      </el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="name" label="单位名称"> </el-table-column>
      <el-table-column prop="contacts" label="联系人" width="100"> </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="130"> </el-table-column>
      <el-table-column label="地区">
        <template slot-scope="scope"><span v-for="n in scope.row.areas">{{n.name}}</span></template> </el-table-column>
      <el-table-column prop="address" label="详细地址"></el-table-column>
      <el-table-column prop="rubbishDriver.name" label="餐厨运输人" width="110"> </el-table-column>
      <el-table-column label="预付金额(元)" width="110"><template slot-scope="scope">{{scope.row.prepaidMoeny/100}}</template> </el-table-column>
			<el-table-column label="操作" width="230">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelect(scope.row.id)">删除</el-button>
          <el-button size="mini" type="info" @click="see_code(scope.row.id,scope.row.name)">二维码</el-button>
				</template>
			</el-table-column>
		</el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        @current-change="search"
        >
      </el-pagination>
    </div>

    <!--打印-->
    <el-dialog
    	width="250px"
    	:title="code_title"
    	:visible.sync="code_status"
    	:close-on-click-modal="false"
    	:show-close="true"
    	append-to-body center>
      <div id="qrcode" ref="qrcode" style="padding-left:25px"></div>
    	<span slot="footer" class="dialog-footer">
    		<!-- <el-button @click="code_status = false">取 消</el-button> -->
        <!-- <el-link :href="code_url" target="_blank" :download="code_name">下载二维码</el-link> -->
        <el-link  target="_blank" @click="handleDownload()" id="a_code">下载二维码</el-link>
    		<!-- <el-button type="primary" @click="print()">下载二维码</el-button> -->
    	</span>
    </el-dialog>

	</div>
</template>

<script>
	import { axios_get,axios_delete  } from '@/api/main'
  import { appURL,baseURL } from '@/config'
  import QRCode from 'qrcodejs2'
	export default {
		data(){
			return {
        list:[],
        code_status:false,
        code_title:'',
        code_url:'',
        code_name:'',
        city_list:[],
        area_list:[], //区域列表
        cityId:'',
        total:1,
        month:'',
				search_info:{
					page:1,
					limit:10,
          company_name:'',
          company_contacts:'',
          mobile:'',
          area_id:'',
          rubbish_driver_name:''
				}
			}
		},
    created() {
      //获取当前月
      var date = new Date();
      var seperator = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      var currentmonth = year + seperator + month
      this.month = currentmonth
    },
		mounted() {
			var _self = this
      //初始化值
      _self.search_info.company_name = _self.$store.state.admin.state_search_info.rub_company_name
      _self.search_info.company_contacts = _self.$store.state.admin.state_search_info.rub_company_contacts
      _self.search_info.mobile = _self.$store.state.admin.state_search_info.rub_company_mobile
      _self.search_info.rubbish_driver_name = _self.$store.state.admin.state_search_info.rub_company_driver_name
		  _self.search(1)
      //获取四川城市列表
      axios_get('api/admin/tip_login/area').then(res => {
        if(res){
          res.forEach(value => {
            if(value.acode==510000000){ //抓取四川
              _self.city_list = value.children
            }
          })
        }
      })
		},
		methods:{
			search:function(currentPage){
			  var _self = this

        _self.$store.commit('set_admin_search_info',{
          rub_company_name:_self.search_info.company_name,
          rub_company_mobile:_self.search_info.mobile,
          rub_company_contacts:_self.search_info.company_contacts,
          rub_company_driver_name:_self.search_info.rubbish_driver_name,
        })

			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('api/admin/rubbish_company',_self.search_info).then(res => {
			    if(res){
			      _self.list = res.list
			      _self.total = res.totalCount
			    }
			  })
			},
      // 导出
      leadingOut:function() {
        window.open(baseURL+'/api/admin/rubbish_company/export?'+'token='+ this.$store.state.token+'&company_name='+this.search_info.company_name+'&company_contacts='+this.search_info.company_contacts+'&mobile='+this.search_info.mobile+'&area_id='+this.search_info.area_id);
      },
      leadingOutAll:function(){
        var _self = this
        if(_self.month == ""){
          return
        }
        _self.$confirm('确认导出所有单位的收运记录？').then(() => {
          window.open(baseURL+'/api/admin/rubbish_company/all_records_export?'+'token='+ this.$store.state.token+'&month='+this.month);
        })
          
      },
			handleEdit:function(_id){
				this.$store.commit('admin_rub_company',{_id:_id})
				this.$router.push("/admin/rub/companyDetail")
			},
      handleDelect:function(_id){
        var _self = this
        _self.$confirm('确认删除该单位？').then(() => {
          axios_delete('api/admin/rubbish_company/'+_id).then(res => {
            if(res===null) _self.search(1)
          })
        })
      },
      add_company:function(){
        this.$router.push("/admin/rub/addCompany")
      },
      see_code:function(_id,_name){
        var _self = this
        _self.code_status = true
        _self.code_title = _name
        setTimeout(function(){
          //解决多次生成
          document.getElementById("qrcode").innerHTML = ""
          let qrcode = new QRCode('qrcode',{
            width:150,
            height:150,
            text:appURL+'/records?id='+_id+'&&name='+_name,
            colorDark:'#000',
            colorLight:'#fff'
          })
          _self.code_url = document.getElementById('qrcode').firstChild.toDataURL() //获取二维码
          _self.code_name = _name + '.jpg'
        },200)
      },
      handleDownload:function(){
        var _self = this
        const imgUrl = _self.code_url
          // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
          if (window.navigator.msSaveOrOpenBlob) {
            var bstr = atob(imgUrl.split(',')[1])
            var n = bstr.length
            var u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            var blob = new Blob([u8arr])
            window.navigator.msSaveOrOpenBlob(blob, _self.code_name)
          } else {
            // 这里就按照chrome等新版浏览器来处理
            const a = document.createElement('a')
            a.href = imgUrl
            a.setAttribute('download', _self.code_name)
            a.click()
          }
      },
      out:function(){
        var _self = this
      },
      //切换市
      changeCity:function(){
        var _self = this
        if(_self.cityId==''){
          _self.area_list = []
          _self.search_info.area_id = ''
          return false
        }
        _self.city_list.forEach(value => {
          if(_self.cityId==value.bcode){
            _self.area_list = value.children
            _self.search_info.area_id = _self.area_list[0].code
          }
        })
      }
		}
	}
</script>

<style>

</style>
