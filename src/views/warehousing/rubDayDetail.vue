<template>
  <div>
    <div class="out_info_box">
      <el-form
        class="demo-form-inline"
        label-width="140px"
        ref="ruleForm"
        :rules="rules"
        :model="info"
      >
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
        <el-form-item label="行驶路线图:">
          <span v-show="!has_map">暂无路线图</span>
          <div id="driver_map" v-show="has_map"></div>
        </el-form-item>
        <el-form-item label="修改备注:">
          <el-input type="textarea" v-model.trim="info.updateReason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <el-button type="info" disabled v-if="info.accountId">已核对</el-button>
            <el-button
              type="primary"
              icon="el-icon-finished"
              @click="handleEdit"
              v-if="!info.accountId"
            >保存修改</el-button>
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
        append-to-body
      >
        <div id="print_info">
          <div style="display:inline-block;vertical-align: top">开票单位：</div>
          <div style="display:inline-block;">
            <el-radio-group v-model="radio" fill="#000">
              <span style="position: relative;" ref="xx1">
                <el-radio v-model="radio" label="1">四川健骑士生物科技有限公司</el-radio>
                <span style="position: absolute;width:20px;height:20px;left:0;top:-16px;background:#fff;z-index:100;"></span>
                <br />
              </span>

              <span style="position: relative;" ref="xx2">
                <el-radio v-model="radio" label="2">成都友军再生资源回收有限公司</el-radio>
                <span style="position: absolute;width:20px;height:20px;left:0;top:-16px;background:#fff;z-index:100;"></span>
                <br />
              </span>
            </el-radio-group>
          </div>
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
    </div>
  </div>
</template>

<script>
import { axios_get, axios_put } from "@/api/main";
import { checkNull, checkPhone, checkFlexd, time_format } from "@/lib/tools";
export default {
  data() {
    return {
      radio: "1",
      info: {
        id: "",
        sn: "",
        recycleType: "", //回收类别
        plateNumber: "",
        driver: "",
        phone: "",
        roughWeight: "", //毛重
        netWeight: "", //净重
        tareWeight: "", //皮重
        standingBooks: [], //行驶路线
        updateReason: ""
      },
      has_map: true,
      print_status: false,
      rules: {
        driver: [{ required: true, validator: checkNull, trigger: "blur" }],
        tareWeight: [
          { required: true, validator: checkFlexd, trigger: "blur" }
        ],
        updateReason: [
          { required: true, validator: checkNull, trigger: "blur" }
        ],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }]
      }
    };
  },
  computed: {
    //id
    rub_day_id() {
      return this.$store.state.admin.rub_day_id;
    },
    //台账总量
    standing_books_weight() {
      var _self = this;
      let weight = 0;
      _self.info.standingBooks.forEach(item => {
        weight += Number(item.weight);
      });
      return weight;
    }
  },
  mounted() {
    var _self = this;
    axios_get("api/stock/rubbish_day/" + _self.rub_day_id).then(res => {
      if (res) {
        // console.log(res)
        _self.info = res;
        _self.info.recycleType += ""; //字符串化
        if (!res.standingBooks || res.standingBooks.length < 2) {
          _self.has_map = false;
          return;
        }
        var map = new BMap.Map("driver_map");
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
        map.clearOverlays(); //清除地图上所有的覆盖物
        var driving = new BMap.DrivingRoute(map); //创建驾车实例
        // 坐标点数据
        // var pointArr = [
        //   {lng: 120.27330074071, lat: 31.498294737149},
        //   {lng: 120.57330074071, lat: 31.498294737149},
        //   {lng: 120.87330074071, lat: 31.498294737149},
        //   {lng: 121.37330074071, lat: 31.498294737149},
        //   ];

        var pointArr = res.standingBooks;
        // 生成坐标点
        var trackPoint = [];
        for (var i = 0, j = pointArr.length; i < j; i++) {
          trackPoint.push(new BMap.Point(pointArr[i].lng, pointArr[i].lat));
        }
        for (var i = 0; i < trackPoint.length; i++) {
          if (i != trackPoint.length - 1) {
            driving.search(trackPoint[i], trackPoint[i + 1]);
          }
        }
        driving.setSearchCompleteCallback(function() {
          var pts = driving
            .getResults()
            .getPlan(0)
            .getRoute(0)
            .getPath(); //通过驾车实例，获得一系列点的数组
          var polyline = new BMap.Polyline(pts);
          map.addOverlay(polyline);

          // 画图标、想要展示的起点终点途经点
          for (var i = 0; i < trackPoint.length; i++) {
            var lab;
            if (i == 0) {
              lab = new BMap.Label("起点", { position: trackPoint[i] });
            } else if (i == trackPoint.length - 1) {
              lab = new BMap.Label("终点", { position: trackPoint[i] });
            } else {
              /* lab = new BMap.Label("途径点",{position:trackPoint[i]}) */
            }
            var marker = new BMap.Marker(trackPoint[i]);
            map.addOverlay(marker);
            map.addOverlay(lab);
          }
          map.setViewport(trackPoint);
        });
      }
    });
  },
  methods: {
    handleEdit: function() {
      var _self = this;
      _self.$refs["ruleForm"].validate(valid => {
        if (valid) {
          var req = {
            id: _self.info.id,
            tareWeight: _self.info.tareWeight,
            driver: _self.info.driver,
            phone: _self.info.phone,
            updateReason: _self.info.updateReason,
            recycleType: _self.info.recycleType
          };
          _self.$confirm("确认保存修改信息?", "提示").then(() => {
            axios_put("api/stock/rubbish_day/" + _self.rub_day_id, req).then(
              res => {
                if (res) {
                  _self.$router.push("/warehousing/rubDayList");
                }
              }
            );
          });
        } else {
        }
      });
    },
    //返回
    back: function() {
      this.$router.push("/warehousing/rubDayList");
    },
    //时间格式化
    time_format: function(time) {
      return time_format({ time: time });
    },
    //打印弹窗
    start_print: function() {
      var _self = this;
      _self.print_status = true;
    },
    //打印入库单
    print: function() {
      var _self = this;
      if (this.radio == "1") {
        this.$refs.xx2.style.display = "none";
      } else if (this.radio == "2") {
        this.$refs.xx1.style.display = "none";
      }
      axios_put("api/stock/rubbish_day/" + _self.rub_day_id, {
        id: _self.rub_day_id,
        invoiceStatus: 1
      }).then(res => {
        if (res) {
          let wpt = document.getElementById("print_info");
          let bdhtml = window.document.body.innerHTML; //获取当前页的html代码
          let prnhtml = wpt.outerHTML;
          window.document.body.innerHTML = prnhtml;
          window.print();
          window.location.reload();
        }
      });
    }
  }
};
</script>

<style >
.el-radio__input.is-checked+.el-radio__label{
  color: #000;
  font-size: 16px;
}
/* .el-radio__input.is-checked >>> .el-radio__inner{
  background: none;
  border-color: #fff;
} */
.out_info_box {
  margin-left: 5%;
  width: 80%;
  box-shadow: 0 0 5px #ccc;
  padding: 30px 20px;
}
.el-table >>> .cell {
  text-align: center;
}
.el-table >>> th {
  padding: 4px 0;
}
#driver_map {
  width: 600px;
  height: 500px;
  border: 1px solid #ccc;
}
#print_info p span {
  padding: 0 20px;
}
#print_info table {
  width: 100%;
}
#print_info table td {
  border: 1px solid #ccc;
  padding: 10px 20px;
  text-align: center;
}
</style>
