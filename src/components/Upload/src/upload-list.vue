<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :key="file.uid"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt=""
        >
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{ file.name }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"></i>
        </label>
        <i v-if="!disabled" class="el-icon-close" @click="$emit('remove', file)"></i>
        <i v-if="!disabled" class="el-icon-close-tip">{{ t('el.upload.deleteTip') }}</i>
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)">
        </el-progress>
        <span v-if="listType === 'picture-card'" class="el-upload-list__item-actions">
          <span
            v-if="handleSetpic && listType === 'picture-card'"
            class="el-upload-list__item-setpic"
            @click="handleSetpic(file)"
          >
            <i class="el-icon-star-off" />
          </span>
          <span
            v-if="handlePreview && listType === 'picture-card'"
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="$emit('remove', file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>
import Locale from 'element-ui/src/mixins/locale'
import ElProgress from 'element-ui/packages/progress'

export default {

  name: 'ElUploadList',
  components: { ElProgress },

  mixins: [Locale],

  props: {
    files: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    handleSetpic: Function,
    listType: String
  },

  data() {
    return {
      focusing: false
    }
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10)
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file)
    }
  }
}
</script>
