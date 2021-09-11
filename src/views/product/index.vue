<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.styleId"
        filterable
        placeholder="请选择风格"
      >
        <el-option
          v-for="item in allStyles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          @keyup.enter.native="handleFilter"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="listQuery.productTypeId"
        filterable
        placeholder="请选择产品类别"
      >
        <el-option
          v-for="item in allProductTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          @keyup.enter.native="handleFilter"
        >
        </el-option>
      </el-select>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >搜索</el-button
      >
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset"
        >重置</el-button
      >
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-plus"
        @click="handleCreate"
        >上新产品</el-button
      >
    </div>

    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="{ row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.mainPicture"
            fit="fill"
            :preview-src-list="[row.mainPicture]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="标题"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="productModel"
        label="编码"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="styleName"
        label="风格"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="typeName"
        label="产品类别"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{ row }">
          <router-link
            :to="{ name: 'detailProduct', params: { id: row.id } }"
            style="margin: 0 10px"
          >
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>

          <el-button type="danger" size="mini" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { productListApi, productDeleteApi } from "@/api/product";
import { productStyleApi } from "@/api/style";
import { productTypesApi } from "@/api/category";

export default {
  name: "IndexProduct",
  components: {
    Pagination,
  },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 20,
      },
      list: null, // 列表数据
      total: 0,
      listLoading: false,
      allStyles: [],
      allProductTypes: [],
    };
  },
  created() {
    this.getAllStyles();
    this.getAllProductTypes();
    this.getList();
  },

  methods: {
    getAllStyles() {
      this.listLoading = true;

      productStyleApi()
        .then((res) => {
          this.listLoading = false;
          this.allStyles = res.data.styles;
        })
        .catch((error) => {
          // console.log(error)
          this.listLoading = false;
        });
    },
    getAllProductTypes() {
      this.listLoading = true;

      productTypesApi()
        .then((res) => {
          this.listLoading = false;
          this.allProductTypes = res.data.types;
        })
        .catch((error) => {
          // console.log(error)
          this.listLoading = false;
        });
    },
    getList() {
      this.listLoading = true;

      productListApi({ ...this.listQuery })
        .then((res) => {
          const { data } = res;
          this.list = data.products;
          this.total = data.total;
          this.listLoading = false;
        })
        .catch((error) => {
          // console.log(error)
          this.listLoading = false;
        });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        pageSize: 20,
        id: "",
        code: "",
        title: "",
        sort: "id-descend",
        createAt: "",
      };
      this.getList();
    },

    handleCreate() {
      this.$router.push("/product/create");
    },
    handleDelete(id) {
      this.listLoading = true;

      productDeleteApi({ id: id })
        .then((res) => {
          this.listLoading = false;
          this.$message.success("删除成功");
          this.getList();
        })
        .catch((error) => {
          // console.log(error)
          this.listLoading = false;
        });
    },
  },
};
</script>
