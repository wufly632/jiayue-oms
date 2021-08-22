<template>
  <div class="app-container product-detail-main" v-loading="loading">
    <!-- 基础信息 -->
    <el-card id="baseid" class="box-card mb20">
      <template #header>
        <div class="card-header">
          <span>Basic Information</span>
        </div>
      </template>
      <el-form
        ref="base_info"
        :model="productInfo"
        :inline="false"
        label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Category Path">
              <el-cascader
                placeholder="Please select"
                :props="{value:'id',label:'title',leaf:'leafNodeFlag',children:'children',checkStrictly: true}"
                v-model="productInfo.categoryValue"
                :options="categoryOption"
                filterable>
              </el-cascader>
            </el-form-item>

            <el-form-item label="title">
              <el-input v-model="productInfo.title" placeholder="Please enter the product name"/>
            </el-form-item>

            <el-form-item label="Code">
              <el-input v-model="productInfo.code" placeholder="Please enter the product code"/>
            </el-form-item>

            <el-form-item label="description">
              <el-input v-model="productInfo.description" placeholder="Please enter the product description"/>
            </el-form-item>

            <el-form-item label="Supplier link">
              <el-input v-model="productInfo.purchaseLink" placeholder="Please enter the purchase link"/>
            </el-form-item>

            <el-form-item label="Currency">
              <el-select v-model="productInfo.costCurrency" placeholder="">
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Sort">
              <el-input-number v-model="productInfo.sort"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 销售属性信息 -->
    <el-card class="box-card mb20">
      <template #header>
        <div class="clearfix">
          <span style="margin-right: 10px;">Sales attributes</span>
          <el-button type="success" @click="addSelectingAttrValue(1)">Add</el-button>
          <el-button type="primary" @click="handleBatchSettings">Batch settings</el-button>
        </div>
      </template>
      <el-form label-width="120px">
        <div class="attr-info" v-for="(selectingAttrValue, key) in selectingAttrValues" :key="key">
          <el-form-item label="Attributes">
            <el-select
              placeholder="Please select attribute"
              v-model="selectingAttrValue.attrId"
              filterable
              allow-create
              default-first-option
              @keyup.enter.native="handleAddAttribute(key)"
              @change="handleChangeAddAttribute">
              <!-- TODO -->
              <el-option
                v-for="(attrAndValuesItem, arrtIndex) in allAttrAndValues"
                :label="attrAndValuesItem.name"
                :value="attrAndValuesItem.id"
                :key="arrtIndex">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Attribute Values" class="ml20">
            <!-- TODO -->
            <el-select
              placeholder="Please select attribute values"
              v-model="selectingAttrValue.attrValueId"
              multiple clearable filterable
              allow-create
              default-first-option
              @keyup.enter.native="handleAddAttributeValue(key)"
              @change="handleChangeAttrbuteValue(selectingAttrValue.attrId)">
              <el-option
                v-for="(attrValue, valueIndex) in selectedAttrAllValues[selectingAttrValue.attrId]"
                :label="attrValue.name"
                :value="attrValue.id"
                :key="valueIndex">
              </el-option>
            </el-select>
            <el-button type="danger" class="ml20" @click="removeSelectingAttrValue(key)">Remove</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-table border style="width: 100%" class="sku-table" :data="skus">
        <el-table-column prop="id" label="SKU ID"/>
        <template v-for="(item, index) in selectingAttrValues">
          <el-table-column
            :key="index"
            v-if="allAttributesAndValuesMap[item.attrId] && allAttributesAndValuesMap[item.attrId].children"
            :label="allAttributesAndValuesMap[item.attrId].name">
            <template #default="{row}">
              {{
                selectingAttrValues.length > 1 ? allAttributesAndValuesMap[item.attrId].children[row.standardOptionIds[index]] : allAttributesAndValuesMap[item.attrId].children[row.standardOptionIds]
              }}
            </template>
          </el-table-column>
        </template>
        <el-table-column label="Supply price">
          <template #default="{row}">
            <el-input v-model="row.costPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Inventory">
          <template #default="{row}">
            <el-input v-model="row.inventory"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Supplier code">
          <template #default="{row}">
            <el-input v-model="row.code"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Selling price(₦)">
          <template #default="{row}">
            <el-input v-model="row.sellPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Compare price">
          <template #default="{row}">
            <el-input v-model="row.comparePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="userInfo && userInfo.type === 'supply'" label="Settle price">
          <template #default="{row}">
            <el-input v-model="row.settlePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Weight(kg)">
          <template #default="{row}">
            <el-input v-model="row.weight"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <el-form label-width="120px">
        <el-form-item label="SPU" class="mt20">
          <UploadEdit
            v-if="policy"
            :idkey="'product_images'"
            :imgs="productPictureList"
            :policy="policy"
            :pic-type="0"
            @change="changeImgs"/>
        </el-form-item>
        <el-form-item
          v-for="(item,index) in propImages" :key="index"
          :label="allAttributesAndValuesMap[item.standardId] && allAttributesAndValuesMap[item.standardId].children && allAttributesAndValuesMap[item.standardId].children[item.standardOptionsId]">
          <UploadEdit
            v-if="policy"
            :idkey="'sku_images' + item.standardOptionsId"
            :imgs="item.imageUrl"
            :policy="policy"
            :pic-type="0"
            @change="changeImgs"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 视频 -->
    <el-card id="skuimgsid" class="box-card mb20">
      <template #header>
        <div class="clearfix">
          <span>Video</span>
        </div>
      </template>
      <el-form label-width="120px">
        <el-form-item label="Video">
          <div v-show="!video.isHasVideo" class="buyinput">
            <label :disabled="video.isStopvideo" class="videolabelBtn" for="good_video">
              <el-button type="primary" icon="el-icon-upload2">Upload</el-button>
              <input
                id="good_video"
                :disabled="video.isStopvideo"
                type="file"
                accept="video/*"
                name="good_video"
                class="good_video"
                multiple="false"
                @change="goodVideo"
              />
            </label>
          </div>
          <div v-show="video.isHasVideo">
            <span>Duration: {{ video.videoTime }}s</span>
            <span class="ml20">Size: {{ video.VideoSize }}M</span>
            <el-button type="danger" @click="handleDeleteVideo" class="ml20">delete</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-form label-width="120px">
        <el-form-item label="Cover">
          <UploadEdit
            v-if="policy"
            idkey="video_cover"
            :imgs="productInfo.videoCover"
            :policy="policy"
            :pic-type="0"
            @change="changeImgs"
          />
        </el-form-item>
      </el-form>

      <video
        v-if="productInfo.good_video"
        id="video"
        ref="video"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        width="640"
        height="264"
        poster
        data-setup="{}"
        style="padding-left: 120px">
        <source :src="productInfo.good_video" type="video/mp4"/>
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          <a
            href="http://videojs.com/html5-video-support/"
            target="_blank"
          >supports HTML5 video</a>
        </p>
      </video>
    </el-card>

    <!-- 非销售属性 -->
    <el-card class="box-card mb20">
      <template #header>
        <div class="clearfix">
          <span style="margin-right: 10px;">Product attributes</span>
          <el-button type="success" @click="addSelectingAttrValue(2)">Add</el-button>
        </div>
      </template>

      <el-form label-width="120px">
        <div class="attr-info" v-for="(selectingAttrValue, key) in selectingProductAttrValues" :key="key">
          <el-form-item label="Attributes">
            <el-select placeholder="Please select attribute" v-model="selectingAttrValue.attrId">
              <el-option
                v-for="(attrAndValues, attrIndex) in allAttrAndValues"
                :label="attrAndValues.name"
                :value="attrAndValues.id"
                :key="attrIndex"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Attribute Values" class="ml20">
            <el-select
              placeholder="Please select attribute values"
              v-model="selectingAttrValue.attrValueId"
              multiple clearable filterable
              allow-create
              default-first-option>
              <el-option
                v-for="(attrValue, valueIndex)
                in selectedAttrAllValues[selectingAttrValue.attrId]"
                :label="attrValue.name"
                :value="attrValue.id"
                :key="valueIndex"></el-option>
            </el-select>
            <el-button type="danger" class="ml20" @click="removeSelectingAttrValue(key)">Remove</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="box-card mb20">
      <template #header>
        <div class="clearfix detail-box">
          <span class="detail-box-header">
          Product Detail Image
            <!--          <span class>详情图可不上传</span>-->
        </span>
        </div>
      </template>
      <el-row class="imgbox">
        <el-col :span="20" :offset="1">
          <UploadEdit
            v-if="policy"
            :idkey="'details'"
            :imgs="detailImages"
            :policy="policy"
            :pic-type="0"
            @change="changeImgs"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2" :offset="11">
          <el-button type="primary" class="savebtn" @click="saveData">Save</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 批量设置价格 -->
    <el-dialog
      title="Batch setting"
      :visible.sync="setPriceVisible"
      width="800px"
      center
      v-loading="loading"
      class="batch-settings-box">

      <div class="batch-settings-from">
        <el-form label-width="120px" :model="batchSettings">
          <el-form-item
            v-for="(item, index) in batchSelectingAttrValues"
            :key="index"
            :label="allAttributesAndValuesMap[item.attrId] && allAttributesAndValuesMap[item.attrId].name"
            class="is-required">
            <el-checkbox
              :indeterminate="item.isIndeterminate"
              v-model="item.checkAll"
              @change="handleCheckAllChange(index)">Select all</el-checkbox>

            <el-checkbox-group v-model="item.selectValues">
              <el-checkbox
                v-for="it in item.attrValueId"
                :key="it"
                :label="it"
                :value="it"
                @change="handleChecked(index)">
                <template v-if="allAttributesAndValuesMap[item.attrId] && allAttributesAndValuesMap[item.attrId].children">
                  {{ allAttributesAndValuesMap[item.attrId].children[it] }}
                </template>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="Supply price">
            <el-input v-model="batchSettings.costPrice" />
          </el-form-item>
          <el-form-item label="Inventory">
            <el-input v-model="batchSettings.inventory"/>
          </el-form-item>
          <el-form-item label="Supplier code">
            <el-input v-model="batchSettings.code"/>
          </el-form-item>
          <el-form-item label="Selling price(₦)">
            <el-input v-model="batchSettings.sellingPrice"/>
          </el-form-item>
          <el-form-item label="Compare price">
            <el-input v-model="batchSettings.comparePrice"/>
          </el-form-item>
          <el-form-item v-if="userInfo && userInfo.type === 'supply'" label="Settle price">
            <el-input v-model="batchSettings.settlePrice"/>
          </el-form-item>
          <el-form-item label="Weight">
            <el-input v-model="batchSettings.weight"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setPriceVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirmBatch">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 批量设置价格end -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  getAllAttributes,
  getAllCategory,
  ProductSave,
  fetchProductInfo,
  addAttribute,
  addAttributeValue
} from '@/api/product'

