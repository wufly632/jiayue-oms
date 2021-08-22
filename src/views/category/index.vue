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
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleEdit(row)" size="mini">编辑</el-button>
          <el-button type="danger" @click="handleDel(row)"  size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <CreateDialog 
      :dialogFormVisible.sync="createDialogFormVisible" 
      :params="createParams" 
      @getList="getList"
      />
  </div>
</template>

<script>
import { productStyleApi } from '@/api/style'
import CreateDialog from './components/createDialog'

export default {
  name: 'IndexCategory',
  components: {
    CreateDialog
  },
  data() {
    return {
      list: null, // 列表数据
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

      productStyleApi({ ...this.listQuery }).then(res => {
        const { data } = res
        this.list = data.styles
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
        id: row.id
      }
    },
    handleDel(row) {
      // todo sth
    },

    handleCreate() {
      this.createDialogFormVisible = true
      this.createParams = {}
    },

  }
}
</script>
