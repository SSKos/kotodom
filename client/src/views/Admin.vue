<template>
  <div>
    <h1>Админ-панель</h1>
    <nav>
      <button @click="activeForm = 'animal'">Добавить животное</button>
      <button @click="activeForm = 'article'">Статьи</button>
      <button @click="activeForm = 'content'">Контент</button>
      <button @click="activeForm = 'pets'">Наши питомцы</button>  <!-- Новый раздел -->
    </nav>

    <div v-if="activeForm === 'animal'">
      <AnimalForm />
    </div>
    <div v-if="activeForm === 'article'">
      <ArticleForm />
    </div>
    <div v-if="activeForm === 'content'">
      <ContentForm />
    </div>
    <div v-if="activeForm === 'pets'">  <!-- Секция для отображения питомцев -->
      <h2>Наши питомцы</h2>
      <ul>
        <li v-for="pet in pets" :key="pet._id">
          <p><strong>Имя:</strong> {{ pet.name }}</p>
          <p><strong>Возраст:</strong> {{ pet.age }}</p>
          <p><strong>Гендер:</strong> {{ pet.gender }}</p>
          <p><strong>Описание:</strong> {{ pet.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AnimalForm from '../components/forms/AnimalForm.vue';
import ArticleForm from '../components/forms/ArticleForm.vue';
import ContentForm from '../components/forms/ContentForm.vue';

export default {
  data() {
    return {
      activeForm: 'animal',
      pets: [],  // Массив для хранения данных о питомцах
    };
  },
  components: {
    AnimalForm,
    ArticleForm,
    ContentForm,
  },
  methods: {
    async fetchPets() {
      try {
        const response = await fetch('/api/animals');
        this.pets = await response.json();
      } catch (error) {
        console.error('Ошибка при получении данных о животных:', error);
      }
    },
  },
  watch: {
    activeForm(newVal) {
      if (newVal === 'pets') {
        this.fetchPets();  // Вызываем метод для загрузки данных при переходе на раздел "Наши питомцы"
      }
    },
  },
};
</script>

<style scoped>
/* Стили для нового раздела */
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
</style>