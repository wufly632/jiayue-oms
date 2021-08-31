<template>
  <div class="style-dialog">
    <el-dialog title="风格" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form ref="styleForm" :rules="rules" :model="params"  label-position="left" label-width="80px">
        <el-form-item label="风格名称" prop="name">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="风格小图" prop="smallPicture">
          <el-upload
            action="/api/backend/picture/upload"
            list-type="picture-card"
            :on-success="handleSmallImageSuccess"
            :before-upload="beforeImageUpload"
            accept="image/gif, image/jpeg, image/png"
            :headers="uploadHeaders"
            :show-file-list="false">
            <img v-if="params.smallPicture" :src="params.smallPicture" width="100%" />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="风格大图" prop="bigPicture">
         <el-upload
            action="/api/backend/picture/upload"
            list-type="picture-card"
            :on-success="handleBigImageSuccess"
            :before-upload="beforeImageUpload"
            accept="image/gif, image/jpeg, image/png"
            :headers="uploadHeaders"
            :show-file-list="false">
            <img v-if="params.bigPicture" :src="params.bigPicture" width="100%" />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
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
import { productStyleSaveApi } from '@/api/style'
import { getToken } from "@/utils/auth"; // get token from localStorage

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
        name: [{ required: true, message: '风格名称不能为空', trigger: 'blur' }],
        smallPicture: [{ required: true, message: '风格小图不能为空', trigger: 'blur' }],
        bigPicture: [{ required: true, message: '风格大图不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      uploadHeaders: {},
    }
  },
  mounted() {
    this.uploadHeaders = {
      Authorization: "bearer" + getToken(),
    };
  },
  methods: {
    // 上传图片 - 上传中 
   
    handleSubmit() {
      this.$refs['styleForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          productStyleSaveApi({ ...this.params }).then(res => {
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
    },

    handleSmallImageSuccess(res, file) {
      const { data } = res
      if (data && data.url) {
        this.params.smallPicture = data.url
        console.log(data, this.params.smallPicture, '小图上传成功')
      }
    },
    handleBigImageSuccess(res, file) {
      const { data } = res
      if (data && data.url) {
        this.params.bigPicture = data.url
      }
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 png 格式!')
      }
      return isJPG
    }
  }
}
</script>
