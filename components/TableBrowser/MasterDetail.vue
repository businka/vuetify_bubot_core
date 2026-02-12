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
  <div class="split-container d-flex flex-column fill-height overflow-hidden">
    <div class="d-flex flex-grow-1 overflow-hidden">
      <!-- Master панель -->
      <div
          ref="masterPane"
          class="master-pane d-flex flex-column flex-shrink-0 overflow-hidden"
          :style="{ width: currentMasterWidth + 'px', minWidth: masterWidthMin + 'px' }"
      >
        <component
            v-if="master.template"
            :is="master.template"
            :autoActivate="{index:0}"
            v-model:selected="masterSelected"
            v-model:active="masterActive"
            v-bind="master"
            class="flex-fill d-flex flex-column overflow-hidden"
            style="min-height: 0;"
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
          class="detail-pane d-flex flex-column flex-grow-1 overflow-hidden" style="min-width: 0;"
      >
        <component
            v-if="masterActive"
            :is="detail.template"
            :item="masterActive"
            v-bind="detail"

            class="flex-fill d-flex flex-column overflow-hidden"
            style="min-height: 0;"
        />
        <div v-else>
          Пусто
        </div>
        <!-- Плейсхолдер когда ничего не выбрано -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.split-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.master-pane {
  border-right: 1px solid #e0e0e0;
}

.detail-pane {
  min-width: 0;
}

.splitter {
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

.splitter:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.splitter-line {
  width: 2px;
  height: 100%;
  background-color: #e0e0e0;
}

.splitter:hover .splitter-line {
  background-color: #1976d2;
}
</style>