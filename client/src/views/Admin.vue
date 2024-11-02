<template>
  <div>
    <!-- Проверка аутентификации -->
    <div v-if="!isAuthenticated">
      <LoginForm @login="handleLogin" />
    </div>

    <!-- Панель администратора, доступная после входа -->
    <div v-else>
      <nav>
        <button @click="currentComponent = 'AnimalForm'">Добавить кота</button>
        <button @click="currentComponent = 'ArticleForm'">Добавить статью</button>
        <button @click="currentComponent = 'ContentForm'">Добавить материал</button>
        <button @click="currentComponent = 'CatList'">Посмотреть всех котиков</button>
        <button @click="currentComponent = 'UserList'">Список пользователей</button>
      </nav>

      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/adminka/forms/LoginForm.vue';
import AnimalForm from '@/components/adminka/forms/AnimalForm.vue';
import ArticleForm from '@/components/adminka/forms/ArticleForm.vue';
import ContentForm from '@/components/adminka/forms/ContentForm.vue';
import CatList from '@/components/adminka/CatList.vue'; // Страница списка котов
import UserList from '@/components/adminka/UserList.vue'; // Страница списка пользователей

export default {
  components: {
    LoginForm,
    AnimalForm,
    ArticleForm,
    ContentForm,
    CatList,
    UserList
  },
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'), // Инициализация из localStorage
      currentComponent: 'AnimalForm',  // Компонент, который будет отображаться по умолчанию
    };
  },
  methods: {
    handleLogin(success) {
      if (success) {
        this.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true'); // Сохранение состояния
      }
    },
  },
  watch: {
    // Следите за изменениями аутентификации, чтобы обновить localStorage
    isAuthenticated(newValue) {
      if (!newValue) {
        localStorage.removeItem('isAuthenticated');
      }
    }
  }
};
</script>

<style scoped>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px;
  cursor: pointer;
}
</style>