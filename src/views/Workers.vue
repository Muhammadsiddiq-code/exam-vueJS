<template>
    <div class="main-layout">
      <Sidebar />
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">Nonvoylar</h1>
          <button class="btn btn-primary" @click="openCreateModal">
            <PlusIcon />
            Nonvoy qo'shish
          </button>
        </div>
  
        <!-- Search and Filter -->
        <div class="search-section">
          <div class="search-box">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Nonvoy qidirish..." 
              v-model="searchQuery"
              class="search-input"
            />
          </div>
          <select class="form-select" v-model="filterStatus">
            <option value="">Barcha holat</option>
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
        </div>
  
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Ismi</th>
                <th>Telefon</th>
                <th>Manzil</th>
                <th>Holati</th>
                <th>Ish boshlagan sana</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(worker, index) in filteredWorkers" :key="worker.id">
                <td>{{ index + 1 }}</td>
                <td>{{ worker.name }}</td>
                <td>{{ worker.phone }}</td>
                <td>{{ worker.address }}</td>
                <td>
                  <span :class="['status-badge', worker.status]">
                    {{ worker.status === 'active' ? 'Faol' : 'Nofaol' }}
                  </span>
                </td>
                <td>{{ formatDate(worker.startDate) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewWorker(worker)" title="Ko'rish">
                      <EyeIcon />
                    </button>
                    <button class="action-btn edit" @click="editWorker(worker)" title="Tahrirlash">
                      <EditIcon />
                    </button>
                    <button class="action-btn delete" @click="deleteWorker(worker)" title="O'chirish">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div v-if="filteredWorkers.length === 0" class="empty-state">
            <h3>Nonvoylar topilmadi</h3>
            <p>Yangi nonvoy qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        </div>
      </div>
  
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ isEditing ? 'Nonvoy tahrirlash' : 'Nonvoy qo\'shish' }}
            </h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          
          <form @submit.prevent="saveWorker">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Ismi</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentWorker.name"
                  placeholder="Nonvoy ismini kiriting"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Telefon raqami</label>
                <input 
                  type="tel" 
                  class="form-input" 
                  v-model="currentWorker.phone"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Passport seriya va raqami</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentWorker.passport"
                  placeholder="AA 1234567"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Tug'ilgan sana</label>
                <input 
                  type="date" 
                  class="form-input" 
                  v-model="currentWorker.birthDate"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Ish boshlagan sana</label>
                <input 
                  type="date" 
                  class="form-input" 
                  v-model="currentWorker.startDate"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Oylik maosh</label>
                <input 
                  type="number" 
                  class="form-input" 
                  v-model="currentWorker.salary"
                  placeholder="0"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Holati</label>
                <select class="form-select" v-model="currentWorker.status" required>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>
  
              <div class="form-group">
                <label class="form-label">Lavozimi</label>
                <select class="form-select" v-model="currentWorker.position" required>
                  <option value="">Lavozimni tanlang</option>
                  <option value="baker">Nonvoy</option>
                  <option value="assistant">Yordamchi</option>
                  <option value="supervisor">Nazoratchi</option>
                </select>
              </div>
            </div>
  
            <div class="form-group">
              <label class="form-label">Manzil</label>
              <textarea 
                class="form-textarea" 
                v-model="currentWorker.address"
                placeholder="To'liq manzilni kiriting"
                required
              ></textarea>
            </div>
  
            <div class="form-group">
              <label class="form-label">Qo'shimcha ma'lumot</label>
              <textarea 
                class="form-textarea" 
                v-model="currentWorker.notes"
                placeholder="Qo'shimcha ma'lumotlar..."
              ></textarea>
            </div>
  
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Bekor qilish
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Saqlanmoqda...' : (isEditing ? 'Yangilash' : 'Qo\'shish') }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Layout/Sidebar.vue'
  import { PlusIcon, EyeIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-vue-next'
  
  export default {
    name: 'Workers',
    components: {
      Sidebar,
      PlusIcon,
      EyeIcon,
      EditIcon,
      TrashIcon,
      SearchIcon
    },
    data() {
      return {
        searchQuery: '',
        filterStatus: '',
        workers: [
          {
            id: 1,
            name: 'Bobur Karimov',
            phone: '+998 90 123 45 67',
            passport: 'AA 1234567',
            birthDate: '1990-05-15',
            startDate: '2024-01-15',
            salary: 3000000,
            status: 'active',
            position: 'baker',
            address: 'Toshkent shahar, Chilonzor tumani, 5-kvartal',
            notes: 'Tajribali nonvoy'
          },
          {
            id: 2,
            name: 'Sardor Umarov',
            phone: '+998 91 234 56 78',
            passport: 'AB 2345678',
            birthDate: '1985-08-22',
            startDate: '2023-11-10',
            salary: 2500000,
            status: 'active',
            position: 'assistant',
            address: 'Toshkent shahar, Yashnobod tumani, 12-kvartal',
            notes: 'Yaxshi yordamchi'
          }
        ],
        showModal: false,
        isEditing: false,
        loading: false,
        currentWorker: {
          name: '',
          phone: '',
          passport: '',
          birthDate: '',
          startDate: '',
          salary: '',
          status: 'active',
          position: '',
          address: '',
          notes: ''
        },
        toast: {
          show: false,
          type: 'success',
          message: ''
        }
      }
    },
    computed: {
      filteredWorkers() {
        let filtered = this.workers
  
        if (this.searchQuery) {
          filtered = filtered.filter(worker => 
            worker.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            worker.phone.includes(this.searchQuery)
          )
        }
  
        if (this.filterStatus) {
          filtered = filtered.filter(worker => worker.status === this.filterStatus)
        }
  
        return filtered
      }
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('uz-UZ')
      },
      formatSalary(salary) {
        return new Intl.NumberFormat('uz-UZ').format(salary) + ' so\'m'
      },
      openCreateModal() {
        this.isEditing = false
        this.currentWorker = {
          name: '',
          phone: '',
          passport: '',
          birthDate: '',
          startDate: '',
          salary: '',
          status: 'active',
          position: '',
          address: '',
          notes: ''
        }
        this.showModal = true
      },
      editWorker(worker) {
        this.isEditing = true
        this.currentWorker = { ...worker }
        this.showModal = true
      },
      viewWorker(worker) {
        console.log('View worker:', worker)
      },
      deleteWorker(worker) {
        if (confirm(`Haqiqatan ham ${worker.name} nomli nonvoyni o'chirmoqchimisiz?`)) {
          this.workers = this.workers.filter(w => w.id !== worker.id)
          this.showToast('Nonvoy muvaffaqiyatli o\'chirildi', 'success')
        }
      },
      closeModal() {
        this.showModal = false
      },
      async saveWorker() {
        this.loading = true
        
        try {
          if (this.isEditing) {
            const index = this.workers.findIndex(w => w.id === this.currentWorker.id)
            if (index !== -1) {
              this.workers[index] = { ...this.currentWorker }
            }
            this.showToast('Nonvoy muvaffaqiyatli yangilandi', 'success')
          } else {
            const newWorker = {
              ...this.currentWorker,
              id: Date.now()
            }
            this.workers.push(newWorker)
            this.showToast('Nonvoy muvaffaqiyatli qo\'shildi', 'success')
          }
          
          this.closeModal()
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
  .search-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    align-items: center;
  }
  
  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
  }
  
  .search-box svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    width: 20px;
    height: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .status-badge.active {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .status-badge.inactive {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .search-section {
      flex-direction: column;
      align-items: stretch;
    }
  }
  </style>
  