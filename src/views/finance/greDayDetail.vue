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
              <el-tag type="info">{{info.plate_number}}</el-tag>
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
            <el-form-item label="入库编号:">
              <el-tag type="info">{{info.sn}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库类型:">
              <el-tag type="info">{{info.recycle_type==1?'餐厨垃圾':info.recycle_type==2?'红油':'地沟油'}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <hr />
        <el-row>
          <el-col :span="8">
            <el-form-item label="毛重(kg):">
              <el-tag type="info">{{info.rough_weight}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="皮重(kg):">
              <el-tag type="info">{{info.tare_weight}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="净重(kg):">
              <el-tag type="info">{{info.net_weight}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="含油率(%):">
              <el-tag type="info">{{(info.oil_content*100).toFixed(2)}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="去杂净重(kg):">
              <el-tag type="info">{{(info.net_weight*info.oil_content).toFixed(2)}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="除粗渣量(kg):">
              <el-tag type="info">{{ info.without_impurity_offset }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单价(元):" prop="trash_price">
              <el-input v-model.trim="info.trash_price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发生额(元):">
              <el-tag type="info">{{(info.net_weight*info.oil_content*info.trash_price).toFixed(2)}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="修改备注:">
          <el-input type="textarea" v-model.trim="info.update_reason"></el-input>
        </el-form-item>

        <el-form-item>
          <el-col :span="6">
            <el-button
              icon="el-icon-document-checked"
              type="warning"
              @click="post_price(2)"
              v-if="!info.account_id"
            >入账核对</el-button>
            <el-button type="info" disabled v-if="info.account_id">已核对</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-col>
          <el-col :span="6">
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
          <!-- <div style="display:inline-block;vertical-align: top">开票单位：</div>
          <div style="display:inline-block;">
            <el-radio-group v-model="radio" fill = '#000'>
              <span ref="xx1"><el-radio  v-model="radio" label="1">四川健骑士生物科技有限公司</el-radio><br></span>
              
              <span ref="xx2"><el-radio  v-model="radio" label="2">成都友军再生资源回收有限公司</el-radio><br></span>
            </el-radio-group>
              
          </div> -->
          <p>
            <span>车牌号: {{info.plate_number}}</span>
            <span>运输人: {{info.driver}}</span>
            <span>手机号: {{info.phone}}</span>
            <span>入库时间: {{ time_format(info.create_time) }}</span>
          </p>
          <table cellspacing="0">
            <tr>
              <th>入库类型</th>
              <th>出入库编号</th>
              <th>毛重</th>
              <th>皮重</th>
              <th>净重</th>
            </tr>
            <tr>
              <td>{{info.recycle_type==1?'餐厨垃圾':info.recycle_type==2?'红油':'地沟油'}}</td>
              <td>{{info.sn}}</td>
              <td>{{info.rough_weight}}kg</td>
              <td>{{info.tare_weight}}kg</td>
              <td>{{info.net_weight}}kg</td>
            </tr>
            <tr>
              <th>除粗渣量</th>
              <th>含油率</th>
              <th>去杂净重</th>
              <th>单价</th>
              <th>发生额</th>
            </tr>
            <tr>
              <td>{{info.without_impurity_offset}}</td>
              <td>{{info.oil_content*100}}</td>
              <td>{{(info.net_weight*info.oil_content).toFixed(2)}}kg</td>
              <td>{{info.trash_price}}元</td>
              <td>{{(info.net_weight*info.oil_content*info.trash_price).toFixed(2)}}元</td>
            </tr>
          </table>
          <p>
            <!-- <span>来源单位: {{info.plate_number}}</span> -->
          </p>
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
import { axios_get, axios_put, axios_post } from "@/api/main";
import { checkNull, checkPhone, checkFlexd, time_format } from "@/lib/tools";
export default {
  data() {
    return {
      radio: "1",
      info: {
        id: "",
        sn: "",
        recycle_type: "", // 回收类别
        plate_number: "",
        driver: "",
        phone: "",
        oil_content: "",
        rough_weight: "", // 毛重
        net_weight: "", // 净重
        tare_weight: "", // 皮重
        total: "",
        left_value: "",
        without_impurity_offset: 5, // 粗渣
        update_reason: "",
        impurity: "",
        account_id: null,
        trash_price: null
      },
      print_status: false,
      rules: {
        trash_price: [
          { required: true, validator: checkFlexd, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    gre_day_id() {
      return this.$store.state.finance.gre_day_id;
    }
  },
  mounted() {
    var _self = this;
    axios_get("api/fi/grease_day/" + _self.gre_day_id).then(res => {
      if (res) {
        _self.info = res;
        _self.info.recycle_type += ""; // 字符串化
        _self.info.without_impurity_offset += "";
        _self.info.trash_price = _self.info.trash_price / 100;
      }
    });
  },
  methods: {
    handleEdit: function() {
      var _self = this;
      _self.$confirm("确认保存修改信息?", "提示").then(() => {
        //仅修改
        _self.post_price(1);
      });
    },
    post_price: function(_type) {
      var _self = this;
      _self.$refs["ruleForm"].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(_self.info));
          var req = {
            id: data.id,
            price: data.trash_price * 100,
            remark: data.update_reason
          };
          axios_post("/api/fi/grease_day/update/price", req).then(res => {
            if (res == null) {
              if (_type == 1) {
                _self.$router.push("/finance/gre/dayList");
              } else {
                //核对
                _self.account_examine();
              }
            }
          });
        }
      });
    },
    //入账核对
    account_examine: function() {
      var _self = this;
      _self
        .$confirm(
          (
            _self.info.net_weight *
            _self.info.oil_content *
            _self.info.trash_price
          ).toFixed(2) + " 元",
          "入账金额",
          { type: "info" }
        )
        .then(() => {
          var req = {
            time: time_format({
              time: _self.info.create_time,
              format: "YY-MM"
            }),
            carNumber: _self.info.plate_number,
            driverName: _self.info.driver,
            phone: _self.info.phone,
            pureWeight: _self.info.net_weight, //净重
            occurAmount: (
              _self.info.net_weight *
              _self.info.oil_content *
              _self.info.trash_price *
              100
            ).toFixed(0), //发生额
            type: _self.info.recycle_type,
            records: [_self.info.sn] //编号列表，日 只有一个
          };
          axios_post("/api/fi/oil/checkin", req).then(res => {
            if (res === null) {
              this.$router.push("/finance/gre/dayList");
            }
          });
        });
    },
    // 返回
    back: function() {
      this.$router.push("/finance/gre/dayList");
    },
    //打印弹窗
    start_print: function() {
      var _self = this;
      _self.print_status = true;
    },
    //打印入库单
    print: function() {
      var _self = this;
      // console.log(this.radio)
      // if(this.radio=='1'){
      //   this.$refs.xx2.style.display='none'
      // }else if(this.radio=='2'){
      //   this.$refs.xx1.style.display='none'
      // }
      axios_get("api/fi/grease_day/print/" + _self.gre_day_id).then(res => {
        
        if (res === null) {
          let wpt = document.getElementById("print_info");
          let bdhtml = window.document.body.innerHTML; //获取当前页的html代码
          let prnhtml = wpt.outerHTML;
          window.document.body.innerHTML = prnhtml;
          window.print();
          window.location.reload();
        }
      });
    },
    //时间戳格式化
    time_format: function(req) {
      return time_format({ time: req });
    }
  }
};
</script>

<style scoped>
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
#print_info p span {
  padding: 0 20px;
}
#print_info table {
  width: 100%;
}
#print_info table td,
#print_info table th {
  border: 1px solid #ccc;
  padding: 10px 20px;
  text-align: center;
}
</style>
