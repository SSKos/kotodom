<template>
  <div class="animal-card" v-if="animal">
    <h2>{{ animal.name }}</h2>
    <p><strong>Дата поступления:</strong> {{ animal.admissionDate }}</p>
    <p><strong>Возраст:</strong> {{ animal.ageYears }} лет {{ animal.ageMonths }} месяцев</p>
    <p><strong>Гендер:</strong> {{ animal.gender }}</p>
    <p><strong>Описание:</strong> {{ animal.description }}</p>
    <p><strong>Нуждается в лечении:</strong> {{ animal.requiresTreatment ? 'Да' : 'Нет' }}</p>
    <p v-if="animal.requiresTreatment"><strong>Описание лечения:</strong> {{ animal.treatmentDescription }}</p>
    <p><strong>Стерилизован:</strong> {{ animal.sterilized ? 'Да' : 'Нет' }}</p>
    <p><strong>Срочно нужна помощь:</strong> {{ animal.urgentHelp ? 'Да' : 'Нет' }}</p>
    <p v-if="animal.urgentHelp"><strong>Описание срочной помощи:</strong> {{ animal.urgentHelpDescription }}</p>
    <p><strong>Особенности корма:</strong> {{ animal.diet }}</p>
    <p><strong>Публиковать:</strong> {{ animal.publish ? 'Да' : 'Нет' }}</p>

    <!-- Display Photos -->
    <div v-if="animal.photos && animal.photos.length">
      <h3>Фотографии</h3>
      <div v-for="(photo, index) in animal.photos" :key="photo._id" class="photo-item">
        <img :src="photo.fullPath" alt="Фото" width="100"/>
      </div>
    </div>


    <!-- Action Buttons -->
    <div class="action-buttons">
      <router-link :to="{ name: 'EditAnimal', params: { id: animal._id } }">Редактировать</router-link>
      <button @click="confirmDelete" class="delete-button">Удалить</button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    animal: {
      type: Object,
      required: true
    },
  },
  // computed: {
  //   validPhotos() {
  //     if (!this.animal || !this.animal._id || !Array.isArray(this.animal.photos)) {
  //       return [];
  //     }
  //
  //     return this.animal.photos.filter(photo => {
  //       const photoPath = `/assets/img/cats/${this.animal._id}/${photo.filename}`;
  //
  //       // Check if image exists to prevent 404 error
  //       const img = new Image();
  //       img.src = photoPath;
  //       return img.complete && img.naturalWidth !== 0; // Check for valid image
  //     });
  //   }
  // },
  methods: {
    //   validPhotos() {
    //     if (!this.animal || !this.animal._id || !Array.isArray(this.animal.photos)) {
    //       return [];
    //     }
    //
    //     return this.animal.photos.filter(photo => {
    //       const photoPath = `/assets/img/cats/${this.animal._id}/${photo.filename}`;
    //
    //       // Check if image exists to prevent 404 error
    //       const img = new Image();
    //       img.src = photoPath;
    //       return img.complete && img.naturalWidth !== 0; // Check for valid image
    //     });
    //   }
    // },

    confirmDelete() {
      if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        this.deleteAnimal();
      }
    },

    async deleteAnimal() {
      try {
        const response = await fetch(`/api/animals/${this.animal._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Запись успешно удалена');
          this.$emit('animalDeleted'); // Notify parent component to refresh
        } else {
          console.error(`Ошибка при удалении животного: ${response.statusText}`);
          alert(`Ошибка при удалении животного: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Ошибка при удалении животного:', error);
        alert('Ошибка при удалении записи. Проверьте консоль для деталей.');
      }
    },
  },
};
</script>

<style scoped>
.animal-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

.photos, .videos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.animal-photo, .animal-video {
  max-width: 150px;
  height: auto;
  border-radius: 5px;
}

.animal-video {
  width: 150px;
  height: 100px;
}

.action-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

button.delete-button {
  background-color: #ff4d4d;
  color: white;
}

button.delete-button:hover {
  background-color: #ff3333;
}
</style>