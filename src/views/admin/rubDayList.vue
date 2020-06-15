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
      <el-form-item label="状态">
        <el-select value="0" v-model="search_info.invoice_status">
          <el-option label="全部" value></el-option>
          <el-option label="未开票" value="0"></el-option>
          <el-option label="已开票" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="add()">新增记录</el-button>
        <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border show-summary>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="入库时间" width="160">
        <template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="出入库编号">
        <template slot-scope="scope">{{ scope.row.sn }}</template>
      </el-table-column>
      <el-table-column label="车牌号">
        <template slot-scope="scope">{{ scope.row.plate_number }}</template>
      </el-table-column>
      <el-table-column label="运输人">
        <template slot-scope="scope">{{ scope.row.driver }}</template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column prop="weight" label="台账总量(kg)"></el-table-column>
      <el-table-column prop="rough_weight" label="毛重(kg)"></el-table-column>
      <el-table-column prop="tare_weight" label="皮重(kg)"></el-table-column>
      <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{ scope.row.invoice_status==0?'未开票':'已开票' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-if="!scope.row.account_id"
          >删除</el-button>
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
import {baseURL} from '../../config/index.js'
import { axios_get, axios_delete, axios_put } from "@/api/main";
import { time_format } from "@/lib/tools.js";
export default {
  data() {
    return {
      list: [
        {
          driver_id: "",
          create_time: "",
          rough_weight: "",
          weight: "",
          net_weight: "",
          standingBooks: [],
          tare_weight: "",
          driver: "",
          phone: "",
          id: "4",
          sn: "sn2390",
          plate_number: "川A 33399",
          invoice_status: "0"
        }
      ],
      sums_data: {},
      total: 0,
      search_info: {
        page: 1,
        limit: 10,
        create_time: "",
        phone: "",
        plate_number: "",
        driver: "",
        invoice_status: ""
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
      window.open(baseURL+'/api/admin/rubbish_day/export?'+'token='+ this.$store.state.token+'&create_time='+this.search_info.create_time+'&phone='+this.search_info.phone+'&plate_number='+this.search_info.plate_number+'&driver='+this.search_info.driver+'&invoice_status='+this.search_info.invoice_status);
    },
    search: function(currentPage) {
      var _self = this;
      if (currentPage) {
        _self.search_info.page = currentPage;
      }
      axios_get("api/admin/rubbish_day", _self.search_info).then(res => {
        if (res) {
          // console.log(res)
          _self.list = res.list;
          _self.total = res.totalCount;
          _self.sums_data = res.sum;
        }
      });
    },
    handleEdit: function(_id) {
      this.$store.commit("admin_rub_day", { _id: _id });
      this.$router.push("/admin/rub/dayDetail");
    },
    handleDelete: function(_id) {
      var _self = this;
      _self
        .$prompt("是否确认删除该条信息？", "提示", {
          inputPlaceholder: "请填写删除理由", 
          inputPattern: /\S{2,40}/,
          inputErrorMessage: "字数在2-40之间"
        })
        .then(({ value }) => {
          axios_put("api/admin/rubbish_day/" + _id, {
            deletedAt: time_format({ time: null }),
            deleteReason: value
          }).then(res => {
            if (res) _self.search(1);
          });
        })
        .catch(() => {});
    },
    //时间戳格式化
    time_format: function(req) {
      return time_format({ time: req });
    },
    add: function() {
      this.$router.push("/admin/rub/addDay");
    },
    //合计
    getSummaries: function(param) {
      var _self = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        switch (column.property) {
          case "weight":
            sums[index] = _self.sums_data.weight;
            break;
          case "rough_weight":
            sums[index] = _self.sums_data.rough_weight;
            break;
          case "tare_weight":
            sums[index] = _self.sums_data.tare_weight;
            break;
          case "net_weight":
            sums[index] = _self.sums_data.net_weight;
            break;
          default:
            break;
        }
      });
      return sums;
    }
  }
};
</script>

<style>
</style>
