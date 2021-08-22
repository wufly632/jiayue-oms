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
      <el-table-column label="风格小图" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; "
            :src="row.smallPicture"
            fit="fill"
            :preview-src-list="[row.smallPicture]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="风格大图" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 200px;"
            :src="row.bigPicture"
            fit="fill"
            :preview-src-list="[row.bigPicture]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="风格状态" align="center">
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

    <StyleDialog 
      :dialogFormVisible.sync="createDialogFormVisible" 
      :params="createParams" 
      @callback="getList"
      />
  </div>
</template>

<script>
import { productStyleApi, productStyleOnofflineApi } from '@/api/style'
import StyleDialog from './components/styleDialog'

export default {
  name: 'IndexStyle',
  components: {
    StyleDialog
  },
  data() {
    return {
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

      productStyleApi({}).then(res => {
        const { data } = res
        this.list = data.styles
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },

    handleEdit(row) {
      this.createDialogFormVisible = true
      this.createParams = {
        ...row
      }
    },

    handleOnOff(row) {
      const isOnline = row.status === 1
      const word = isOnline ? '下架' : '上架'

      this.$confirm(`确认${word}这个风格吗?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          productStyleOnofflineApi({ 
            id: row.id,
            status: row.staus
          }).then(res => {
            this.$message({
              type: 'success',
              message: `${word}操作成功！`
            })

            // @TODO
            const { data } = res
            this.list = data.styles
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
