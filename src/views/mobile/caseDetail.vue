<template>
  <div class="app-container product-detail-main" v-loading="listLoading">
    <!-- 基础信息 -->
    <el-card id="baseid" class="box-card mb20">
      <el-form
        ref="caseForm"
        :rules="rules"
        :model="caseInfo"
        :inline="false"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="caseInfo.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="案例编码">
              <el-input v-model="caseInfo.caseModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="案例主图">
              <el-upload
                action="/api/backend/picture/upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleMainPictureRemove"
                :on-success="handleMainPictureSuccess"
                multiple
                :headers="uploadHeaders"
                :file-list="pictureList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详情信息">
              <vue-ueditor-wrap
                v-model="caseInfo.detailContent"
                :config="editorConfig"
                editor-id="editor-demo-01"
              ></vue-ueditor-wrap>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row>
      <el-col :offset="10">
        <el-button type="primary">取消</el-button>
        <el-button type="success" :loading="submitLoading" @click="handleSubmit"
          >确认</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { fetchCaseInfo, caseSaveApi } from "@/api/case";
import { getToken } from "@/utils/auth"; // get token from localStorage

export default {
  name: "caseDetail",
  components: {
  },
  data() {
    return {
      listLoading: false,
      caseInfo: {
        id: null,
        title: null,
        caseModel: null,
        pictures: [],
        detailContent:""
      },
      rules: {},
      disabled: false,
      dialogVisible: false,
      dialogImageUrl: null,
      submitLoading: false,
      uploadHeaders: {},
      pictureList: [],
      editorConfig: {
        // 访问 UEditor 静态资源的根路径，可参考 https://hc199421.gitee.io/vue-ueditor-wrap/#/faq
        UEDITOR_HOME_URL: "/UEditor/",
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "https://oms.jiayue.store/ueditor",
        initialFrameHeight: 450,
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    // this.addWatcher()
  },
  mounted() {
    this.uploadHeaders = {
      Authorization: "bearer" + getToken(),
    };
    if (this.$route.params.id) {
      this.fetchData(this.$route.params.id);
    }
  },
  methods: {
    async fetchData(caseId) {
      await fetchCaseInfo({ id: caseId }).then((res) => {
        const { data } = res;
        // this.removeAWatcher()
        // 商品
        this.caseInfo.id = data.id;
        this.caseInfo.title = data.title;
        this.caseInfo.caseModel = data.caseModel;
        this.caseInfo.pictures = data.pictures;
        this.pictureList = this.setPictureData(data.pictures);
        this.caseInfo.detailContent = data.detailContent;
        // this.addWatcher()
        // this.selectingAttrValuesHandler()
      });
    },
    //
    handleMainPictureRemove(file, fileList) {
      console.log(file, fileList);
      this.caseInfo.pictures.remove(file.url);
      this.pictureList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleMainPictureSuccess(res, file, fileList) {
      file.url = res.data.url;
      this.caseInfo.pictures.push(res.data.url);
      this.pictureList = fileList;
    },
    setPictureData(fileList) {
      let pictures = [];
      for (var i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        if (typeof file === Object) {
          pictures.push({ name: i, url: file.url });
        } else {
          pictures.push({ name: i, url: file });
        }
      }
      return pictures;
    },
    handleSubmit() {
      this.$refs["caseForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          caseSaveApi({ ...this.caseInfo })
            .then((res) => {
              this.$message({
                type: "success",
                message: "操作成功！",
              });
              this.submitLoading = false;
              // 跳转到商品列表
              this.$router.push({ name: "caseListMobile" });
            })
            .catch((error) => {
              console.log("error:", error);
              this.submitLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.product-detail-main {
  .attr-info {
    display: flex;
  }
  .category-sale-attrs {
    display: flex;
    margin: 20px 0;

    .category-sale-attrs-value {
      margin-left: 30px;
    }

    .category-sale-attrs-key {
      width: 100px;
    }
  }

  .video-row {
    text-align: right;
  }

  #video {
    margin: 20px auto;
  }

  #video1 {
    margin: 20px auto;
  }

  .videolabelBtn {
    position: relative;
  }

  #good_video {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>