import { aliyunPolicy } from '@/api/aliyun' // 获取阿里云权限

import UploadEdit from '@/components/Upload/Edit'

import { descartes } from '@/utils/dikaerji.js'

import axios from 'axios'
import md5 from 'js-md5'

export default {
  name: 'productDetail',
  components: {
    UploadEdit
  },
  data() {
    return {
      loading: false,
      productInfo: {
        id: null,
        title: '',
        categoryValue: [],
        code: null,
        sort: 99,
        costCurrency: 'CNY',
        good_video: '',
        description: '',
        purchaseLink: '',
        videoCover: ''
      },
      // 视频
      video: {
        isHasVideo: false, // 是否已经有视频
        isStopvideo: false, //  是否禁用视频编辑, true禁用/false不禁用
        videoType: ['video/mp4'], // 支持的视频类型
        videoTime: 0, // 视频时长
        VideoSize: 0, // 视频大小
        good_video: '' // 上传的视频地址
      },
      productPictureList: [],
      categoryOption: [],
      allAttrAndValues: [],
      selectingAttrValues: [],
      detailImages: [],
      selectingProductAttrValues: [],
      skus: [{code: null, comparePrice: null, sellingPrice: null, stock: null, weight: null, standardOptionIds: []}],
      propImages: [],
      newSkuData: [],
      policy: '', // aliyun配置
      // selectingAttrValuesWatch: this.selectingAttrValuesHandler,
      allAttributesAndValuesMap: {},
      currencyOptions: [{
        value: 'CNY',
        label: '￥'
      }, {
        value: 'NGN',
        label: '₦'
      }],
      setPriceVisible: false,
      batchSettings: {
        sellingPrice: null,
        weight: null,
        code: null,
        comparePrice: null,
        costPrice: null,
        inventory: null,
      },
      batchSelectingAttrValues: [],
      newAttrId: null, // 新增的ID
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    selectedAttrAllValues() {
      let data = new Object()
      for (let i = 0; i < this.allAttrAndValues.length; i++) {
        data[this.allAttrAndValues[i].id] = this.allAttrAndValues[i].children
      }
      return data
    }
  },
  watch: {
    allAttrAndValues: {
      handler() {
        let obj = {}
        this.allAttrAndValues.map(v => {
          let attrId = v.id
          if (obj[attrId] === undefined) {
            obj[attrId] = {
              name: v.name,
              children: {}
            }
          }
          v.children.map(v2 => {
            obj[attrId].children[v2.id] = v2.name
          })
        })
        // console.log(123)
        this.allAttributesAndValuesMap = obj
      },
      deep: true
    },
  },
  created() {
    // this.addWatcher()
  },
  mounted() {
    if (process.browser) {
      this.getAlipolicy() // 获取阿里云权限
    }
    this.getAllCategories()
    this.getAllAttributes()
    if (this.$route.params.id) {
      this.fetchData(this.$route.params.id)
    } else {
      this.selectingAttrValuesHandler()
    }
  },
  methods: {
    // addWatcher() {
    //   // this.selectingAttrValuesHandler()
    //   // this.selectingAttrValuesWatch = this.$watch('selectingAttrValues', this.selectingAttrValuesHandler, {deep: true, immediate: true})
    // },
    // removeAWatcher() {
    //   if (this.selectingAttrValuesWatch) {
    //     this.selectingAttrValuesWatch()
    //   }
    // },
    selectingAttrValuesHandler() {
      this.processing()
      // 计算propImages
      this.setPropImages()
    },
    async fetchData(productId) {
      await fetchProductInfo({id: productId}).then((res) => {
        const {data} = res
        // this.removeAWatcher()
        // 商品
        this.productInfo.id = data.productInfo.id;
        this.productInfo.title = data.productInfo.title;
        this.productInfo.code = data.productInfo.code;
        this.productInfo.sort = data.productInfo.sort;
        this.productInfo.costCurrency = data.productInfo.costCurrency;
        this.productInfo.categoryValue = data.productInfo.categoryPaths
        this.productInfo.good_video = data.productInfo.video
        this.video.good_video = data.productInfo.video
        if (this.video.good_video) {
          this.video.isHasVideo = true
        }
        this.productInfo.purchaseLink = data.productInfo.purchaseLink
        this.productInfo.description = data.productInfo.description
        // sku
        this.skus = data.skusInfo
        //
        let allSkuImage = {}
        for (let i = 0; i < this.skus.length; i++) {
          for (let j = 0; j < this.skus[i].standardOptionIds.length; j++) {
            allSkuImage[this.skus[i].standardOptionIds[j]] = this.skus[i].icon
          }
        }

        this.productPictureList = data.productPictureList
        this.detailImages = data.detailImages
        this.selectingAttrValues = data.standardProps
        // console.log(this.selectingAttrValues, 222)
        this.selectingProductAttrValues = data.productProps
        this.propImages = []
        if (data.standardProps.length > 0) {
          // console.log(data.standardProps[0])
          let attrId = data.standardProps[0].attrId
          for (let i = 0; i < data.standardProps[0].attrValueId.length; i++) {
            this.propImages.push({
              imageUrl: [allSkuImage[data.standardProps[0].attrValueId[i]]],
              standardId: attrId,
              standardName: "",
              standardOptionsId: data.standardProps[0].attrValueId[i],
            })
          }
        }

        // this.addWatcher()
        // this.selectingAttrValuesHandler()
      })
    },
    getAllCategories() {
      getAllCategory().then((res) => {
        const {data} = res
        this.categoryOption = this.computeCategoryOption(data.data)
      })
    },
    computeCategoryOption(allCategories) {
      let data = [];
      for (let i = 0; i < allCategories.length; i++) {
        let tmp = {}
        tmp['id'] = allCategories[i].id
        tmp['title'] = allCategories[i].title
        tmp['children'] = this.getChildCatetories(allCategories[i].all_children)
        tmp['leafNodeFlag'] = tmp['children'].length === 0
        data.push(tmp)
      }
      return data
    },
    getChildCatetories(allCategories) {
      return this.computeCategoryOption(allCategories)
    },
    async getAllAttributes() {
      const {data} = await getAllAttributes()
      this.allAttrAndValues = data.data
    },
    addSelectingAttrValue(type = 1) {
      if (type === 1) {
        this.selectingAttrValues.push({
          'attrId': null,
          'attrValueId': [],
        })
        this.selectingAttrValuesHandler()
      } else {
        this.selectingProductAttrValues.push({
          'attrId': null,
          'attrValueId': [],
        })
      }
    },
    removeSelectingAttrValue(index) {
      this.selectingAttrValues.splice(index, 1)
      this.selectingAttrValuesHandler()
    },
    // 计算sku
    processing() {
      this.newSkuData = [];
      this.selectingAttrValues.map(v => {
        var newlist = []
        v.attrValueId.map(v2 => {
          newlist.push(v2)
        })
        this.newSkuData.push(newlist)
      })

      this.setSkuList()
    },
    // 转换数据
    setSkuList() {
      this.skus = []
      // 笛卡尔积
      this.newList = descartes(this.newSkuData)
      this.newList.map(v => {
        this.skus.push({
          standardOptionIds: v,
          costPrice: null,
          sellPrice: null,
          comparePrice: null,
          code: null,
          weight: null,
        })
      })
    },
    // setPropImages
    setPropImages() {
      const oldPropImages = this.propImages
      let oldPropImagesMap = {}
      for (let i = 0; i < oldPropImages.length; i++) {
        oldPropImagesMap[oldPropImages[i].standardOptionsId] = oldPropImages[i]
      }
      // console.log(this.selectingAttrValues);
      let newPropImages = []
      if (this.selectingAttrValues.length > 0) {
        for (let i = 0; i < this.selectingAttrValues[0].attrValueId.length; i++) {
          if (oldPropImagesMap[this.selectingAttrValues[0].attrValueId[i]] === undefined) {
            newPropImages.push({
              imageUrl: [],
              standardOptionsId: this.selectingAttrValues[0].attrValueId[i],
              standardOptionsName: "",
              standardId: this.selectingAttrValues[0].attrId,
            })
          } else {
            newPropImages.push(oldPropImagesMap[this.selectingAttrValues[0].attrValueId[i]])
          }
        }
      }
      this.propImages = newPropImages
    },
    // 更换图片
    changeImgs(type, data) {
      // console.log("type", type);
      if (type === "details") {
        this.detailImages = data;
      } else if (type === "product_images") {
        this.productPictureList = data;
      } else if (type === "video_cover") {
        this.productInfo.videoCover = data;
      } else {
        let standOptionId = type.replace("sku_images", "");
        // console.log(standOptionId, data)
        for (let i = 0; i < this.propImages.length; i++) {
          if (this.propImages[i].standardOptionsId == standOptionId) {
            this.propImages[i].imageUrl = data
          }
        }
      }
    },
    getAlipolicy() {
      const that = this;
      return new Promise((resolve, reject) => {
        try {
          let AliPolicy = localStorage.getItem('AliPolicy') || ''
          const AliPolicyTime = localStorage.getItem('AliPolicyTime') || ''
          if (AliPolicy && AliPolicyTime) {
            AliPolicy = JSON.parse(AliPolicy)
            const nowDate = new Date() * 1
            if (AliPolicyTime * 1000 > nowDate * 1 + 1000 * 30) {
              // 有效
              const res = AliPolicy
              that.policy = res.data
              // console.log("缓存里的阿里云权限", that.policy);
              resolve()
              return
            }
          }
        } catch (error) {
          // console.log(error);
          reject()
        }
        aliyunPolicy({})
          .then(res => {
            if (res.code === 20000) {
              that.policy = res.data
              that.key = res.data.key
              console.log("接口的阿里云权限", that.policy)
              try {
                localStorage.removeItem("AliPolicy")
                localStorage.removeItem("AliPolicyTime")
                localStorage.setItem("AliPolicy", JSON.stringify(res))
                localStorage.setItem(
                  "AliPolicyTime",
                  new Date(that.policy.expire) * 1
                );
                resolve();
              } catch (error) {
                // console.log(error)
                reject()
              }
            } else {
              that.$message.error(res.msg)
              reject()
            }
          })
          .catch(err => {
            // console.log(err)
            reject()
          })
      })
    },
    async saveData() {
      // 验证类目
      // console.log(this.productInfo)
      if (this.productInfo.categoryValue.length === 0) {
        this.$message.error('Please select the category first')
        return
      }
      this.loading = true;
      let postData = {
        id: this.productInfo.id,
        title: this.productInfo.title,
        categoryPaths: this.productInfo.categoryValue,
        code: this.productInfo.code,
        description: this.productInfo.description,
        purchaseLink: this.productInfo.purchaseLink,
        sort: this.productInfo.sort,
        costCurrency: this.productInfo.costCurrency,
        video: this.productInfo.good_video,
        videoCover: this.productInfo.videoCover,
        skus: this.skus,
        productPictureList: this.productPictureList,
        productProps: this.selectingProductAttrValues,
        propImages: this.propImages,
        standardProps: this.selectingAttrValues,
        detailImages: this.detailImages,
      };

      try {
        const {data} = await ProductSave(postData)
        this.$message.success('Release success')
        this.$router.push('/product/index')
      } catch (error) {
        // console.log(error)
      }
      this.loading = false
    },
    goodVideo(e) {
      this.loading1 = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var files = e.target.files || e.dataTransfer.files
      if (files) {
        const file = files[0]
        const size = file.size
        this.video.VideoSize = (size / 1024 / 1024).toFixed(2)
        if (size > 5 * 1024 * 1024) {
          this.$message.error('File upload failed, maximum file cannot exceed 5M!')
          this.loading1.close()
          return
        }
        const videoType = this.video.videoType
        const type = file.type
        if (videoType.indexOf(type) === -1) {
          this.$message.error('Does not support' + type + 'file type!')
          this.loading1.close()
          return
        }
        this.UploadVideo(file)
      } else {
        this.$message.error('The file was not retrieved!')
        this.loading1.close()
      }
    },
    async UploadVideo(file) {
      try {
        const that = this
        await this.getAlipolicy()
        const formData = new FormData()
        const policy = this.policy

        let video = document.createElement('video')
        video.preload = 'metadata'
        video.src = URL.createObjectURL(file)
        video.onloadedmetadata = async () => {
          window.URL.revokeObjectURL(video.src)
          const videoName = await this.ImgName(file.name,video.videoWidth, video.videoHeight)
          // console.log('video:',videoName)
          Object.keys(policy).forEach(function (item) {
            if (item === 'key') {
              formData.append(item, videoName)
            } else {
              formData.append(item, policy[item])
            }
          })
          formData.append('file', file)
          const actionUrl = this.policy.url
          axios.request({
            url: actionUrl,
            data: formData,
            method: 'post',
            processData: false
          })
            .then(function (res) {
              // console.log(res, 972)
              if (res.status === 200) {
                that.$message.success('Successfully upload the video!')
                that.video.good_video = actionUrl + '/' + videoName
                that.video.isHasVideo = true
                that.productInfo.good_video = actionUrl + '/' + videoName
                that.showVideo(0, file)
                that.loading1.close()
              } else {
                that.loading1.close()
                that.video.isHasVideo = false
                document.getElementById('good_video').value = ''
                that.video.good_video = ''
                that.productInfo.good_video = ''
                that.$message.error(res.msg)
              }
            })
            .catch(function (err) {
              // console.log(err)
              that.loading1.close()
              that.$message.error(err, 980)
              that.video.isHasVideo = false
              document.getElementById('good_video').value = ''
              that.video.good_video = ''
              that.productInfo.good_video = ''
            })
        }
      } catch (error) {
        this.loading1.close()
        // console.log(error)
        this.$message.error("Error uploading video!")
      }
    },
    ImgName(name, width, height) {
      const nameType = name.slice(name.lastIndexOf('.'))
      const Mr = name + Date.now() + Math.random()
      let strArr = Array.from(md5(Mr))
      strArr = strArr.map(function (item, index) {
        if ([7, 11, 15, 19].indexOf(index) !== -1) {
          return item + '-'
        } else {
          return item
        }
      });
      return this.policy.key + '/logo/' + strArr.join('') + '_size' + width + 'x' + height +  nameType
    },
    async showVideo(link, file) {
      // const that = this;
      // const myPlayer = this.$video('video')
      // const myPlayer = this.$refs.video

      // myPlayer.ready(function () {
      //   // this.play()
      //   that.video.isHasVideo = true
      // })
      // let duration = 0
      // let videoURL = ''
      // if (link) {
      //   // 编辑有链接
      //   videoURL = link
      // } else {
      //   const URL = window.URL || window.webkitURL
      //   videoURL = await URL.createObjectURL(file)
      // }
      // // console.log(videoURL)
      // await myPlayer.src({
      //   src: videoURL,
      //   type: 'video/mp4',
      // }); // 重置video的src
      // await myPlayer.load(videoURL)
      // await myPlayer.width()
      // that.video.isHasVideo = true
      // const timeInterval = setInterval(function () {
      //   if (myPlayer.duration() !== 0) {
      //     duration = myPlayer.duration()
      //     that.video.videoTime = duration.toFixed(2)

      //     if (that.loading) {
      //       that.loading.close()
      //     }
      //     clearInterval(timeInterval)
      //   }
      // }, 1000)
    },
    handleDeleteVideo() {
      const that = this
      this.$confirm('Do you want to delete this video?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((res) => {
        that.video.isHasVideo = false
        document.getElementById('good_video').value = '' // 虽然file的value值不能设为有内容的字符，但是可以设置为空字符
        that.video.good_video = ''
        that.productInfo.good_video = ''
      }).catch(err => {
        return false
      })
    },
    // 上传原视频
    // uploadOriginVideo() {
    //   // this.origin.good_video = null
    //   this.video.isHasVideo = true
    //   this.video.good_video = this.productInfo.good_video
    // },
    // 属性
    handleChangeAddAttribute(id) {
      this.newAttrId = id
    },
    // 新增
    async handleAddAttribute(seletingkey) {
      this.loading = true
      try {
        const { data } = await addAttribute({name: this.selectingAttrValues[seletingkey].attrId})
        this.allAttrAndValues.push(data.data)
        // TODO
        setTimeout(() => {
          this.newAttrId = data.data.id // 重新赋值，会把handleChangeAddAttribute里的this.newAttrId覆盖掉
          this.selectingAttrValues[seletingkey].attrId = data.data.id
        }, 50)

      } catch (e) {
        // console.log(e)
      }
      this.loading = false
    },
    // 值
    handleChangeAttrbuteValue(id) {
      this.selectingAttrValuesHandler()
      if (this.$route.params.id) {
        // 编辑的情况下，需要重新找newAttrId
        this.newAttrId = id
      }
    },
    // 回车新增
    async handleAddAttributeValue(seletingkey) {
      let attribute_id = this.selectingAttrValues[seletingkey].attrId
      let attribute_value_ids = this.selectingAttrValues[seletingkey].attrValueId
      let attributeValueName = attribute_value_ids[attribute_value_ids.length - 1]
      try {
        const { data } = await addAttributeValue({attribute_id: attribute_id, name: attributeValueName})

        this.allAttrAndValues.map((v, index) => {

          if (v.id === +this.newAttrId) {
            v.children.push({
              id: data.id,
              name: data.name
            })
            this.$set(this.allAttrAndValues, index, v)
            this.selectingAttrValues[seletingkey].attrValueId[this.selectingAttrValues[seletingkey].attrValueId.length - 1] = data.id // 这里没触发更新
            this.selectingAttrValuesHandler()
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 点击批量设置价格弹框里的保存
    handleConfirmBatch() {
      let skuSelected = false
      this.batchSelectingAttrValues.map(v => {
        if (v.selectValues && v.selectValues.length) {
          skuSelected = true
        }
      })

      if (!skuSelected) return this.$message.error('Please select attribute')

      const len = this.skus.length
      for (let index = 0; index < len; index++) {
        const sku = this.skus[index]
        let eq = true
        for (let _index = 0; _index < this.batchSelectingAttrValues.length; _index++) {
          const sale_attr_value = this.batchSelectingAttrValues[_index]
          // console.log("sale_attr_value",sale_attr_value)
          if (Array.isArray(sku.standardOptionIds)) {
            let intersection = sale_attr_value.selectValues.filter(function (val) { return sku.standardOptionIds.indexOf(val) > -1 })
            if (!intersection.length) {
              eq = false
            }
          } else {
            if (sale_attr_value.selectValues.indexOf(sku.standardOptionIds) === -1) {
              eq = false
            }
          }
        }
        if (eq) {
          sku.sellPrice = this.batchSettings.sellingPrice || sku.sellPrice
          sku.weight = this.batchSettings.weight || sku.weight
          sku.code = this.batchSettings.code || sku.code
          sku.comparePrice = this.batchSettings.comparePrice || sku.comparePrice
          sku.costPrice = this.batchSettings.costPrice || sku.costPrice
          sku.inventory = this.batchSettings.inventory || sku.inventory
          sku.settlePrice = this.batchSettings.settlePrice || sku.settlePrice
          this.skus[index] = sku
        }
      }
      this.setPriceVisible = false

    },
    handleCheckAllChange(index) {
      let _data = this.batchSelectingAttrValues[index]
      const checkAll = _data.checkAll
      let selectValues = []

      if (checkAll) {
        selectValues = _data.attrValueId
        _data.isIndeterminate = false
      }
      _data.selectValues = selectValues
      this.$set(this.batchSelectingAttrValues, index, _data)
    },
    handleChecked(index) {
      let _data = this.batchSelectingAttrValues[index]
      const checkAll = _data.attrValueId.length === _data.selectValues.length
      let isIndeterminate = _data.selectValues.length > 0

      if (checkAll) {
        isIndeterminate = false
      }
      _data.checkAll = checkAll
      _data.isIndeterminate = isIndeterminate
      this.$set(this.batchSelectingAttrValues, index, _data)
    },
    computeBatchSelectingAttrValues() {
      let data = []
      let len = this.selectingAttrValues.length
      for (let i = 0; i < len; i++) {
        let tmp = this.selectingAttrValues[i]
        tmp.checkAll = false
        tmp.isIndeterminate = false
        tmp.selectValues = []
        data.push(tmp)
      }
      this.batchSelectingAttrValues = data

      // 清空选项
      this.batchSettings = {
        sellingPrice: null,
        weight: null,
        code: null,
        comparePrice: null,
        costPrice: null,
        inventory: null,
        settlePrice: null,
      }
    },
    handleBatchSettings() {
      this.setPriceVisible = true
      this.computeBatchSelectingAttrValues()
    }
  }
}
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

