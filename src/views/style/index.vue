<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">新增风格</el-button>
    </div>
 
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="58" align="center"></el-table-column>
      <el-table-column prop="name" label="风格名称" align="center"></el-table-column>
      <el-table-column label="小图" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; "
            :src="row.smallPicture"
            fit="fill"
            :preview-src-list="[row.smallPicture]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 200px;"
            :src="row.bigPicture"
            fit="fill"
            :preview-src-list="[row.bigPicture]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleEdit(row)" size="mini">编辑</el-button>
          <el-button type="danger" @click="handleDel(row)" size="mini">删除</el-button>
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
  name: 'IndexStyle',
  components: {
    CreateDialog
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
        ...row
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
