<template>
  <div class="category-dialog">
    <el-dialog title="类目" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form ref="categoryForm" :rules="rules" :model="params" label-position="left" label-width="80px">
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="类目名称" prop="enName">
          <el-input v-model="params.enName"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { productTypesSaveApi } from '@/api/category'

export default {
  components: {},
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '类目名称不能为空', trigger: 'blur' }],
        enName: [{ required: true, message: '类目名称英文名不能为空', trigger: 'blur' }]
      },
      submitLoading: false
    }
  },
  methods: {
    handleSubmit() {
      this.$refs['categoryForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          productTypesSaveApi({ ...this.params }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.$emit('update:dialogFormVisible', false) // 关闭弹层
            this.$emit('callback') // 刷新列表
            this.submitLoading = false
          }).catch(error => {
            this.listLoading = false
          })
        }
      })
    },
    // 取消
    handleClose() {
      this.$emit('update:dialogFormVisible', false)
    }
  }
}
</script>
