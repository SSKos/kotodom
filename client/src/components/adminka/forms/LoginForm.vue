<template>
  <div class="login">
    <div class="login-img">
      <img src="@/assets/img/design-elements/cat-head.png" alt="Картинка котика">
    </div>
    <div class="login-form_box">
      <div class="login-form">
        <h2>Авторизуйтесь для внесения изменений</h2>
<!--        <form class="login-fields_box" @submit.prevent="handleLogin">-->
          <form class="login-fields_box" @submit.prevent="login">

          <div class="field-group">
<!--            <label for="email">Email</label>-->
            <input type="email" id="email" v-model="email" placeholder="Введите ваш email" autocomplete="username" required/>
          </div>

          <div class="field-group">
<!--            <label for="password">Пароль</label>-->
            <input type="password" id="password" v-model="password" placeholder="Введите ваш пароль" autocomplete="current-password" required/>
          </div>

          <button class="def-button"
                  type="submit"
                  :disabled="!isFormValid"
          >Войти</button>
        </form>
        <div class="login-form mt_big">
          <router-link class="def-link" to="/home">Перейти на главную страницу</router-link>
          <a class="def-link" href="https://t.me/@Viridovix" target="_blank" rel="noopener noreferrer">
            Связаться с владельцем сайта через Telegram
          </a>
        </div>
      </div>

    </div>
  </div>
  <div class="name"></div>

</template>


<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  computed: {
    isFormValid() {
      return this.email.trim() !== '' && this.password.trim() !== '';
    },
  },
  methods: {
    async login() {
      if (!this.isFormValid) return;
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        if (!response.ok) {
          throw new Error('Ошибка при входе. Проверьте данные.');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('Login successful, redirecting to admin page...');
        this.$router.push('/admin/cats');
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>