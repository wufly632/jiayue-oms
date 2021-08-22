<template>
  <div class="batch-setting-dialog">
    <!-- 批量设置价格 -->
    <el-dialog
      title="Batch setting"
      :visible.sync="dialogVisible"
      width="800px"
      center
      v-loading="loading">

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
        <el-form-item label="Selling price(₦)">
          <el-input v-model="batchSettings.sellingPrice"/>
        </el-form-item>
        <el-form-item label="compare price">
          <el-input v-model="batchSettings.comparePrice"/>
        </el-form-item>
        <el-form-item label="inventory">
          <el-input v-model="batchSettings.inventory"/>
        </el-form-item>
        <el-form-item label="Supplier code">
          <el-input v-model="batchSettings.code"/>
        </el-form-item>
        <el-form-item label="wight">
          <el-input v-model="batchSettings.weight"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirmBatch">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 批量设置价格end -->
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      batchSelectingAttrValues: [], // 批量
    }
  },
  create() {},
  mounted() {},
  methods: {
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
    // 提交批量修改
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
          this.skus[index] = sku
        }
      }
      this.setPriceVisible = false

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
      }
    },
    handleBatchSettings() {
      this.setPriceVisible = true
      this.computeBatchSelectingAttrValues()
    }
  }
}
</script>

<style lang="less">
  
</style>