<template>
  <div>
    <el-row>
      <vue-ueditor-wrap
        v-model="content"
        :config="editorConfig"
        editor-id="editor-demo-01"
      ></vue-ueditor-wrap>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col :offset="10">
        <el-button type="success" :loading="submitLoading" @click="handleSubmit"
          >确认</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { contactDetailApi,contactSaveApi } from "@/api/mobile";

export default {
  name: "Login",
  data() {
    return {
      submitLoading: false,
      content: "",
      editorConfig: {
        // 访问 UEditor 静态资源的根路径，可参考 https://hc199421.gitee.io/vue-ueditor-wrap/#/faq
        UEDITOR_HOME_URL: "/UEditor/",
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "https://oms.jiayue.store/ueditor",
        initialFrameHeight: 450,
      },
    };
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.submitLoading = true;
      contactDetailApi()
        .then((res) => {
          this.content = res.data.content
          this.submitLoading = false;
        })
        .catch((error) => {
          console.log("error:", error);
          this.submitLoading = false;
        });
    },
    handleSubmit() {
      this.submitLoading = true;
      contactSaveApi({ content:this.content })
        .then((res) => {
          this.$message({
            type: "success",
            message: "操作成功！",
          });
          this.submitLoading = false;
        })
        .catch((error) => {
          console.log("error:", error);
          this.submitLoading = false;
        });
    },
  },
};
</script>


<style lang="scss" scoped>
</style>