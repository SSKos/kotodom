<template>
  <form @submit.prevent="submitContent">
    <input v-model="content.title" placeholder="Заголовок" required />
    <textarea v-model="content.text" placeholder="Текст" required></textarea>
    <button type="submit">Добавить контент</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      content: {
        title: '',
        text: '',
      },
    };
  },
  methods: {
    async submitContent() {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.content),
      });
      alert('Контент добавлен!');
    },
  },
};
</script>