<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">新增类目</el-button>
    </div>
 
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="58" align="center"></el-table-column>
      <el-table-column prop="name" label="类目名称" align="center"></el-table-column>
      <el-table-column prop="enName" label="类目英文名称" align="center"></el-table-column>
      <el-table-column prop="status" label="类目状态" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status === 1" style="color: green">已上架</span>
          <span v-else style="color: red">已下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleEdit(row)" size="mini">编辑</el-button>
          <el-button :type="row.status === 1 ? 'danger' : 'success'" @click="handleOnOff(row)"  size="mini">
            {{ row.status === 1 ? '下架' : '上架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <CategoryDialog 
      :dialogFormVisible.sync="createDialogFormVisible" 
      :params="createParams" 
      @callback="getList"
      />
  </div>
</template>

<script>
import { productTypesApi, productTypesOnofflineApi } from '@/api/category'
import CategoryDialog from './components/categoryDialog'

export default {
  name: 'IndexCategory',
  components: {
    CategoryDialog
  },
  data() {
    return {
      list: [], // 列表数据
      listLoading: false,

      createDialogFormVisible: false,
      createParams: {}
    }
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true

      productTypesApi({}).then(res => {
        const { data } = res
        this.list = data.types
        this.listLoading = false
      }).catch(error => {
        // console.log(error)
        this.listLoading = false
      })
    },

    handleEdit(row) {
      this.createDialogFormVisible = true
      this.createParams = {
        name: row.name,
        enName: row.enName,
        id: row.id
      }
    },
    handleOnOff(row) {
      const isOnline = row.status === 1
      const word = isOnline ? '下架' : '上架'

      this.$confirm(`确认${word}这个分类吗?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          productTypesOnofflineApi({ 
            id: row.id,
            status: 3-row.status
          }).then(res => {
            this.$message({
              type: 'success',
              message: `${word}操作成功！`
            })

            // @TODO
            // const { data } = res
            // this.list = data.styles
            row.status = 3-row.status
            // this.getList()
          }).catch(error => {})
        }).catch(() => {})
    },

    handleCreate() {
      this.createDialogFormVisible = true
      this.createParams = {}
    },

  }
}
</script>
