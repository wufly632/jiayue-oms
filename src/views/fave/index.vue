<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input 
        v-model="listQuery.productId" 
        class="filter-item mr10"
        placeholder="商品ID"
        style="width: 200px;"
        clearable
        @keyup.enter.native="handleFilter"
      />

      <el-input 
        v-model="listQuery.userMobile" 
        class="filter-item mr10"
        placeholder="手机号"
        style="width: 200px;"
        clearable
        @keyup.enter.native="handleFilter"
      />
      
      <el-date-picker
        v-model="listQuery.createdRange"
        class="filter-item mr10"
        type="datetimerange"
        range-separator="-"
        start-placeholder="收藏开始时间"
        end-placeholder="收藏结束时间">
      </el-date-picker>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.productPicture"
            fit="fill"
            :preview-src-list="[row.productPicture]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品标题" align="center"></el-table-column>
      <el-table-column prop="productId" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
      <el-table-column prop="userMobile" label="用户手机号" align="center"></el-table-column>
      <el-table-column prop="createdAt" label="收藏时间" align="center"></el-table-column>
    </el-table>

    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { faveListApi } from '@/api/fave'

export default {
  name: 'IndexFave',
  components: {
    Pagination,
  },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 20,
        productId: null,
        userMobile: null,
        createdRange: []
      },
      list: null, // 列表数据
      total: 0,
      listLoading: false,
    }
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true

      faveListApi({ ...this.listQuery }).then(res => {
        const { data } = res
        this.list = data.faves
        this.total = data.total
        this.listLoading = false
      }).catch(error => {
        // console.log(error)
        this.listLoading = false
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        pageSize: 20,
        productId: null,
        userMobile: null,
        createdRange: []
      }
      this.getList()
    }
  }
}
</script>
