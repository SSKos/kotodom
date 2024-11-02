<!-- client/src/components/UserList.vue -->
<template>
  <div>
    <h2>Список пользователей</h2>
    <table>
      <thead>
      <tr>
        <th>Логин</th>
        <th>Email</th>
        <th>Роль</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: []
    };
  },
  async created() {
    // Запрос для получения списка пользователей из API
    const response = await fetch('/api/users');
    this.users = await response.json();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
}
th {
  background-color: #f4f4f4;
}
</style>