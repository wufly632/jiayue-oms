<template>
  <div class="app-container product-detail-main" v-loading="listLoading">
    <!-- 基础信息 -->
    <el-card id="baseid" class="box-card mb20">
      <el-form
        ref="productForm" :rules="rules"
        :model="productInfo"
        :inline="false"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="风格">
              <el-select v-model="productInfo.styleId" placeholder="请选择">
                <el-option
                  v-for="item in styleOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品类别">
              <el-select v-model="productInfo.typeId" placeholder="请选择">
                <el-option
                  v-for="item in typeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="材质是否可换">
              <el-radio-group v-model="productInfo.materialChangeAble">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="productInfo.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品编码">
              <el-input v-model="productInfo.productModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品主图">
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
            <el-form-item label="商品详情图">
              <el-upload
                action="/api/backend/picture/upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleDetailPictureRemove"
                :on-success="handleDetailPictureSuccess"
                multiple
                :headers="uploadHeaders"
                :file-list="detailPictureList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row>
      <el-col :offset="8">
        <el-button type="primary">取消</el-button>
        <el-button type="success" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { fetchProductInfo, productStyleApi, productSaveApi } from "@/api/product";
import { productTypesApi } from "@/api/category";
import { getToken } from '@/utils/auth' // get token from localStorage

import UploadEdit from "@/components/Upload/Edit";

//获取元素在数组的下标
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i;
    }
  }
  return -1;
};

//根据数组的下标，删除该下标的元素
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

export default {
  name: "productDetail",
  components: {
    UploadEdit,
  },
  data() {
    return {
      listLoading: false,
      styleOption: [],
      typeOption: [],
      productInfo: {
        id: null,
        title: null,
        styleId: null,
        productModel: null,
        typeId: null,
        materialChangeAble: false,
        pictures: [],
        detailPictures: [],
      },
      rules:{},
      disabled: false,
      dialogVisible: false,
      dialogImageUrl: null,
      submitLoading:false,
      uploadHeaders:{},
      pictureList:[],
      detailPictureList:[]
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
      "Authorization": "bearer"+getToken()
    }
    if (this.$route.params.id) {
      this.fetchData(this.$route.params.id);
    }
    // 获取所有的风格
    this.fetchAllStyles();
    // 获取所有的类目
    this.fetchAllTypes();
  },
  methods: {
    async fetchData(productId) {
      await fetchProductInfo({ id: productId }).then((res) => {
        const { data } = res;
        // this.removeAWatcher()
        // 商品
        this.productInfo.id = data.id;
        this.productInfo.title = data.title;
        this.productInfo.styleId = data.styleId;
        this.productInfo.productModel = data.productModel;
        this.productInfo.typeId = data.typeId;
        this.productInfo.materialChangeAble = data.materialChangeAble;
        this.productInfo.pictures = data.pictures;
        this.pictureList = this.setPictureData(data.pictures)
        this.productInfo.detailPictures = data.detailPictures;
        this.detailPictureList = this.setPictureData(data.detailPictures)
        // this.addWatcher()
        // this.selectingAttrValuesHandler()
      });
    },
    //
    fetchAllStyles() {
      this.listLoading = true;

      productStyleApi({})
        .then((res) => {
          const { data } = res;
          this.styleOption = data.styles;
          this.listLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.listLoading = false;
        });
    },
    fetchAllTypes() {
      this.listLoading = true;

      productTypesApi({})
        .then((res) => {
          const { data } = res;
          this.typeOption = data.types;
          this.listLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.listLoading = false;
        });
    },
    handleMainPictureRemove(file, fileList) {
      console.log(file, fileList);
      this.productInfo.pictures.remove(file.url);
      this.pictureList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleMainPictureSuccess(res, file, fileList) {
      file.url = res.data.url;
      this.productInfo.pictures.push(res.data.url);
      this.pictureList = fileList
    },
    handleDetailPictureRemove(file, fileList) {
      console.log(file, fileList);
      this.productInfo.detailPictures.remove(file.url);
      this.detailPictureList = fileList
    },
    handleDetailPictureSuccess(res, file, fileList) {
      file.url = res.data.url;
      this.productInfo.detailPictures.push(res.data.url);
      this.detailPictureList = fileList
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
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          productSaveApi({ ...this.productInfo }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.submitLoading = false
            // 跳转到商品列表
            this.$router.push({name:"indexProduct"})
          }).catch(error => {
            console.log("error:",error)
            this.submitLoading = false
          })
        }
      })
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

