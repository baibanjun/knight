<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker
          v-model="search_info.time"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="送货人">
        <el-input placeholder v-model="search_info.driverName"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input placeholder v-model="search_info.carNumber"></el-input>
      </el-form-item>
      <el-form-item label="核算状态">
        <el-select v-model="search_info.status">
          <el-option label="全部" value="0"></el-option>
          <el-option label="未核算" value="1"></el-option>
          <el-option label="已核算" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账单类型">
        <el-select v-model="search_info.type">
          <el-option label="全部" value="0"></el-option>
          <el-option label="餐厨垃圾" value="1"></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="id" label="账单编号"></el-table-column>
      <el-table-column prop="carNumber" label="车牌号"></el-table-column>
      <el-table-column label="送货人">
        <template slot-scope="scope">{{scope.row.driverName||'--'}}</template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">{{scope.row.phone||'--'}}</template>
      </el-table-column>
      <el-table-column label="账单类型">
        <template
          slot-scope="scope"
        >{{scope.row.categoryId==1?'餐厨垃圾':scope.row.categoryId==2?'红油':'地沟油'}}</template>
      </el-table-column>
      <el-table-column label="累积结欠(元)">
        <template slot-scope="scope">
          <el-button type="danger" circle size="mini" disabled v-if="scope.row.inOutType==2">出</el-button>
          <el-button type="success" circle size="mini" disabled v-if="scope.row.inOutType==1">入</el-button>&nbsp;
          <el-tag type="info">{{(scope.row.totalAmount+scope.row.deductAmount)/100}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="抵扣款">
        <template slot-scope="scope">{{scope.row.deductAmount/100}}</template>
      </el-table-column>
      <el-table-column label="实付金额">
        <template slot-scope="scope">{{scope.row.totalAmount/100}}</template>
      </el-table-column>
      <el-table-column prop="bankCard" label="银行账号"></el-table-column>
      <el-table-column label="核算状态">
        <template slot-scope="scope">{{scope.row.status==2?'已核算':scope.row.status==3?'已清账':'未核算'}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-if="scope.row.status!=3"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.offset"
        @current-change="search"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { axios_post, axios_get } from "@/api/main";
export default {
  data() {
    return {
      list: [
        {
          id: "-",
          driverName: "-",
          phone: "-",
          categoryName: "-",
          status: "2",
          totalAmount: "0",
          remark: ""
        }
      ],
      total: 1,
      search_info: {
        offset: 1,
        limit: 10,
        time: "",
        carNumber:'',
        driverName: "",
        status: "0",
        type: "0"
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
        offset: 1,
        limit: this.total,
        time: this.search_info.time,
        driverName: this.search_info.driverName,
        status: this.search_info.status,
        type: this.search_info.type,
        carNumber:this.search_info.carNumber
      };

      axios_post("/api/fi/payment/list", xxx).then(res => {
        if (res) {
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/vendor/Export2Excel");
            const tHeader = [
              "账目编号",
              "车牌号",
              "送货人",
              "手机号",
              "账单类型",
              "累计结欠(元)",
              "核算状态",
              "备注"
            ]; // 对应表格输出的title
            const filterVal = [
              "id",
              "carNumber",
              "driverName",
              "phone",
              "categoryId",
              "totalAmount",
              "status",
              "remark"
            ]; // 对应表格输出的数据
            var list = JSON.parse(JSON.stringify(this.list));
            list = res.records;
            console.log(list);
            list.forEach(item => {
              item.categoryId =
                item.categoryId == 1
                  ? "餐厨垃圾"
                  : item.categoryId == 2
                  ? "红油"
                  : "地沟油";
              item.status =
                item.status == 2
                  ? "已核算"
                  : item.status == 3
                  ? "已清账"
                  : "未核算";
              item.totalAmount =
                item.inOutType == 1
                  ? item.totalAmount / 100
                  : item.inOutType == 2
                  ? item.totalAmount / 100
                  : "";
            });

            console.log(list);

            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "月结款项对账表"); // 对应下载文件的名字
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
        _self.search_info.offset = currentPage;
      }
      axios_post("/api/fi/payment/list", _self.search_info).then(res => {
        if (res) {
          // console.log(res);
          _self.list = res.records;
          _self.total = res.total;
        }
      });
    },
    handleAdd: function() {
      this.$router.push("/finance/fin/addStatement");
    },
    handleEdit: function(_id) {
      var _self = this;
      _self.$store.commit("finance_statement", { _id: _id });
      _self.$router.push("/finance/fin/statementDetail");
    },
    handleDelete: function(_id) {
      var _self = this;
      _self.$confirm("确认删除该对账表？").then(() => {
        axios_get("/api/fi/payment/del/" + _id).then(res => {
          if (res === null) _self.search();
        });
      });
    }
  }
};
</script>

<style>
</style>
