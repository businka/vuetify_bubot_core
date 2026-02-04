<script>
export default {
  name: 'ResizeHandle',
  props: {
    isResizing: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: Number,
      default: 100
    },
    maxWidth: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      startX: 0,
      startWidth: 0
    }
  },
  methods: {
    startResize(e) {
      this.startX = e.clientX || e.touches[0].clientX;
      this.startWidth = this.$parent.masterWidth || this.$parent.initialWidth;

      // Предотвращаем выделение текста при перетаскивании
      e.preventDefault();
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      this.$emit('resize-start');
    },

    handleMouseMove(e) {
      if (!this.isResizing) return;

      e.preventDefault();
      const currentX = e.clientX;
      this.updateWidth(currentX);
    },

    handleTouchMove(e) {
      if (!this.isResizing) return;

      e.preventDefault();
      const currentX = e.touches[0].clientX;
      this.updateWidth(currentX);
    },

    updateWidth(currentX) {
      const deltaX = currentX - this.startX;
      let newWidth = this.startWidth + deltaX;

      // Применяем ограничения по ширине
      if (newWidth < this.minWidth) {
        newWidth = this.minWidth;
      }

      if (this.maxWidth && newWidth > this.maxWidth) {
        newWidth = this.maxWidth;
      }

      this.$emit('resize', newWidth);
    },

    stopResize() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      this.$emit('resize-end');
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.stopResize);
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.stopResize);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.stopResize);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.stopResize);
  }
}
</script>

<style scoped>
.resize-handle {
  width: 4px;
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

.resize-handle:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.resize-line {
  width: 2px;
  height: 100%;
}

.resize-handle:hover .resize-line {
  background-color: #1976d2;
}

/* Стили для состояния перетаскивания */
.resize-handle-resizing {
  background-color: rgba(25, 118, 210, 0.1) !important;
}

.resize-handle-resizing .resize-line {
  background-color: #1976d2;
}
</style>

<template>
  <div
      class="resize-handle"
      :class="{ 'resize-handle-resizing': isResizing }"
      @mousedown="startResize"
      @touchstart="startResize"
  >
    <div class="resize-line"></div>
  </div>
</template>
