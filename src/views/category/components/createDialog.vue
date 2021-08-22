<template>
  <div class="style-dialog">
    <el-dialog title="类目" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form ref="styleForm" :rules="rules" :model="params" label-position="left" label-width="80px">
        <el-form-item label="类目名称" class="is-required">
          <el-input v-model="params.name"></el-input>
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
import request from '@/api/request'
import UploadEdit from '@/components/Upload/Edit'

export default {
  components: {
    UploadEdit
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: {
        name: '',
      }
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      binItemsText: '', // 货位项文本（扫码枪所得）
      rules: {
        binItemsText: [{ required: true, message: '货位项不能为空', trigger: 'blur' }]
      },
      submitLoading: false
    }
  },
  methods: {
    handleSubmit() {
      this.$refs['styleForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true

          request({
            url: '/api/style',
            method: 'post',
            data: { ...this.params }
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功！'
              })
              this.$emit('update:dialogFormVisible', false) // 关闭弹层
              this.$emit('callback') // 刷新列表
            }
            this.submitLoading = false
          }).catch(() => {
            this.submitLoading = false
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


<style lang="scss" scoped>
.style-ul {
  width: 100%;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
  li {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    // height: 30px;
    line-height: 30px;
    .label {
      width: 80px;
      text-align: right;
      // border-right: 1px solid #e0e0e0;
    }
  }
  li:last-child {
    border-bottom: none;
  }
  &.no-border {
    border: none;
    li {
      border: none;
    }
  }
}
</style>
