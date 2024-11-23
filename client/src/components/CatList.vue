<template>
  <div class="cat-list center">
    <h2>Список животных</h2>

    <!-- Ссылка на добавление нового животного -->
    <a @click.prevent="addNewAnimal">Добавить животное</a>

    <!-- Индикация загрузки -->
    <div v-if="loading">Загрузка...</div>

    <!-- Список животных -->
    <div v-else>
      <AnimalCard
          v-for="animal in animals"
          :key="animal._id"
          :animal="animal"
          @animalDeleted="fetchCats"
      />
    </div>
  </div>
</template>

<script>
import AnimalCard from './СatCard_Full.vue';
import api from '@/services/api'; // Импорт API

export default {
  components: { AnimalCard },
  data() {
    return {
      animals: [], // Список животных
      loading: true, // Состояние загрузки
    };
  },
  created() {
    this.fetchCats(); // Загрузка животных при создании компонента
  },
  watch: {
    // Перезагрузка данных при смене маршрута
    $route() {
      this.fetchCats();
    }
  },
  methods: {
    // Загрузка данных животных с сервера
    async fetchCats() {
      this.loading = true;
      try {
        const response = await api.get('/animals');
        this.animals = response.data.map(animal => ({
          ...animal,
          photos: animal.photos.map(photo => ({
            ...photo,
            fullPath: `/assets/img/cats/${animal._id}/${photo.filename}`
          }))
        }));
      } catch (error) {
        console.error("Ошибка при загрузке животных:", error);
        alert("Не удалось загрузить список животных. Попробуйте позже.");
      } finally {
        this.loading = false;
      }
    },

    // Метод для создания нового животного
    async addNewAnimal() {
      try {
        const currentDate = new Date().toISOString().split('T')[0]; // Сегодняшняя дата в формате YYYY-MM-DD
        const newAnimalData = {
          admissionDate: currentDate,
          name: "",
          ageYears: 0,
          ageMonths: 0,
          gender: "Мужской", // Значение по умолчанию
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
        };

        this.loading = true;

        const response = await api.post('/animals', newAnimalData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const createdAnimalId = response.data._id;

        // Перенаправление на форму редактирования нового животного
        this.$router.push({ name: 'EditAnimal', params: { id: createdAnimalId } });
      } catch (error) {
        console.error("Ошибка при создании нового животного:", error);
        alert("Не удалось создать новое животное. Попробуйте позже.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>