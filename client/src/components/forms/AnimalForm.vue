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
      },
    };
  },
  methods: {
    async submitAnimal() {
      await fetch('/api/animals', {  // Убедись, что порт правильный
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.animal),
      });
      alert('Животное добавлено!');
    },
  },
};
</script>