<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_info.create_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input placeholder v-model="search_info.plate_number"></el-input>
      </el-form-item>
      <el-form-item label="运输人">
        <el-input placeholder v-model="search_info.driver"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input placeholder v-model="search_info.phone"></el-input>
      </el-form-item>
      <el-form-item label="油脂类别">
        <el-select v-model="search_info.recycle_type">
          <el-option label="全部" value></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="核对状态">
        <el-select v-model="search_info.status">
          <el-option label="全部" value></el-option>
          <el-option label="已核对" value="2"></el-option>
          <el-option label="未核对" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票状态">
        <el-select v-model="search_info.invoice_status">
          <el-option label="全部" value></el-option>
          <el-option label="已开票" value="1"></el-option>
          <el-option label="未开票" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button> -->
      </el-form-item>
    </el-form>

    <el-table :data="list" border>
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column label="入库时间" width="160">
        <template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column prop="sn" label="出入库编号"></el-table-column>
      <el-table-column prop="plate_number" label="车牌号"></el-table-column>
      <el-table-column prop="driver" label="运输人"></el-table-column>
      <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
      <el-table-column label="含油率(%)">
        <template slot-scope="scope">{{ (scope.row.oil_content*100).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="without_impurity_offset" label="除粗渣量(kg)"></el-table-column>
      <el-table-column label="单价(元)">
        <template slot-scope="scope">{{ scope.row.trash_price/100 }}</template>
      </el-table-column>
      <el-table-column label="发生额(元)">
        <template
          slot-scope="scope"
        >{{ (scope.row.net_weight_without_impurity*scope.row.trash_price/100).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="油脂类别" width="80">
        <template
          slot-scope="scope"
        >{{ scope.row.recycle_type==2?'红油':scope.row.recycle_type==3?'地沟油':'固渣' }}</template>
      </el-table-column>
      <el-table-column label="开票状态" width="80">
        <template slot-scope="scope">{{ scope.row.invoice_status==1?'已开票':'未开票' }}</template>
      </el-table-column>
      <el-table-column label="核对状态" width="80">
        <template slot-scope="scope">{{ scope.row.account_id?'已核对':'未核对' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.page"
        @current-change="search"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { axios_get } from "@/api/main";
import { time_format } from "@/lib/tools.js";
export default {
  data() {
    return {
      list: [
        {
          id: "",
          oil_content: "",
          create_time: "",
          rough_weight: "",
          without_impurity_offset: "",
          net_weight: "",
          tare_weight: "",
          recycle_type: "",
          driver: "",
          phone: "",
          net_weight_without_impurity: "",
          sn: "",
          plate_number: "",
          invoice_status: ""
        }
      ],
      total: 0,
      search_info: {
        page: 1,
        limit: 10,
        create_time: "",
        phone: "",
        plate_number: "",
        driver: "",
        invoice_status: "", //开票状态
        recycle_type: "",
        status: ""
      }
    };
  },
  mounted() {
    var _self = this;
    _self.search(1);
  },
  methods: {
    // 导出
    leadingOut() {
      var xxx = {
        page: 1,
        limit: this.total,
        create_time: this.search_info.create_time,
        phone: this.search_info.phone,
        plate_number: this.search_info.plate_number,
        driver: this.search_info.driver,
        invoice_status: this.search_info.invoice_status, //开票状态
        recycle_type: this.search_info.recycle_type,
        status: this.search_info.status
      };
      axios_get("/api/fi/grease_day", xxx).then(res => {
        if (res) {
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/vendor/Export2Excel");
            const tHeader = [
              "入库时间",
              "出入库编号",
              "车牌号",
              "运输人",
              "净重(kg)",
              "含油率(%)",
              "除粗渣量(kg)",
              "单价(元)",
              "发生额(元)",
              "油脂类别",
              "开票状态",
              "核对状态"
            ]; // 对应表格输出的title
            const filterVal = [
              "create_time",
              "sn",
              "plate_number",
              "driver",
              "net_weight",
              "oil_content",
              "without_impurity_offset",
              "trash_price",
              "net_weight_without_impurity",
              "recycle_type",
              "invoice_status",
              "account_id"
            ]; // 对应表格输出的数据
            var list = JSON.parse(JSON.stringify(this.list));
            list = res.list;
            console.log(list);
            list.forEach(item => {
              item.create_time = this.time_format(item.create_time);
              item.oil_content = (item.oil_content * 100).toFixed(2);
              item.trash_price = item.trash_price / 100;
              item.net_weight_without_impurity = (
                (item.net_weight_without_impurity * item.trash_price) 
              ).toFixed(2);
              item.recycle_type =
                item.recycle_type == 2
                  ? "红油"
                  : item.recycle_type == 3
                  ? "地沟油"
                  : "固渣";
              item.invoice_status =
                item.invoice_status == 1 ? "已开票" : "未开票";
              item.account_id = item.account_id ? "已核对" : "未核对";
            });
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "餐厨油脂出库(日)"); // 对应下载文件的名字
          });
        }
      });
    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    search: function(currentPage) {
      var _self = this;
      if (currentPage) {
        _self.search_info.page = currentPage;
      }
      axios_get("/api/stock/grease_day", _self.search_info).then(res => {
        if (res) {
          _self.list = res.list;
          _self.total = res.totalCount;
        }
      });
    },
    handleEdit: function(_id) {
      this.$store.commit("finance_gre_day", { _id: _id });
      this.$router.push("/warehousing/greDayDetail");
    },
    //时间戳格式化
    time_format: function(req) {
      return time_format({ time: req });
    }
  }
};
</script>

<style>
</style>
