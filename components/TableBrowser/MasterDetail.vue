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
  computed: {},
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
    initialWidth(newVal) {
      this.currentMasterWidth = newVal;
    }
  }
};
</script>

<style scoped>
.split-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.split-pane {
  overflow: auto;
  position: relative;
  height: 100%;
}

.master-pane {
  flex-shrink: 0;
  border-right: 1px solid #e0e0e0;
  height: 100%;
}

.detail-pane {
  min-width: 0;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
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

<template>
  <div class="split-container d-flex fill-height">
    <!-- Левая часть (Master) -->
    <div
        ref="masterPane"
        class="split-pane master-pane"
        :style="{ width: currentMasterWidth + 'px', 'min-width': masterWidthMin + 'px' }"
    >
      <template v-if="master.template" class="fill-height">
        <component
            :is="master.template"
            :autoActivate="{index:0}"
            v-model:selected="masterSelected"
            v-model:active="masterActive"
            v-bind="master"
            class="fill-height"
        />
      </template>
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

    <!-- Правая часть (Detail) -->
    <div
        class="split-pane detail-pane flex-grow-1"
    >
      <template v-if="detail.template">
        <component
            v-if="masterActive"
            :is="detail.template"
            :item="masterActive"
            v-bind="detail"
            class="fill-height"
        />
      </template>
    </div>
  </div>
</template>
