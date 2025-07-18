<template>
  <div class="novvoylar-container">
    <!-- Sidebar -->
    <Sidebar :menu-items="menuItems" :active-menu="'novvoylar'" :username="username" :user-role="userRole"
      @logout="handleLogout" @navigate="$emit('navigate', $event)" />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">Novvoylar</h1>
        <button @click="showCreateModal = true" class="create-button">
          Novvoy yaratish
        </button>
      </div>

      <!-- Novvoylar Table -->
      <div class="table-container">
        <table class="novvoylar-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Ismi</th>
              <th>Sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(novvoy, index) in novvoylar" :key="novvoy.id">
              <td>{{ index + 1 }}</td>
              <td>{{ novvoy.name }}</td>
              <td>{{ formatDate(novvoy.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="viewNovvoy(novvoy)" class="action-btn view-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button @click="editNovvoy(novvoy)" class="action-btn edit-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button @click="deleteNovvoy(novvoy)" class="action-btn delete-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="novvoylar.length === 0" class="empty-state">
          <p>Hozircha novvoylar yo'q</p>
        </div>
      </div>
    </main>

    <!-- Create Novvoy Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Novvoy yaratish</h2>
          <button style="width: 50px; height: 40px; all: unset; margin: 0; padding: 0" @click="closeModal"
            class="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="red"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="createNovvoy" class="modal-form">
          <div class="group">
            <div class="form-group">
              <label for="novvoyName">Novvoyni nomi</label>
              <input id="novvoyName" type="text" v-model="newNovvoy.name" placeholder="Novvoyni nomini kiriting"
                required />
            </div>

            <div class="form-group">
              <label for="novvoyPassword">Parol</label>
              <input id="novvoyPassword" type="password" v-model="newNovvoy.password"
                placeholder="Novvoy parolini kiriting" required />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-button">
              Chiqish
            </button>
            <button type="submit" :disabled="isCreating" class="submit-button1">
              {{ isCreating ? "Yaratilmoqda..." : "Yaratish" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Layout/Sidebar.vue";

export default {
  name: "Novvoylar",
  components: {
    Sidebar,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      novvoylar: [],
      showCreateModal: false,
      isCreating: false,
      newNovvoy: {
        name: "",
        password: "",
      },
      menuItems: [
        {
          id: "dashboard",
          name: "Dashboard",
          iconPath: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
          view: "dashboard",
        },
        {
          id: "managers",
          name: "Managerlar",
          iconPath: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
          view: "managers",
          adminOnly: true,
        },
        {
          id: "novvoylar",
          name: "Novvoylar",
          iconPath:
            "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
          view: "novvoylar",
        },
        {
          id: "yetkazuvchilar",
          name: "Yetkazuvchilar",
          iconPath:
            "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
          view: "yetkazuvchilar",
        },
        {
          id: "dokonlar",
          name: "Dokonlar",
          iconPath:
            "M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22ZM20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22ZM1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6",
          view: "dokonlar",
        },
        {
          id: 'omborxona',
          name: 'Omborxona',
          iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z M3 7l9-4 9 4',
          view: 'omborxona'
        },
        {
          id: 'chiqimlar',
          name: 'Chiqimlar',
          iconPath: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M12.5 7a4 4 0 11-8 0 4 4 0 018 0z M16 11l2 2 4-4',
          view: 'chiqimlar'
        },
        {
          id: 'non-turlari',
          name: 'Non turlari',
          iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
          view: 'non-turlari'
        }
      ],
    };
  },
  mounted() {
    this.loadNovvoylar();
  },
  methods: {
    loadNovvoylar() {
      this.novvoylar = JSON.parse(localStorage.getItem("novvoylar") || "[]");
    },
    async createNovvoy() {
      this.isCreating = true;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newNovvoy = {
        id: Date.now().toString(),
        name: this.newNovvoy.name,
        username: this.newNovvoy.name.toLowerCase().replace(/\s+/g, ""),
        password: this.newNovvoy.password,
        createdAt: new Date().toISOString(),
      };

      this.novvoylar.push(newNovvoy);
      localStorage.setItem("novvoylar", JSON.stringify(this.novvoylar));

      this.$emit("show-notification", {
        message: "Novvoy muvaffaqiyatli yaratildi!",
        type: "success",
      });

      this.closeModal();
      this.isCreating = false;
    },
    viewNovvoy(novvoy) {
      alert(
        `Novvoy: ${novvoy.name}\nLogin: ${novvoy.username
        }\nYaratilgan: ${this.formatDate(novvoy.createdAt)}`
      );
    },
    editNovvoy(novvoy) {
      const newName = prompt("Yangi nom:", novvoy.name);
      if (newName && newName.trim()) {
        novvoy.name = newName.trim();
        novvoy.username = newName.toLowerCase().replace(/\s+/g, "");
        localStorage.setItem("novvoylar", JSON.stringify(this.novvoylar));

        this.$emit("show-notification", {
          message: "Novvoy ma'lumotlari yangilandi!",
          type: "success",
        });
      }
    },
    deleteNovvoy(novvoy) {
      if (confirm(`${novvoy.name} novvoyni o'chirishni xohlaysizmi?`)) {
        this.novvoylar = this.novvoylar.filter((n) => n.id !== novvoy.id);
        localStorage.setItem("novvoylar", JSON.stringify(this.novvoylar));

        this.$emit("show-notification", {
          message: "Novvoy o'chirildi!",
          type: "success",
        });
      }
    },
    closeModal() {
      this.showCreateModal = false;
      this.newNovvoy = { name: "", password: "" };
    },
    handleLogout() {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");
      localStorage.removeItem("managerId");
      this.$emit("logout");
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("uz-UZ");
    },
  },
};
</script>

<style scoped>
.novvoylar-container {
  display: flex;
  min-height: 100vh;
  background-color: white;
}

.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #1e293b;
}

.create-button {
  background-color: #6366f1;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #5b21b6;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.novvoylar-table {
  width: 100%;
  border-collapse: collapse;
}

.novvoylar-table th {
  background-color: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.novvoylar-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.novvoylar-table tr:last-child td {
  border-bottom: none;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.view-btn {
  background-color: #3b82f6;
  color: white;
}

.view-btn:hover {
  background-color: #2563eb;
}

.edit-btn {
  background-color: #10b981;
  color: white;
}

.edit-btn:hover {
  background-color: #059669;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #64748b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 1450px;
  height: 100%;
  border-radius: 30px 0 0 30px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.6s ease-out;
  overflow-y: auto;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 80px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 30px;
  font-weight: 600;
  color: #1e293b;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s;
}

.close-button:hover {
  color: #1e293b;
}

.modal-form {
  padding: 80px;
}

.group {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  gap: 50px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 650px;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 30px;
  margin-top: 100px;
}

.modal-actions button {
  width: 200px;
  height: 50px;
}

.cancel-button {
  padding: 12px 24px;
  border: 1px solid #ff0000;
  background: rgb(255, 71, 71);
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 16px;
}

.cancel-button:hover {
  background-color: #ff2020;
}

.submit-button1 {
  padding: 12px 24px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  font-size: 15px;
}

.submit-button1:hover:not(:disabled) {
  background-color: #303af5;
}

.submit-button1:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .novvoylar-container {
    flex-direction: column;
  }

  .main-content {
    padding: 16px;
  }

  .content-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .novvoylar-table {
    font-size: 14px;
  }

  .novvoylar-table th,
  .novvoylar-table td {
    padding: 12px 8px;
  }
}
</style>