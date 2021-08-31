<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">新增类目</el-button>
    </div>
 
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      row-key="id"
      style="width: 100%;"
      @cell-mouse-enter="handleRow"
    >
      <el-table-column type="index" label="序号" width="58" align="center"></el-table-column>
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
import { productTypesApi, productTypesOnofflineApi, productTypesSaveApi } from '@/api/category'
import CategoryDialog from './components/categoryDialog'
import Sortable from 'sortablejs'

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
      createParams: {},
      hoverRowParams: -1
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.rowDrop()
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
    handleRow(e) {
      this.hoverRowParams = e
    },
    //行拖拽
    rowDrop() {
      const el = document.querySelector('.el-table__body-wrapper tbody')
      
      Sortable.create(el, {
        disabled: false, // 是否开启拖拽
        ghostClass: 'sortable-ghost', //拖拽样式
        animation: 150, // 拖拽延时，效果更好看
        onEnd: (e) => { // 这里主要进行数据的处理，拖拽实际并不会改变绑定数据的顺序，这里需要自己做数据的顺序更改
          let arr = this.list // 获取表数据
          arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]) // 数据处理
          
          this.$nextTick(function () {
            this.list = arr

            productTypesSaveApi({
              ...this.hoverRowParams,
              sort: e.newIndex
            }).then(res => {
              // this.getList()
            }).catch(error => {
              // this.listLoading = false
            })
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.sortable-ghost {
  opacity: 0.4;
  background-color: #F4E2C9;
}
</style>
