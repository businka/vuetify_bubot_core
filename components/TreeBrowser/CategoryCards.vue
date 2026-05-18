<script>
import {defineComponent, inject} from 'vue'
import Service from "../DataSource/Service"
import {isEmptyObject, objHasOwnProperty, updateObject} from "bubot-helper/BaseHelper"
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from "../TableBrowser/resources/BrowserActionMixin";
import UrlParam from "bubot-helper/UrlParam";
import {findIndexInArrayObj} from "bubot-helper/ArrayHelper";

export default defineComponent({
  name: 'CategoryCards',
  mixins: [ActionMixin, BrowserActionMixin],
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    },
    filterConst: {
      type: Object,
      default: () => ({})
    },
    showActions: {
      type: Boolean,
      default: false
    },
    rowActivateHandler: {
      type: Object,
      default: function () {
        return {
          name: '',
        }
      }
    },
  },

  data() {
    return {
      // Данные
      items: [],
      source: null,
      urlParam: new UrlParam(),
      editForm: {},
      // Состояния
      loading: false,
      error: null,
      needUpdate: false,
      // Опции сервиса
      options: {}
    }
  },

  computed: {
    showEmptyState() {
      return !this.loading &&
          !this.error &&
          (!this.source || this.source.rows.length === 0)
    }
  },

  watch: {},

  methods: {

    async init() {
      this.categories = []
      this.options = {}
      this.editForm = {}
      // Объединяем настройки источника данных
      const dataSource = updateObject(
          {appName: inject('appName')},
          {filterConst: {}},
          this.dataSource,
          this.options
      )

      // Создаем сервис для работы с API
      this.source = new Service(dataSource)
      this.needUpdate = true
      this.checkRouteQuery()
    },

    // Функция для форматирования названия категории
    formatCategoryName(id) {
      if (!id) return 'Без названия'

      // Преобразуем camelCase или snake_case в читаемый текст
      return id
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^./, str => str.toUpperCase())
          .trim()
    },

    // Функция для получения URL изображения
    getImageUrl(imageName) {
      const prefix = import.meta.env.BASE_URL || ''
      return `${prefix}/images/${this.source.props.objName}Logo/${imageName}.svg`.replace(/\/\/+/g, '/')
    },

    autoActivateRow: function () {
      if (isEmptyObject(this.autoActivate) || this.internalActive) {
        return
      }
      let findKey = this.autoActivate[this.source.props.keyProperty]

      if (findKey && this.source.rows) {

        let foundItem = null
        for (const category of this.source.rows) {
          const foundItem = category.children?.find(child => child[this.source.props.keyProperty] === findKey)
          if (foundItem) {
            this.actionRowActivate({row: foundItem})
            break
          }
        }

      }

    },

    actionRowActivate: function (data) {
      if (!data.row) {
        console.error('rowActivate - "row" not found')
        return
      }
      let handler = `RowActivateHandler${this.rowActivateHandler.name}`
      if (objHasOwnProperty(this, handler)) {
        this[handler](data)
      } else {
        console.log(`RowActivateHandler not found ${this.rowActivateHandler.name}`)
      }
    },
    RowActivateHandlerShowForm(data) {
      let formName = data.row.form || this.rowActivateHandler.form
      let formUid
      if (formName.indexOf('/') < 0) {
        formUid = `${this.source.props.objName}${data.row.subtype ? ('/' + data.row.subtype) : ''}/${formName}`
      } else {
        formUid = formName
      }

      this.editForm = {
        handler: this.rowActivateHandler['formViewer'],
        formUid: formUid,
        visible: true,
        _updateKey: Date.now(),
        formData: {
          item: data.row,
          index: data.index,
          filterConst: this.source.props.filterConst
        },
      }

      this.addIdToRouteQuery([this.source.props.objName], data.row[this.source.props.keyProperty])
    },

  }
})
</script>

<style scoped>
.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Количество строк до обрезания */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.category-image {
  min-width: 48px;
  min-height: 48px;
  max-width: 48px;
  max-height: 48px;
  border-radius: 8px;
}
</style>

<template>
  <v-container fluid>
    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular
          indeterminate
          color="primary"
          size="64"
      ></v-progress-circular>
      <div class="mt-4">Загрузка категорий...</div>
    </div>
    <!-- Пустое представление -->
    <div v-else-if="showEmptyState" class="text-center py-16">
      <v-icon
          size="96"
          color="grey-lighten-2"
          class="mb-4"
      >
        mdi-folder-outline
      </v-icon>
      <div class="text-h6 text-grey mb-2">Категории не найдены</div>
      <div class="text-body-1 text-grey mb-6">
        Нет доступных категорий для отображения
      </div>
      <v-btn
          color="primary"
          variant="outlined"
          @click="fetch(null)"
      >
        <v-icon start>mdi-refresh</v-icon>
        Обновить
      </v-btn>
    </div>

    <!-- Ошибка сервиса -->
    <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        class="my-4"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-alert-circle</v-icon>
        <div>
          <div class="font-weight-bold">Ошибка сервиса</div>
          <div>{{ error }}</div>
          <div class="mt-2">
            <v-btn
                color="error"
                variant="text"
                size="small"
                @click="fetch(null)"
            >
              <v-icon start size="small">mdi-refresh</v-icon>
              Повторить попытку
            </v-btn>
          </div>
        </div>
      </div>
    </v-alert>

    <!-- Данные -->
    <div v-else>
      <div v-for="category in source.rows" :key="category._id" class="mb-8">
        <div class="text-h6 font-weight-bold pl-2">{{ formatCategoryName(category._id) }}</div>
        <v-container fluid class="pa-2">
          <v-row dense>
            <v-col
                v-for="(item, index) in category.children"
                :key="`${category._id}-${item._id}-${index}`"
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="4"
            >
              <slot
                  name="category-item"
                  :item="item"
                  :index="index"
                  :category="category"
                  :actionRowActivate="actionRowActivate"
                  :getImageUrl="getImageUrl"
              >
                <v-card
                    rounded="lg"
                    hover
                    link
                    height="100"
                    @click.stop="actionRowActivate({row: item})"
                >
                  <div class="pa-4 d-flex flex-no-wrap justify-space-between">
                    <v-img
                        :src="getImageUrl(item['_id'])"
                        :alt="item['Title']"
                        width="48"
                        height="48"
                        rounded
                        contain
                        :title="item['Title']"
                        class="mr-3 flex-shrink-0 category-image"
                    />
                    <div class="flex-grow-1" >
                      <v-card-title class="text-h6 pa-0 mt-n2"> {{ item['Title'] }}</v-card-title>
                      <v-card-text class="text-caption pa-0 mt-n1 text-grey-darken-1 multi-line-ellipsis">
                        {{ item['Description'] }}
                      </v-card-text>
                    </div>
                  </div>
                </v-card>
              </slot>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <component
        :is="editForm.handler"
        v-if="editForm && editForm.visible && editForm.handler!=='inline'"
        :key="editForm._updateKey || Date.now()"
        :formUid="editForm.formUid"
        :visible="editForm.visible"
        :formData="editForm.formData"
        @action="onAction($event, 'editForm')"
    />
  </v-container>
</template>
