<template>
  <div class="login-container">
    <form @submit.prevent="login">
      <h2>Вход в админку</h2>
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">Войти</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
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
  methods: {
    async login() {
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
        this.$router.push('/admin');
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #ff0000;
  text-align: center;
  margin-top: 10px;
}
</style>