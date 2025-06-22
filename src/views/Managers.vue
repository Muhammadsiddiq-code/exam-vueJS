<template>
    <div class="main-layout">
      <Sidebar />
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">Boshqaruvchilar</h1>
          <button class="btn btn-primary" @click="openCreateModal">
            <PlusIcon />
            Manager yaratish
          </button>
        </div>
  
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Ismi</th>
                <th>Sana</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(manager, index) in managers" :key="manager.id">
                <td>{{ index + 1 }}</td>
                <td>{{ manager.name }}</td>
                <td>{{ formatDate(manager.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewManager(manager)" title="Ko'rish">
                      <EyeIcon />
                    </button>
                    <button class="action-btn edit" @click="editManager(manager)" title="Tahrirlash">
                      <EditIcon />
                    </button>
                    <button class="action-btn delete" @click="deleteManager(manager)" title="O'chirish">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div v-if="managers.length === 0" class="empty-state">
            <h3>Hozircha managerlar mavjud emas</h3>
            <p>Yangi manager qo'shish uchun yuqoridagi tugmani bosing</p>
            <button class="btn btn-primary" @click="openCreateModal">
              <PlusIcon />
              Manager yaratish
            </button>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Manager Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ isEditing ? 'Manager tahrirlash' : 'Manager yaratish' }}
            </h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          
          <form @submit.prevent="saveManager">
            <div class="form-group">
              <label class="form-label">Manager nomi</label>
              <input 
                type="text" 
                class="form-input" 
                v-model="currentManager.name"
                placeholder="Manager nomini kiriting"
                required
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">Telefon raqami</label>
              <input 
                type="tel" 
                class="form-input" 
                v-model="currentManager.phone"
                placeholder="+998 90 123 45 67"
                required
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                class="form-input" 
                v-model="currentManager.email"
                placeholder="manager@example.com"
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">Parol</label>
              <input 
                type="password" 
                class="form-input" 
                v-model="currentManager.password"
                :placeholder="isEditing ? 'Yangi parol (bo\'sh qoldiring agar o\'zgartirmasangiz)' : 'Parolni kiriting'"
                :required="!isEditing"
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">Lavozimi</label>
              <select class="form-select" v-model="currentManager.position" required>
                <option value="">Lavozimni tanlang</option>
                <option value="senior">Senior Manager</option>
                <option value="junior">Junior Manager</option>
                <option value="assistant">Assistant Manager</option>
              </select>
            </div>
  
            <div class="form-group">
              <label class="form-label">Manzil</label>
              <textarea 
                class="form-textarea" 
                v-model="currentManager.address"
                placeholder="Manager manzilini kiriting"
              ></textarea>
            </div>
  
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Bekor qilish
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Saqlanmoqda...' : (isEditing ? 'Yangilash' : 'Yaratish') }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- View Manager Modal -->
      <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Manager ma'lumotlari</h3>
            <button class="close-btn" @click="closeViewModal">&times;</button>
          </div>
          
          <div class="manager-details">
            <div class="detail-item">
              <strong>Ismi:</strong> {{ viewingManager.name }}
            </div>
            <div class="detail-item">
              <strong>Telefon:</strong> {{ viewingManager.phone }}
            </div>
            <div class="detail-item">
              <strong>Email:</strong> {{ viewingManager.email }}
            </div>
            <div class="detail-item">
              <strong>Lavozimi:</strong> {{ getPositionName(viewingManager.position) }}
            </div>
            <div class="detail-item">
              <strong>Manzil:</strong> {{ viewingManager.address }}
            </div>
            <div class="detail-item">
              <strong>Yaratilgan sana:</strong> {{ formatDate(viewingManager.createdAt) }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Manager o'chirish</h3>
            <button class="close-btn" @click="closeDeleteModal">&times;</button>
          </div>
          
          <p>Haqiqatan ham <strong>{{ deletingManager.name }}</strong> nomli managerni o'chirmoqchimisiz?</p>
          <p style="color: #ef4444; margin-top: 12px;">Bu amal qaytarib bo'lmaydi!</p>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
              Bekor qilish
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="loading">
              {{ loading ? 'O\'chirilmoqda...' : 'O\'chirish' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Toast Notification -->
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Layout/Sidebar.vue'
  import { PlusIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-vue-next'
  
  export default {
    name: 'Managers',
    components: {
      Sidebar,
      PlusIcon,
      EyeIcon,
      EditIcon,
      TrashIcon
    },
    data() {
      return {
        managers: [
          {
            id: 1,
            name: 'Azamjon',
            phone: '+998 90 123 45 67',
            email: 'azamjon@example.com',
            position: 'senior',
            address: 'Toshkent shahar, Yunusobod tumani',
            createdAt: '2025-06-20'
          }
        ],
        showModal: false,
        showViewModal: false,
        showDeleteModal: false,
        isEditing: false,
        loading: false,
        currentManager: {
          name: '',
          phone: '',
          email: '',
          password: '',
          position: '',
          address: ''
        },
        viewingManager: {},
        deletingManager: {},
        toast: {
          show: false,
          type: 'success',
          message: ''
        }
      }
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('uz-UZ')
      },
      getPositionName(position) {
        const positions = {
          senior: 'Senior Manager',
          junior: 'Junior Manager',
          assistant: 'Assistant Manager'
        }
        return positions[position] || position
      },
      openCreateModal() {
        this.isEditing = false
        this.currentManager = {
          name: '',
          phone: '',
          email: '',
          password: '',
          position: '',
          address: ''
        }
        this.showModal = true
      },
      editManager(manager) {
        this.isEditing = true
        this.currentManager = { ...manager, password: '' }
        this.showModal = true
      },
      viewManager(manager) {
        this.viewingManager = manager
        this.showViewModal = true
      },
      deleteManager(manager) {
        this.deletingManager = manager
        this.showDeleteModal = true
      },
      closeModal() {
        this.showModal = false
      },
      closeViewModal() {
        this.showViewModal = false
      },
      closeDeleteModal() {
        this.showDeleteModal = false
      },
      async saveManager() {
        this.loading = true
        
        try {
          if (this.isEditing) {
            // Update existing manager
            const index = this.managers.findIndex(m => m.id === this.currentManager.id)
            if (index !== -1) {
              this.managers[index] = { ...this.currentManager }
            }
            this.showToast('Manager muvaffaqiyatli yangilandi', 'success')
          } else {
            // Create new manager
            const newManager = {
              ...this.currentManager,
              id: Date.now(),
              createdAt: new Date().toISOString().split('T')[0]
            }
            this.managers.push(newManager)
            this.showToast('Manager muvaffaqiyatli yaratildi', 'success')
          }
          
          this.closeModal()
        } catch (error) {
          this.showToast('Xatolik yuz berdi', 'error')
        } finally {
          this.loading = false
        }
      },
      async confirmDelete() {
        this.loading = true
        
        try {
          this.managers = this.managers.filter(m => m.id !== this.deletingManager.id)
          this.showToast('Manager muvaffaqiyatli o\'chirildi', 'success')
          this.closeDeleteModal()
        } catch (error) {
          this.showToast('Xatolik yuz berdi', 'error')
        } finally {
          this.loading = false
        }
      },
      showToast(message, type = 'success') {
        this.toast = { show: true, message, type }
        setTimeout(() => {
          this.toast.show = false
        }, 3000)
      }
    }
  }
  </script>
  
  <style scoped>
  .manager-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .detail-item {
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 8px;
    border-left: 4px solid #6366f1;
  }
  
  .detail-item strong {
    color: #374151;
    margin-right: 8px;
  }
  </style>
  