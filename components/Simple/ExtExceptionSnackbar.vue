<script>
export default {
  name: 'ExtException',
  props: {
    modelValue: {},
    dialog: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: String,
      default: '-1'
    },
    messageTypography: {
      type: String,
      default: 'h6'
    },
    detailTypography: {
      type: String,
      default: 'caption'
    },
  },
  emits: ['update:modelValue'],
  data: function () {
    return {}
  },
  computed: {
    showSnackbar: {
      get() {
        return !!this.modelValue;
      },
      set(value) {
        if (!value) {
          this.$emit('update:modelValue', null);
        }
      }
    }
  },
  methods: {
    closeSnackbar() {
      this.$emit('update:modelValue', null);
    }
  }
}
</script>
<style lang="scss">
/*.linkField .v-input__append-outer {*/
/*margin-left: 0px;*/
/*margin-right: 0px;*/
/*}*/

</style>

<template>
  <div v-if="modelValue">
    <v-snackbar
        v-if="dialog"
        v-model="showSnackbar"
        multi-line
        color="error"
        location="bottom right"
        :timeout="timeout"
        :value="true"
        class="pa-0 ma-0"
    >
      <v-row
          class="body-2 pl-3"
      >
        {{ $t(`ErrorMsg.${modelValue.message}`) }}
      </v-row>
      <v-row
          class="caption pl-3 pt-1"
      >
        {{ modelValue.detail }}
      </v-row>
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            icon="mdi-close"
            @click="closeSnackbar"
            size="small"
        />

      </template>

    </v-snackbar>
    <div
        v-else
        class="pa-0 ma-0"
    >
      <div :class="`error--text ${messageTypography}`">
        {{ $t(`ErrorMsg.${modelValue.message}`) }}
      </div>
      <div :class="`error--text ${detailTypography}`">
        {{ modelValue.detail }}
      </div>
    </div>
  </div>
</template>
