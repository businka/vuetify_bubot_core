<script>
import {isEmptyObject, objHasOwnProperty} from "bubot-helper/BaseHelper";
import ResizeHandle from './resources/MasterDetailResizeHandle.vue'

export default {
  name: "MasterDetail",
  components: {
    ResizeHandle
  },
  props: {
    master: {
      type: Object,
      default: () => ({})
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    masterKeyForDetail: {
      type: String
    },
    masterFieldInDetail: {
      type: String
    },
    masterWidth: {
      type: Number,
      default: 250
    },
    masterWidthMin: {
      type: Number,
      default: 100
    },
    masterWidthMax: {
      type: Number,
      default: null
    },
    resizing: {
      type: Boolean,
      default: false
    },
    resizingWidth: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      currentMasterWidth: this.masterWidth,
      isResizing: false,
      masterActive: undefined,
      masterSelected: [],
    };
  },
  computed: {
    masterPaneStyle() {
      return {
        width: this.currentMasterWidth + 'px',
        'min-width': this.masterWidthMin + 'px'
      }
    }
  },
  methods: {
    handleResizeStart() {
      this.isResizing = true;
    },
    handleResize(newWidth) {
      this.currentMasterWidth = newWidth;
    },
    handleResizeEnd() {
      this.isResizing = false;
    },
    onAction(event) {
      this.$emit('action', event);
    }
  },
  watch: {
    masterWidth(newVal) {
      this.currentMasterWidth = newVal;
    }
  }
};
</script>
<template>
  <div class="split-container">
    <div class="split-content">
      <!-- Master панель -->
      <div
          ref="masterPane"
          class="master-pane"
          :style="{ width: currentMasterWidth + 'px', minWidth: masterWidthMin + 'px' }"
      >
        <component
            v-if="master.template"
            :is="master.template"
            :autoActivate="{index:0}"
            v-model:selected="masterSelected"
            v-model:active="masterActive"
            v-bind="master"
            class="master-component"
            @action="onAction"
        />
      </div>

      <!-- Разделитель -->
      <ResizeHandle
          v-if="resizing"
          :is-resizing="isResizing"
          :min-width="masterWidthMin"
          :max-width="masterWidthMax"
          @resize-start="handleResizeStart"
          @resize="handleResize"
          @resize-end="handleResizeEnd"
      />

      <!-- Detail панель -->
      <div
          v-if="detail.template"
          class="detail-pane"
      >
        <component
            v-if="masterActive"
            :is="detail.template"
            :item="masterActive"
            v-bind="detail"
            class="detail-component"
            @action="onAction"
        />
        <div v-else class="empty-state">
          Пусто
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.split-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.split-content {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.master-pane {
  height: 100%;
  overflow: hidden;
  border-right: 1px solid #e0e0e0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.detail-pane {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.master-component,
.detail-component {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(0, 0, 0, 0.6);
  flex: 1 1 auto;
}

// Стили для разделителя (оставляем оригинальные)
:deep(.splitter) {
  width: 10px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: col-resize;
  background-color: transparent;
  z-index: 10;
  position: relative;
  touch-action: none;
}

:deep(.splitter:hover) {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.splitter-line) {
  width: 2px;
  height: 100%;
  background-color: #e0e0e0;
}

:deep(.splitter:hover .splitter-line) {
  background-color: #1976d2;
}
</style>