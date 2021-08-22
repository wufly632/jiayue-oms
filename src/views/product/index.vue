<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">上新产品</el-button>
    </div>
 
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.smallPicture"
            fit="fill"
            :preview-src-list="[row.bigPicture]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" align="center"></el-table-column>
      <el-table-column label="Operation" align="center" fixed="right">
        <template slot-scope="{row}">
          <router-link :to="{name:'detailProduct',params:{id: row.id}}"  style="margin: 0 10px;">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
         
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { productStyleApi } from '@/api/product'

export default {
  name: 'IndexProduct',
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
    }
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true

      productStyleApi({ ...this.listQuery }).then(res => {
        const { data } = res
        this.list = data.styles
        this.total = data.meta.pagination.total
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
        id: '',
        code: '',
        title: '',
        sort: 'id-descend',
        createAt: ''
      }
      this.getList()
    },

    handleCreate() {
      this.$router.push('/product/create')
    },

  }
}
</script>
