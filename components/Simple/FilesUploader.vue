<script>
import ModalProgressBar from "../TableBrowser/resources/FormAction/ModalProgressBar";
import Action from "../../helpers/mixinTemplate/action";

export default {
  name: "FileUploader",
  mixins: [Action],
  components: {ModalProgressBar},
  inheritAttrs: false,
  props: {
    icon: String,
    loader: {
      type: Function,
      required: true
    },
    batchSize: {
      type: Number,
      default: 5
    },
    title: {
      type: String,
      default: 'Загрузить файлы'
    },
    inToolbar: {
      type: Boolean,
      default: false
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
      loading: false,
      actionForm: undefined,
      uploadInProgress: false,
      showProgressDialog: false,
      progress: 0,
      processedFiles: 0,
      totalFiles: 0,
      currentBatch: 0,
      totalBatches: 0,
      currentFile: '',
      statusMessage: '',
      resultMessage: '',
      resultType: 'success',
      cancelToken: null
    }
  },
  computed: {},
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileSelect(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      this.actionForm = {
        template: 'ModalProgressBar',
        visible: true,
        title: 'Загрузка файлов',
        message: 'Получение списка файлов',
        error: undefined,
        progress: -1,
        status: 'run',
        cancelFunction: this.cancelDownload
      }
      this.totalFiles = files.length;
      this.totalBatches = Math.ceil(files.length / this.batchSize);
      this.processedFiles = 0;
      this.currentBatch = 0;
      this.actionForm.progress = 0;
      this.cancelToken = {cancelled: false};

      try {
        // Запускаем оптимизированную обработку файлов
        await this.processFilesOptimized(files, this.cancelToken);

        if (this.cancelToken.cancelled) {
          this.resultMessage = 'Загрузка отменена';
          this.resultType = 'info';
        } else {
          this.resultMessage = `Успешно загружено ${this.totalFiles} файлов`;
          this.resultType = 'success';
          this.$emit('action', {
            'name': 'upload-complete', data: {
              totalFiles: this.totalFiles,
              success: true
            }
          });
        }
      } catch (error) {
        console.error('Ошибка при загрузке файлов:', error);
        this.resultMessage = `Ошибка: ${error.message}`;
        this.resultType = 'error';
        this.$emit('action', {'name': 'upload-error', error});
      } finally {
        this.loading = false;
        this.uploadInProgress = false;

        // Закрываем диалог через 2 секунды после завершения
        setTimeout(() => {
          this.showProgressDialog = false;
          this.statusMessage = '';
        }, 2000);

        event.target.value = '';
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.currentFile = file.name;
          resolve(e.target.result);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    },
    async processFilesOptimized(files, cancelToken) {
      if (cancelToken.cancelled) return;

      for (let batchIndex = 0; batchIndex < this.totalBatches; batchIndex++) {
        if (cancelToken.cancelled) break;

        this.currentBatch = batchIndex + 1;

        // Определяем границы пакета
        const start = batchIndex * this.batchSize;
        const end = Math.min(start + this.batchSize, files.length);
        const fileBatch = files.slice(start, end);

        // Обновляем прогресс
        this.processedFiles = start;
        this.actionForm.progress = (this.processedFiles / this.totalFiles) * 100;
        this.actionForm.message = `Загрузка файлов ${this.processedFiles} из ${this.totalFiles}`;

        // Показываем первый файл из пакета
        if (fileBatch.length > 0) {
          this.currentFile = fileBatch[0].name +
              (fileBatch.length > 1 ? ` и ещё ${fileBatch.length - 1}...` : '');
        }

        // СОЗДАЕМ FORMDATA ПРЯМО ЗДЕСЬ
        const formData = new FormData();

        // 1. Добавляем параметры из loaderParams
        // if (this.loaderParams && typeof this.loaderParams === 'object') {
        //   Object.entries(this.loaderParams).forEach(([key, value]) => {
        //     if (value !== null && value !== undefined) {
        //       if (typeof value === 'object' || Array.isArray(value)) {
        //         formData.append(key, JSON.stringify(value));
        //       } else {
        //         formData.append(key, String(value));
        //       }
        //     }
        //   });
        // }

        // 2. Добавляем файлы в FormData
        // Вариант A: Все файлы под одним ключом (для массива)
        fileBatch.forEach((file, index) => {
          formData.append('Files', file); // Просто добавляем File объект
        });

        // Вариант B: Если сервер ожидает Files[index]
        // fileBatch.forEach((file, index) => {
        //   formData.append(`Files[${index}]`, file);
        // });

        // Вариант C: Если сервер ожидает Files как объект с файлами
        // fileBatch.forEach((file, index) => {
        //   formData.append(`Files.${index}`, file);
        // });

        // Для отладки - что в FormData
        // this.debugFormData(formData);

        // Обновляем статус

        try {
          // Передаем FormData в loader
          await this.loader(formData);
          console.log(`✓ Пакет ${this.currentBatch} успешно загружен (${fileBatch.length} файлов)`);
        } catch (error) {
          this.actionForm.status = 'error'
          this.actionForm.error = error
          throw error;
        }

        // Обновляем прогресс после успешной загрузки пакета
        this.processedFiles = Math.min(end, files.length);
        this.progress = (this.processedFiles / this.totalFiles) * 100;

        // Небольшая пауза между пакетами для UI
        if (batchIndex < this.totalBatches - 1 && !cancelToken.cancelled) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      if (!cancelToken.cancelled) {
        this.actionForm.status = 'success'
        this.actionForm.message = `Успешно загружено ${this.totalFiles} файлов`
      }
    },

    // Метод для отладки FormData
    debugFormData(formData) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`=== FormData для пакета ${this.currentBatch} ===`);
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}:`, value);
          }
        }
        console.log('===========================');
      }
    },
    actionCloseForm() {
      this.actionForm = undefined
    },
    cancelUpload() {
      if (this.cancelToken) {
        this.cancelToken.cancelled = true;
        this.actionForm.status = 'abort'
        this.actionForm.message = 'Скачивание отменено'
      }
    }
  }
}
</script>

<style scoped>
</style>

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
      :icon="icon || 'mdi-import'"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :text="title && !prependIcon && !appendIcon? title: undefined"
      class="icon-centered"
      min-width="0"
      @click="triggerFileInput"
  />

  <input
      type="file"
      ref="fileInput"
      multiple
      webkitdirectory
      directory
      style="display: none"
      @change="handleFileSelect"
  />
  <ModalProgressBar v-bind="actionForm" @action="onAction"/>
</template>
