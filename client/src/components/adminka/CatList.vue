<!-- client/src/components/CatList.vue -->
<template>
  <div>
    <h2>Список котиков</h2>
    <ul>
      <li v-for="cat in cats" :key="cat.id">{{ cat.name }} - {{ cat.age }} лет</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cats: []
    };
  },
  async created() {
    // Запрос для получения списка котов из API
    const response = await fetch('/api/cats');
    this.cats = await response.json();
  }
};
</script>