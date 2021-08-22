<template>
  <div class="upload-page">
    <!-- {{ fileList }} -->
    <div :id="'drag-wrap'+idkey" class="upload-img-ul-box">
      <div v-for="(item,index) of fileList" :key="index" class="upload-img-ul">
        <img :src="item.url && item.url.ossimg()" alt class="upload-img"/>
        <div class="upload-img-bg">
          <span>
            <i class="el-icon-zoom-in" @click="handlePreview(item)"/>
          </span>
          <span>
            <i class="el-icon-delete" @click="beforeRemove(item,fileList)"/>
          </span>
        </div>
      </div>
    </div>
    <el-upload
      v-if="!(idkey.startsWith('sku_images') && fileList.length >= 1)"
      class="add_activity"
      :action="policy.url"
      list-type="picture-card"
      :on-preview="handlePreview"
      :file-list="fileList"
      :data="ossParams"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :show-file-list="false"
      multiple
    >
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog width="40%" :visible.sync="dialogVisible" append-to-body class="dialog-uploadimg">
      <div class="dialogimg-box">
        <img :src="dialogImageUrl" alt/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import md5 from 'js-md5';

export default {
  props: {
    policy: {
      type: [Object || String],
      default: {},
      required: true
    },
    idkey: {
      // 组件的key
      type: String,
      default: "0",
      required: true
    },
    imgs: {
      type: Array | String,
      default: () => [],
      required: true
    },
    picType: {
      // 图片类型,1短,2长,0未定
      type: Number,
      default: () => 0,
      required: true
    }
  },
  data() {
    return {
      imageUrl: "",
      ossParams: {},
      dialogImageUrl: "", // 预览的url
      dialogVisible: false, // 预览是否展示,
      filename: "",
      ImgType: "image/png,image/jpg,image/gif,image/jpeg",
      fileList: [],
      newImageList: [] // 新增的图片
    };
  },
  computed: {},
  watch: {
    imgs() {
      this.init();
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.adddrag()
  },
  methods: {
    init() {
      let _fileList = this.imgs || [];
      // console.log("_fileList", _fileList)
      this.fileList = Array.from(_fileList).map(item => {
        if (item) {
          return {
            url: item
          }
        }
      })

      // this.setdragId()
    },
    setdragId() {
      setTimeout(() => {
        const el = "drag-wrap" + this.idkey;
        const ele = document.getElementById(el);
        if (ele) {
          for (let i = 0; i < ele.children.length; i++) {
            ele.children[i].setAttribute("id", el + "-li" + i);
            ele.children[i].setAttribute("draggable", true);
          }
        }
      }, 300)
    },
    async adddrag() {
      await this.setdragId()
      const inParent = obj => {
        // 如果拖拽的是li或者其子元素则返回li元素本身,没有返回false
        while (obj.tagName.toUpperCase() !== "BODY") {
          if (obj.classList.contains("upload-img-ul")) {
            return obj;
          }
          obj = obj.parentNode;
        }
        return false;
      };
      const curIndex = e => {
        // 判断li在ul中的下标,没有则返回-1
        const el = "drag-wrap" + this.idkey;
        const paEl = document.getElementById(el).children;
        let index = -1;
        const target = inParent(e.target);
        if (!target) {
          return index;
        }
        for (let i = 0; i < paEl.length; i++) {
          if (paEl[i] === target) {
            index = i;
          }
        }
        return index;
      };
      const changeOrder = (startIndex, endIndex) => {
        // 排序
        let _fileList = JSON.parse(JSON.stringify(this.fileList));
        // console.log(startIndex, endIndex, _fileList)
        const start = _fileList[startIndex];
        const end = _fileList[endIndex];
        if (startIndex * 1 !== endIndex * 1) {
          const arr = [];
          _fileList.forEach((item, index) => {
            if (index === startIndex * 1) {
              arr.push(end);
            } else if (index === endIndex * 1) {
              arr.push(start);
            } else {
              arr.push(item);
            }
          });
          _fileList = arr.map(item => {
            return {
              url: item.url
            };
          });
          this.fileList = _fileList;
          // console.log(arr, 125)
          this.emitData(this.fileList);
        }
      };
      const startDrag = e => {
        const sid = curIndex(e);
        e.dataTransfer.setData("Text", sid);
      };
      const exchangeElement = e => {
        e.preventDefault();
        const eid = curIndex(e);
        const sid = e.dataTransfer.getData("Text"); // 拖拽开始时储存的开始item的id
        if (eid === -1 || sid === -1) {
          return;
        }
        changeOrder(sid, eid);
      };
      const dragCon = document.getElementById("drag-wrap" + this.idkey);
      dragCon.addEventListener("dragstart", startDrag, false);
      /**
       *  这里一定要阻止dragover的默认行为，不然触发不了drop
       */
      dragCon.addEventListener(
        "dragover",
        e => {
          e.preventDefault();
        },
        false
      );
      dragCon.addEventListener("drop", exchangeElement, false);
    },
    emitData(data) {
      const _img = [];
      data.forEach(item => {
        _img.push(item.url);
      });
      this.$emit("change", this.idkey, _img);
      this.setdragId();
    },
    async beforeRemove(file, fileList) {
      // console.log(file)
      // if (file && file.status === "success") {
      if (file) {
        // 上传监测通过成功时候的方法
        const name = file.name || file.url.split("/").pop();
        const isdelete =
          (await this.$confirm(`确定移除 ${name}？`).catch(() => {
          })) || false;
        if (isdelete) {
          this.handleRemove(file, fileList);
        }
      }
    },
    handleRemove(file, fileList) {
      // console.log(fileList)
      // if (file && file.status === "success") {
      if (file) {
        // 上传监测通过成功时候的方法
        let delindex = -1;
        this.fileList.forEach((item, index) => {
          if (file.uid === item.uid) {
            delindex = index;
          }
        });
        this.fileList.splice(delindex, 1);
        this.emitData(this.fileList);
      }
      this.$emit("imgtype", this.idkey);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url && file.url.ossimg();
      this.dialogVisible = true;
    },
    uploadSuccess(res, file, fileList) {
      this.fileList = this.fileList.concat(this.newImageList)
      // console.log(this.newImageList, this.fileList, 888)
      this.emitData(this.fileList)
      this.newImageList = []
    },
    async beforeUpload(file) {
      // const _ossParams = {...this.policy};
      // console.log("file", file)
      this.ossParams = { ...this.policy }
      // console.log(file);
      const that = this;
      const _ImgType = file.type;
      // const ImgName = file.name;
      return new Promise((resolve, reject) => {
        // 限制上传的文件为图片
        if (this.ImgType.indexOf(_ImgType) === -1 || !_ImgType) {
          this.$message.error(file.name + ',Image type error!');
          // reject();
          return false;
        }
        const ImgSize = file.size;
        if (ImgSize > 5 * 1024 * 100) {
          this.$message.error(file.name + 'upload failed, the maximum file cannot exceed 500k');
          // reject();
          return false;
        }
        // 详情图不判断是方图还是长图
        const reader = new FileReader();
        reader.onload = async function () {
          const img = new Image();
          img.src = this.result;
          img.onload = async function () {
            const imageHeight = img.height;
            const imageWidth = img.width;
            // console.log(imageHeight, imageWidth)
            that.ossParams.key = await that.ImgName(file, imageWidth, imageHeight);
            resolve();
          };
        };
        reader.readAsDataURL(file);
      });
    },
    // 图片上传命名
    ImgName(file, width, height) {
      const nameType = file.name.slice(file.name.lastIndexOf("."));
      const Mr = file.name + Date.now() + Math.random();
      let strArr = Array.from(md5(Mr));
      strArr = strArr.map(function (item, index) {
        if ([7, 11, 15, 19].indexOf(index) !== -1) {
          return item + "-";
        } else {
          return item;
        }
      });
      let fileName = this.policy.key + "/logo/" + strArr.join("") + '_size' + width + 'x' + height + nameType
      // 新上传的图
      this.newImageList.push({
        status: 'success',
        uid: file.uid,
        url: this.policy.url + '/' + fileName
      })
      return fileName
    }
  }
};
</script>

<style lang="scss">
.dialog-uploadimg {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .dialogimg-box {
    height: 600px;
    overflow-y: hidden;
    overflow-x: scroll;

    img {
      height: 100%;
      display: block;
      margin: 0 auto;
    }
  }
}

.upload-page {
  display: flex;

  .upload-img-ul-box {
    display: flex;
    flex-wrap: wrap;

    .upload-img-ul {
      background-color: #fbfdff;
      border: 1px solid #c0ccda;
      margin: 0 8px 8px 0;
      border-radius: 6px;
      width: 148px;
      height: 148px;
      overflow: hidden;
      position: relative;

      &:hover {
        .upload-img-bg {
          display: flex;
        }
      }

      .upload-img {
        width: 148px;
      }

      .upload-img-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 148px;
        height: 148px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
        cursor: default;
        text-align: center;
        color: #fff;
        font-size: 20px;
        text-align: center;
        display: flex;
        display: none;
        justify-content: space-around;
        flex-direction: row;

        span {
          width: 20px;
          height: 36px;
          line-height: 36px;
          display: block;
          justify-content: center;
          margin-top: 56px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
