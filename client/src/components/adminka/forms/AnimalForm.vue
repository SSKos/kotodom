<template>
  <div class="top-gap center">
    <form @submit.prevent="submitAnimal" class="animal-form">
      <!-- Заголовок формы в зависимости от состояния (добавление или редактирование) -->
      <h2 v-if="animalId">Редактировать животное #{{ animal.name }}</h2>
      <h2 v-else>Добавить новое животное</h2>

      <!-- Поля формы для информации о животном -->
      <div class="form form_input-fields">
        <div class="field-group">
          <label for="admissionDate">Дата поступления:</label>
          <input type="date" id="admissionDate" v-model="animal.admissionDate" required/>
        </div>

        <div class="field-group">
          <label for="name">Имя животного:</label>
          <input type="text" id="name" v-model="animal.name" placeholder="Введите имя" required/>
        </div>

        <div class="field-group">
          <label>Возраст:</label>
          <div class="age-inputs">
            <input type="number" v-model.number="animal.ageYears" placeholder="Лет" min="0"/>
            <input type="number" v-model.number="animal.ageMonths" placeholder="Месяцев" min="0" max="11"/>
          </div>
        </div>

        <div class="field-group">
          <label>Гендер:</label>
          <label><input type="radio" v-model="animal.gender" value="Мужской" required/> Мужской</label>
          <label><input type="radio" v-model="animal.gender" value="Женский" required/> Женский</label>
        </div>

        <div class="field-group">
          <label for="description">Описание:</label>
          <textarea id="description" v-model="animal.description" placeholder="Описание животного"></textarea>
        </div>

        <div class="field-group">
          <label><input type="checkbox" v-model="animal.requiresTreatment"/> Нуждается в лечении</label>
        </div>

        <div v-if="animal.requiresTreatment" class="field-group">
          <label for="treatmentDescription">Описание лечения:</label>
          <textarea id="treatmentDescription" v-model="animal.treatmentDescription"
                    placeholder="Описание лечения"></textarea>
        </div>

        <div class="field-group">
          <label><input type="checkbox" v-model="animal.sterilized"/> Стерилизован</label>
        </div>

        <div class="field-group">
          <label><input type="checkbox" v-model="animal.urgentHelp"/> Срочно нужна помощь</label>
        </div>

        <div v-if="animal.urgentHelp" class="field-group">
          <label for="urgentHelpDescription">Описание срочной помощи:</label>
          <textarea id="urgentHelpDescription" v-model="animal.urgentHelpDescription"
                    placeholder="Описание помощи"></textarea>
        </div>

        <div class="field-group">
          <label for="diet">Особенности корма:</label>
          <input type="text" id="diet" v-model="animal.diet" placeholder="Особенности корма"/>
        </div>

        <div class="field-group">
          <label><input type="checkbox" v-model="animal.publish"/> Публиковать</label>
        </div>

        <div class="field-group">
          <label><input type="checkbox" v-model="animal.adopted"/> Взяли домой</label>
        </div>
      </div>

      <!-- Загрузка фото для добавления новых изображений -->
      <div>
        <label for="add-photos">Добавить фото:</label>
        <input
            type="file"
            ref="photo-upload"
            @change="handlePhotoUpload"
          accept="image/jpeg,image/png"
            multiple
            style="display: none"
        />
        <button type="button" @click="$refs['photo-upload'].click()">Добавить фото</button>
      </div>

      <!-- Загруженные фото -->
      <div v-if="animal.photos && animal.photos.length">
        <h3>Загруженные фото:</h3>
        <div
          v-for="photo in animal.photos"
          :key="photo._id"
          :class="['photo-item', { 'cat-photo-box_main': photo.main }]"
        >
          <img :src="photo.fullPath" alt="Фото" width="100"/>
          <button type="button" @click="removePhoto(photo._id)">Удалить</button>
          <label>
            <input type="radio" name="mainPhoto" :checked="photo.main" @change="makeMainPhoto(photo)">
            Главная
          </label>
        </div>
      </div>

      <!-- Кнопка отправки формы -->
      <button type="submit">Сохранить</button>
    </form>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  props: {
    // Идентификатор животного, используется для определения, редактируется ли существующее животное
    animalId: String,
  },
  data() {
    return {
      // Структура данных для хранения информации о животном
      animal: {
        admissionDate: "",
        name: "",
        ageYears: 0,
        ageMonths: 0,
        gender: "",
        description: "",
        requiresTreatment: false,
        treatmentDescription: "",
        sterilized: false,
        urgentHelp: false,
        urgentHelpDescription: "",
        diet: "",
        photos: [],
        publish: false,
        adopted: false,
      },
      // Массив для временного хранения новых загруженных файлов
      photos_tmp: [],
    };
  },
  created() {
    // Загрузка данных животного при инициализации, если передан animalId
    if (this.animalId) {
      this.fetchAnimalData();
    }
  },
  methods: {

    // Функция для загрузки данных животного с сервера
    async fetchAnimalData() {
      try {
        const response = await api.get(`/animals/${this.animalId}`);
        this.animal = response.data;

        // Add fullPath to photos
        if (this.animal.photos && this.animal.photos.length) {
          this.animal.photos = this.animal.photos.map((photo, index) => ({
            ...photo,
            fullPath: `/assets/img/cats/${this.animal._id}/${photo.filename}`,
            main: index === 0 // первая фотография по умолчанию является "главной"
          }));
        }

        // Убедитесь, что данные фотографий обработаны корректно
        if (!Array.isArray(this.animal.photos)) {
          this.animal.photos = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных животного:", error);
        alert("Не удалось загрузить данные животного.");
      }
    },

    // Функция для обработки загрузки новых фото
    async handlePhotoUpload(event) {
      const files = Array.from(event.target.files);
      const validExtensions = ['image/jpeg', 'image/png'];

      // Валидация формата файлов
      const validFiles = files.filter(file => validExtensions.includes(file.type));
      if (validFiles.length !== files.length) {
        alert("Только файлы формата JPEG и PNG могут быть загружены.");
        return;
      }

      try {
        const formData = new FormData();
        validFiles.forEach(file => {
          formData.append('photos', file);
        });

        const response = await api.post(`/animals/${this.animal._id}/photos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Обновляем массив фотографий
        this.animal.photos = response.data.photos.map((photo, index) => ({
          ...photo,
          fullPath: `/assets/img/cats/${this.animal._id}/${photo.filename}`,
          main: index === 0 && this.animal.photos.length === 0 // устанавливаем как "главную", только если это первая фотография
        }));

        // Очистка поля выбора файлов
        const fileInput = this.$refs['photo-upload'];
        if (fileInput) {
          fileInput.value = null;
        }
      } catch (error) {
        console.error("Ошибка при загрузке фото:", error);
        alert("Ошибка загрузки фото.");
      }
    },


    // Функция для отправки данных животного на сервер (создание или обновление)
    async submitAnimal() {
      try {
        const formData = new FormData();
        for (const [key, value] of Object.entries(this.animal)) {
          if (key !== 'photos') {
            formData.append(key, value);
          }
        }

    // Определение метода и URL в зависимости от наличия animalId
    const method = this.animalId ? 'put' : 'post';
    const url = this.animalId ? `/animals/${this.animalId}` : '/animals';

    // Создание или обновление животного
    const response = await api[method](url, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Получаем ID созданного или обновленного животного
    const animalId = response.data._id || this.animalId;

    // Загрузка фотографий, если они есть
    if (this.photos_tmp.length > 0 && animalId) {
      const uploadFormData = new FormData();
      this.photos_tmp.forEach(file => {
        uploadFormData.append('photos', file);
      });

      const uploadResponse = await api.post(`/animals/${animalId}/photos`, uploadFormData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });

      // Обновление фотографий в данных животного
      this.animal.photos = uploadResponse.data.photos.map((photo, index) => ({
        ...photo,
        fullPath: `/assets/img/cats/${animalId}/${photo.filename}`,
        main: index === 0, // первая фотография по умолчанию является "главной"
      }));

      this.photos_tmp = []; // Очистка временного массива фото
    }

        alert(this.animalId ? "Животное успешно обновлено!" : "Животное успешно добавлено!");
        this.$router.push({ path: '/admin/cats' });
      } catch (error) {
        console.error("Ошибка при сохранении животного:", error);
        alert("Ошибка при сохранении.");
      }
    },

    // Функция для замены существующего фото новым
    async handleReplacePhoto(event, photoId) {
      const newPhoto = event.target.files[0];

      if (!newPhoto) {
        alert("Файл не выбран");
        return;
      }

      this.$nextTick(async () => {
        const formData = new FormData();
        formData.append('_id', this.animal._id);
        formData.append('photoId', photoId);
        formData.append('newPhoto', newPhoto);

        try {
          const response = await api.put(`/animals/${this.animal._id}/replacePhoto`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
          });

          // Обновляем фотографию в списке
          const photoIndex = this.animal.photos.findIndex(p => p._id === photoId);
          if (photoIndex === -1) {
            console.error(`Фотография с ID ${photoId} не найдена`);
            return;
          }

          this.$set(this.animal.photos, photoIndex, response.data.photo);

          alert("Фото успешно заменено!");
          const fileInput = this.$refs[`replace-photo-${photoId}`];
          if (fileInput) {
            fileInput.value = null;
          }
        } catch (error) {
          console.error("Ошибка при замене фото:", error);
          alert("Ошибка при замене фото.");
        }
      });
    },


    // Функция для удаления фото
    // WORKS
    async removePhoto(photoId) {
      try {
        const response = await api.delete(`/photos/${this.animal._id}/${photoId}`);
        if (response.status === 200) {
          this.animal.photos = this.animal.photos.filter(photo => photo._id !== photoId); // Удаляем фото из локального массива
          alert("Фото успешно удалено!");
        } else {
          console.error("Ошибка при удалении фото:", response.status, response.statusText);
          alert("Ошибка при удалении фото.");
        }
      } catch (error) {
        console.error("Ошибка при удалении фото:", error);
        alert("Ошибка при удалении фото.");
      }
    },

    makeMainPhoto(selectedPhoto) {
      this.animal.photos = this.animal.photos.map(photo => ({
        ...photo,
        main: photo._id === selectedPhoto._id // Устанавливаем выбранную фотографию как "главную"
      }));

      // Перемещаем "главную" фотографию на первое место
      this.animal.photos.sort((a, b) => b.main - a.main);
    }
  },
};

</script>

<style scoped>
.animal-form {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.field-group {
  margin-bottom: 1rem;
}

.age-inputs {
  display: flex;
  gap: 10px;
}

button {
  margin-top: 20px;
}

.photo-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.animal-form button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff; /* Белый фон кнопки */
  color: #333; /* Темный текст кнопки */
}

/* Стили для текста внутри кнопок */
.animal-form button span {
  display: inline-block;
  vertical-align: middle;
}
</style>