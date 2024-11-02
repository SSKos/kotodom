<template>
  <form @submit.prevent="submitAnimal">
    <input v-model="animal.name" placeholder="Имя животного" required />
    <input v-model="animal.admissionDate" type="date" required />
    <input v-model="animal.age" placeholder="Возраст (лет и месяцев)" required />

    <label>
      <input type="radio" v-model="animal.gender" value="Мужской" /> Мужской
    </label>
    <label>
      <input type="radio" v-model="animal.gender" value="Женский" /> Женский
    </label>

    <label>
      <input type="checkbox" v-model="animal.urgentHelp" /> Срочно нужна помощь
    </label>

    <!-- Условное отображение поля для описания срочной помощи -->
    <div v-if="animal.urgentHelp">
      <input v-model="animal.urgentHelpDescription" placeholder="Описание срочной помощи" />
    </div>

    <label>Фотографии:</label>
    <input type="file" multiple @change="handleFiles($event, 'photos')" accept="image/*" />

    <label>Видео:</label>
    <input type="file" multiple @change="handleFiles($event, 'videos')" accept="video/*" />

    <button type="submit">Добавить животное</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      animal: {
        name: '',
        admissionDate: '',
        age: '',
        gender: '',
        urgentHelp: false,  // Флаг для срочной помощи
        urgentHelpDescription: '',  // Описание срочной помощи
        photos: [],  // Поле для фотографий
        videos: [],  // Поле для видео
      },
    };
  },
  methods: {
    handleFiles(event, type) {
      const files = Array.from(event.target.files);
      if (type === 'photos') {
        this.animal.photos = files;
      } else if (type === 'videos') {
        this.animal.videos = files;
      }
    },
    async submitAnimal() {
      const formData = new FormData();
      formData.append('name', this.animal.name);
      formData.append('admissionDate', this.animal.admissionDate);
      formData.append('age', this.animal.age);
      formData.append('gender', this.animal.gender);
      formData.append('urgentHelp', this.animal.urgentHelp);

      if (this.animal.urgentHelp) {
        formData.append('urgentHelpDescription', this.animal.urgentHelpDescription);
      }

      // Добавление фотографий
      this.animal.photos.forEach((photo, index) => {
        formData.append('photos', photo);
      });

      // Добавление видео
      this.animal.videos.forEach((video, index) => {
        formData.append('videos', video);
      });

      const response = await fetch('/api/animals', {
        method: 'POST',
        body: formData, // Отправка с использованием FormData для поддержки файлов
      });

      if (response.ok) {
        alert('Животное добавлено!');
      } else {
        alert('Ошибка при добавлении животного');
      }
    },
  },
};
</script>