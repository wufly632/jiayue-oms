<template>
  <div>
    <el-card id="baseid" class="box-card mb20">
      <el-form
        ref="caseForm"
        :rules="rules"
        :model="addressInfo"
        :inline="false"
        label-width="120px"
      >
        <el-row>
          <el-col>地址一：</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input v-model="addressInfo.datas[0].longitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input v-model="addressInfo.datas[0].latitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="addressInfo.datas[0].title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容">
              <el-input v-model="addressInfo.datas[0].content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>地址二：</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input v-model="addressInfo.datas[1].longitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input v-model="addressInfo.datas[1].latitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="addressInfo.datas[1].title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容">
              <el-input v-model="addressInfo.datas[1].content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="详情信息">
              <vue-ueditor-wrap
                v-model="addressInfo.detailContent"
                :config="editorConfig"
                editor-id="editor-demo-01"
              ></vue-ueditor-wrap>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
    </el-card>
    <el-row style="margin-top: 20px">
      <el-col :offset="10">
        <el-button type="success" :loading="submitLoading" @click="handleSubmit"
          >确认</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addressDetailApi, addressSaveApi } from "@/api/mobile";

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
        serverUrl: "//ueditor.szcloudplus.com/cos",
        initialFrameHeight: 450,
      },
      rules: {},
      addressInfo: {
        datas:[

        {
          longitude: "",
          latitude: "",
          title: "",
          content: "",
        },
        { longitude: "", latitude: "", title: "", content: "" },
      ]}
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.submitLoading = true;
      addressDetailApi()
        .then((res) => {
          this.addressInfo.datas = res.data.address;
          this.submitLoading = false;
        })
        .catch((error) => {
          console.log("error:", error);
          this.submitLoading = false;
        });
    },
    handleSubmit() {
      this.submitLoading = true;
      addressSaveApi({ address: this.addressInfo.datas })
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