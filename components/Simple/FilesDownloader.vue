<script>
import JSZip from 'jszip'


export default {
  name: 'FilesDownloader',
  inheritAttrs: false,
  props: {
    icon: {
      type: String,
      default: 'mdi-download'
    },
    fileListLoader: {
      type: Function,
      required: true
    },
    fileContentLoader: {
      type: Function,
      required: true
    },
    batchSize: {
      type: Number,
      default: 3
    },
    title: {
      type: String,
      default: 'Скачать файлы'
    },
    zipFileName: {
      type: String,
      default: 'files.zip'
    },
    zipOptions: {
      type: Object,
      default: () => ({
        compression: 'DEFLATE',
        compressionOptions: {level: 6}
      })
    },
    streamFiles: {
      type: Boolean,
      default: true
    },
    variant: String,
    size: String,
    density: {
      type: String,
      default: 'compact'
    },
    color: String,
    rounded: String,
    elevation: String,
    prependIcon: String,
    appendIcon: String
  },
  emits: ['action'],
  data() {
    return {
      // Состояние диалога
      showDialog: false,
      mode: 'progress', // 'progress', 'result', 'error'

      // Данные для прогресса
      loading: false,
      downloadInProgress: false,
      progress: 0,
      zipProgress: 0,
      processedFiles: 0,
      downloadedFiles: 0,
      totalFiles: 0,
      totalSize: 0,
      downloadedSize: 0,
      currentBatch: 0,
      totalBatches: 0,
      currentFile: '',
      statusMessage: '',

      // Данные для результата
      resultType: 'success',
      resultTitle: '',
      resultMessage: '',
      errorDetails: '',

      // Служебные данные
      cancelToken: null,
      filesToDownload: [],
      zip: null,
      abortControllers: [],
      startTime: null,
      elapsedTime: 0,
    }
  },
  computed: {
    dialogIcon() {
      if (this.mode === 'progress') return 'mdi-download'
      if (this.mode === 'error') return 'mdi-alert-circle'
      if (this.resultType === 'success') return 'mdi-check-circle'
      return 'mdi-information'
    },
    dialogTitle() {
      if (this.mode === 'progress') return 'Скачивание файлов'
      if (this.mode === 'error') return 'Ошибка'
      return 'Скачивание завершено'
    },
    alertIcon() {
      const icons = {
        success: 'mdi-check-circle',
        error: 'mdi-alert-circle',
        warning: 'mdi-alert',
        info: 'mdi-information'
      }
      return icons[this.resultType] || 'mdi-information'
    }
  },
  methods: {
    async startDownload() {
      try {
        this.resetState()
        this.mode = 'progress'
        this.showDialog = true
        this.startTime = Date.now()

        this.$emit('action', {'name': 'downloadStart'})

        this.loading = true
        this.downloadInProgress = true
        this.statusMessage = 'Получение списка файлов...'

        // Получаем список файлов

        this.filesToDownload = await this.fileListLoader()

        if (!this.filesToDownload || this.filesToDownload.length === 0) {
          throw new Error('Нет файлов для скачивания')
        }

        // Инициализация счетчиков
        this.totalFiles = this.filesToDownload.length
        this.totalBatches = Math.ceil(this.totalFiles / this.batchSize)
        this.totalSize = this.calculateTotalSize()

        // Создаем токен отмены
        this.cancelToken = {cancelled: false}

        // Создаем новый ZIP архив
        this.zip = new JSZip()

        this.statusMessage = 'Начинаем скачивание файлов...'

        // Запускаем пакетную загрузку
        await this.downloadFilesInBatches()

        if (!this.cancelToken.cancelled) {
          // Финальная генерация ZIP
          await this.generateZip()

          // Показываем результат
          this.showResult(
              'success',
              'Скачивание завершено',
              `Успешно скачано ${this.totalFiles} файлов (${this.formatSize(this.totalSize)})`
          )

          this.$emit('action', {
            'name': 'downloadComplete', data: {
              totalFiles: this.totalFiles,
              totalSize: this.totalSize,
              fileName: this.zipFileName,
              elapsedTime: this.elapsedTime
            }
          })
        }
      } catch (error) {
        console.error('❌ Ошибка при скачивании:', error)

        this.showResult(
            'error',
            'Ошибка при скачивании',
            error.message,
            error.stack
        )

        this.$emit('action', {'name': 'downloadError', data: error})
      } finally {
        this.loading = false
        this.downloadInProgress = false
        this.elapsedTime = Date.now() - this.startTime
      }
    },

    showResult(type, title, message, details = '') {
      this.mode = type === 'error' ? 'error' : 'result'
      this.resultType = type
      this.resultTitle = title
      this.resultMessage = message
      this.errorDetails = details
    },

    closeDialog() {
      this.showDialog = false
      // Очищаем состояние через небольшую задержку
      setTimeout(() => {
        this.resetState()
      }, 300)
    },

    retryDownload() {
      this.closeDialog()
      // Небольшая задержка перед повторной попыткой
      setTimeout(() => {
        this.startDownload()
      }, 300)
    },

    validateFilesList(files) {
      const warnings = []
      files.forEach((file, index) => {
        if (!file.name) {
          throw new Error(`Файл #${index + 1} не имеет имени`)
        }
        if (!file.url) {
          throw new Error(`Файл ${file.name} не имеет URL`)
        }
        if (file.size && file.size > this.maxFileSizeWarning) {
          warnings.push(`${file.name} (${this.formatSize(file.size)})`)
        }
      })

      if (warnings.length > 0) {
        console.warn('⚠️ Большие файлы:', warnings.join(', '))
      }
    },

    calculateTotalSize() {
      return this.filesToDownload.reduce((sum, file) => sum + (file.size || 0), 0)
    },

    async downloadFilesInBatches() {
      for (let batchIndex = 0; batchIndex < this.totalBatches; batchIndex++) {
        if (this.cancelToken.cancelled) break

        this.currentBatch = batchIndex + 1
        const start = batchIndex * this.batchSize
        const end = Math.min(start + this.batchSize, this.totalFiles)
        const fileBatch = this.filesToDownload.slice(start, end)

        this.statusMessage = `Загрузка пакета ${this.currentBatch} из ${this.totalBatches}...`

        // Создаем AbortController для этого пакета
        const abortController = new AbortController()
        this.abortControllers.push(abortController)

        try {
          // Загружаем файлы пакета параллельно
          await Promise.all(
              fileBatch.map(fileInfo =>
                  this.downloadAndAddToZip(fileInfo, abortController.signal)
              )
          )

          // Эмитим событие о завершении пакета
          this.$emit('action', {
            'name': 'batchComplete', 'data': {
              batchNumber: this.currentBatch,
              totalBatches: this.totalBatches,
              filesInBatch: fileBatch.length,
              totalProcessed: this.processedFiles
            }
          })

        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Загрузка пакета отменена')
            break
          }
          throw error
        }

        // Обновляем прогресс
        this.progress = (this.processedFiles / this.totalFiles) * 100

        // Небольшая пауза между пакетами для UI
        if (batchIndex < this.totalBatches - 1 && !this.cancelToken.cancelled) {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
    },

    async downloadAndAddToZip(fileInfo, signal) {
      if (this.cancelToken.cancelled) return

      this.currentFile = fileInfo.name

      try {
        // Загружаем файл с поддержкой отмены
        const content = await this.downloadFile(fileInfo.url, signal)

        // Добавляем в ZIP
        this.zip.file(fileInfo.name, content, {
          binary: true,
          createFolders: true
        })

        // Обновляем счетчики
        this.processedFiles++
        this.downloadedFiles = this.processedFiles
        this.downloadedSize += fileInfo.size || content.size

        console.log(`✓ Добавлен: ${fileInfo.name}`)

      } catch (error) {
        if (error.name === 'AbortError') {
          throw error
        }
        console.error(`✗ Ошибка при загрузке ${fileInfo.name}:`, error)
        throw new Error(`Не удалось загрузить ${fileInfo.name}: ${error.message}`)
      }
    },

    async downloadFile(url, signal) {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        signal,
        columns: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Проверяем размер контента если есть заголовок
      const contentLength = response.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > this.maxFileSizeWarning) {
        console.warn(`⚠️ Загружается большой файл: ${this.formatSize(parseInt(contentLength))}`)
      }

      return await response.blob()
    },

    async generateZip() {
      this.statusMessage = 'Формирование ZIP-архива...'
      this.zipProgress = 0

      try {
        // Генерируем ZIP с отслеживанием прогресса
        const blob = await this.zip.generateAsync({
          type: 'blob',
          compression: this.zipOptions.compression,
          compressionOptions: this.zipOptions.compressionOptions,
          streamFiles: this.streamFiles,
          comment: `Создано ${new Date().toLocaleString()}`
        }, (metadata) => {
          // Обновляем прогресс сжатия
          this.zipProgress = metadata.percent
          this.statusMessage = `Сжатие: ${Math.round(metadata.percent)}%`
        })

        // Сохраняем файл
        saveAs(blob, this.zipFileName)

        this.zipProgress = 100
        this.statusMessage = 'Архив успешно создан'

      } catch (error) {
        console.error('Ошибка при генерации ZIP:', error)
        throw new Error('Не удалось создать ZIP-архив')
      }
    },

    cancelDownload() {
      if (this.cancelToken) {
        this.cancelToken.cancelled = true

        // Отменяем все текущие запросы
        this.abortControllers.forEach(controller => {
          controller.abort()
        })

        this.statusMessage = 'Отмена скачивания...'
        this.downloadInProgress = false
        this.resultMessage = 'Скачивание отменено'
        this.resultType = 'info'
        this.showResult = true

        this.$emit('action', {'name': 'downloadCancelled'})
      }
    },

    resetState() {
      this.progress = 0
      this.zipProgress = 0
      this.processedFiles = 0
      this.downloadedFiles = 0
      this.totalFiles = 0
      this.totalSize = 0
      this.downloadedSize = 0
      this.currentBatch = 0
      this.totalBatches = 0
      this.currentFile = ''
      this.statusMessage = ''
      this.cancelToken = null
      this.zip = null
      this.abortControllers = []
    },

    formatSize(bytes) {
      if (bytes === 0) return '0 Б'
      const k = 1024
      const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
}
</script>

<template>
  <v-btn
      :loading="loading"
      :disabled="loading"
      :variant="variant"
      :color="color"
      :density="density"
      :title="title"

      :rounded="rounded"
      :elevation="elevation"
      :size="size"
      :icon="icon || 'mdi-download'"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :text="title && !prependIcon && !appendIcon? title: undefined"
      class="icon-centered"
      @click="startDownload"
  />

  <!-- Единый диалог для прогресса и результатов -->
  <v-dialog
      v-model="showDialog"
      width="600"
      persistent
      :scrim="true"
  >
    <v-card>
      <v-card-title class="headline bg-grey-lighten-2 d-flex align-center">
        <v-icon left class="mr-2">{{ dialogIcon }}</v-icon>
        {{ dialogTitle }}
      </v-card-title>

      <v-card-text class="pt-4">
        <!-- Режим: Прогресс загрузки -->
        <template v-if="mode === 'progress'">
          <!-- Общий прогресс -->
          <div class="text-subtitle-1 font-weight-medium mb-1">
            Общий прогресс: {{ Math.round(progress) }}%
          </div>
          <v-progress-linear
              v-model="progress"
              height="20"
              color="primary"
              class="mb-4"
              striped
          >
            <template v-slot:default="{ value }">
              <strong>{{ Math.round(value) }}%</strong>
            </template>
          </v-progress-linear>

          <!-- Детальная информация -->
          <v-sheet class="bg-grey-lighten-4 pa-3 rounded">
            <div class="text-body-2">
              <div class="d-flex justify-space-between mb-1">
                <span>Файлы:</span>
                <span class="font-weight-medium">{{ downloadedFiles }} из {{ totalFiles }}</span>
              </div>

              <div class="d-flex justify-space-between mb-1">
                <span>Пакет:</span>
                <span class="font-weight-medium">{{ currentBatch }} из {{ totalBatches }}</span>
              </div>

              <div v-if="totalSize" class="d-flex justify-space-between mb-1">
                <span>Размер:</span>
                <span class="font-weight-medium">{{ formatSize(downloadedSize) }} / {{ formatSize(totalSize) }}</span>
              </div>

              <div v-if="currentFile" class="mt-2">
                <span>Текущий файл:</span>
                <div class="text-caption text-truncate">{{ currentFile }}</div>
              </div>

              <div v-if="statusMessage" class="mt-2 font-weight-medium">
                {{ statusMessage }}
              </div>
            </div>
          </v-sheet>

          <!-- Прогресс сжатия ZIP -->
          <div v-if="zipProgress > 0 && zipProgress < 100" class="mt-3">
            <div class="text-subtitle-2 mb-1">Сжатие архива: {{ Math.round(zipProgress) }}%</div>
            <v-progress-linear
                v-model="zipProgress"
                height="10"
                color="success"
            ></v-progress-linear>
          </div>
        </template>

        <!-- Режим: Результат -->
        <template v-else-if="mode === 'result'">
          <v-alert
              :type="resultType"
              :icon="alertIcon"
              class="mb-0"
              variant="tonal"
          >
            <div class="text-h6 mb-2">{{ resultTitle }}</div>
            <div>{{ resultMessage }}</div>

            <!-- Детальная статистика -->
            <v-sheet class="bg-transparent mt-3" color="transparent">
              <div class="d-flex justify-space-between text-body-2">
                <span>Всего файлов:</span>
                <span class="font-weight-medium">{{ totalFiles }}</span>
              </div>
              <div class="d-flex justify-space-between text-body-2">
                <span>Общий размер:</span>
                <span class="font-weight-medium">{{ formatSize(totalSize) }}</span>
              </div>
              <div v-if="downloadedSize" class="d-flex justify-space-between text-body-2">
                <span>Скачано:</span>
                <span class="font-weight-medium">{{ formatSize(downloadedSize) }}</span>
              </div>
              <div class="d-flex justify-space-between text-body-2">
                <span>Архив:</span>
                <span class="font-weight-medium">{{ zipFileName }}</span>
              </div>
              <div class="d-flex justify-space-between text-body-2">
                <span>Время:</span>
                <span class="font-weight-medium">{{ formatTime(elapsedTime) }}</span>
              </div>
            </v-sheet>
          </v-alert>
        </template>

        <!-- Режим: Ошибка -->
        <template v-else-if="mode === 'error'">
          <v-alert
              type="error"
              icon="mdi-alert-circle"
              class="mb-0"
              variant="tonal"
          >
            <div class="text-h6 mb-2">{{ resultTitle || 'Ошибка' }}</div>
            <div>{{ resultMessage }}</div>

            <div v-if="errorDetails" class="mt-2 text-caption">
              {{ errorDetails }}
            </div>
          </v-alert>
        </template>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <!-- Кнопки для режима прогресса -->
        <template v-if="mode === 'progress'">
          <v-btn
              color="error"
              variant="text"
              @click="cancelDownload"
              :disabled="!downloadInProgress || zipProgress > 0"
              prepend-icon="mdi-cancel"
          >
            Отмена
          </v-btn>
        </template>

        <!-- Кнопки для режима результата/ошибки -->
        <template v-else>
          <v-btn
              :color="resultType === 'error' ? 'error' : 'success'"
              variant="text"
              @click="closeDialog"
              :prepend-icon="resultType === 'error' ? 'mdi-close' : 'mdi-check'"
          >
            {{ resultType === 'error' ? 'Закрыть' : 'Готово' }}
          </v-btn>

          <!-- Кнопка для повторной попытки при ошибке -->
          <v-btn
              v-if="mode === 'error'"
              color="primary"
              variant="text"
              @click="retryDownload"
              prepend-icon="mdi-refresh"
          >
            Повторить
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.icon-centered .v-icon--left {
  margin-right: 0 !important;
}
</style>