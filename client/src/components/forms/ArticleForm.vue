<template>
  <form @submit.prevent="submitArticle">
    <input v-model="article.title" placeholder="Заголовок" required />
    <textarea v-model="article.text" placeholder="Текст" required></textarea>
    <button type="submit">Добавить статью</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      article: {
        title: '',
        text: '',
      },
    };
  },
  methods: {
    async submitArticle() {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.article),
      });
      alert('Статья добавлена!');
    },
  },
};
</script>