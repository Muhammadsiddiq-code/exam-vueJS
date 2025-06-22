<template>
    <div class="main-layout">
      <Sidebar />
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">Do'konlar</h1>
          <button class="btn btn-primary" @click="openCreateModal">
            <PlusIcon />
            Do'kon qo'shish
          </button>
        </div>
  
        <!-- Stats Cards -->
        <div class="stats-grid" style="margin-bottom: 32px;">
          <div class="stat-card">
            <div class="stat-icon">
              <StoreIcon />
            </div>
            <div class="stat-content">
              <h3>Jami do'konlar</h3>
              <div class="stat-value">{{ stores.length }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <CheckCircleIcon />
            </div>
            <div class="stat-content">
              <h3>Faol do'konlar</h3>
              <div class="stat-value">{{ activeStores }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <DollarSignIcon />
            </div>
            <div class="stat-content">
              <h3>Bugungi savdo</h3>
              <div class="stat-value">{{ formatNumber(todaySales) }}</div>
            </div>
          </div>
        </div>
  
        <!-- Search and Filter -->
        <div class="search-section">
          <div class="search-box">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Do'kon qidirish..." 
              v-model="searchQuery"
              class="search-input"
            />
          </div>
          <select class="form-select" v-model="filterStatus">
            <option value="">Barcha holat</option>
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
          <select class="form-select" v-model="filterType">
            <option value="">Barcha turlar</option>
            <option value="supermarket">Supermarket</option>
            <option value="minimarket">Minimarket</option>
            <option value="bakery">Nonvoyxona</option>
          </select>
        </div>
  
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Do'kon nomi</th>
                <th>Manzil</th>
                <th>Telefon</th>
                <th>Turi</th>
                <th>Holati</th>
                <th>Bugungi savdo</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(store, index) in filteredStores" :key="store.id">
                <td>{{ index + 1 }}</td>
                <td>{{ store.name }}</td>
                <td>{{ store.address }}</td>
                <td>{{ store.phone }}</td>
                <td>{{ getStoreTypeName(store.type) }}</td>
                <td>
                  <span :class="['status-badge', store.status]">
                    {{ store.status === 'active' ? 'Faol' : 'Nofaol' }}
                  </span>
                </td>
                <td>{{ formatNumber(store.todaySales) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewStore(store)" title="Ko'rish">
                      <EyeIcon />
                    </button>
                    <button class="action-btn edit" @click="editStore(store)" title="Tahrirlash">
                      <EditIcon />
                    </button>
                    <button class="action-btn delete" @click="deleteStore(store)" title="O'chirish">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div v-if="filteredStores.length === 0" class="empty-state">
            <h3>Do'konlar topilmadi</h3>
            <p>Yangi do'kon qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Store Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ isEditing ? 'Do\'kon tahrirlash' : 'Do\'kon qo\'shish' }}
            </h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          
          <form @submit.prevent="saveStore">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Do'kon nomi</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentStore.name"
                  placeholder="Do'kon nomini kiriting"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Telefon raqami</label>
                <input 
                  type="tel" 
                  class="form-input" 
                  v-model="currentStore.phone"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Do'kon turi</label>
                <select class="form-select" v-model="currentStore.type" required>
                  <option value="">Do'kon turini tanlang</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="minimarket">Minimarket</option>
                  <option value="bakery">Nonvoyxona</option>
                </select>
              </div>
  
              <div class="form-group">
                <label class="form-label">Holati</label>
                <select class="form-select" v-model="currentStore.status" required>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>
  
              <div class="form-group">
                <label class="form-label">Ochilgan sana</label>
                <input 
                  type="date" 
                  class="form-input" 
                  v-model="currentStore.openDate"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Ish vaqti</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentStore.workingHours"
                  placeholder="09:00 - 22:00"
                  required
                />
              </div>
            </div>
  
            <div class="form-group">
              <label class="form-label">Manzil</label>
              <textarea 
                class="form-textarea" 
                v-model="currentStore.address"
                placeholder="To'liq manzilni kiriting"
                required
              ></textarea>
            </div>
  
            <div class="form-group">
              <label class="form-label">Qo'shimcha ma'lumot</label>
              <textarea 
                class="form-textarea" 
                v-model="currentStore.notes"
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
  
      <!-- Store Details Modal -->
      <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
        <div class="modal large-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ selectedStore.name }} - Tafsilotlar</h3>
            <button class="close-btn" @click="closeDetailsModal">&times;</button>
          </div>
          
          <div class="store-details">
            <div class="details-grid">
              <div class="detail-card">
                <h4>Asosiy ma'lumotlar</h4>
                <div class="detail-item">
                  <strong>Nomi:</strong> {{ selectedStore.name }}
                </div>
                <div class="detail-item">
                  <strong>Telefon:</strong> {{ selectedStore.phone }}
                </div>
                <div class="detail-item">
                  <strong>Turi:</strong> {{ getStoreTypeName(selectedStore.type) }}
                </div>
                <div class="detail-item">
                  <strong>Holati:</strong> 
                  <span :class="['status-badge', selectedStore.status]">
                    {{ selectedStore.status === 'active' ? 'Faol' : 'Nofaol' }}
                  </span>
                </div>
              </div>
  
              <div class="detail-card">
                <h4>Savdo ma'lumotlari</h4>
                <div class="detail-item">
                  <strong>Bugungi savdo:</strong> {{ formatNumber(selectedStore.todaySales) }}
                </div>
                <div class="detail-item">
                  <strong>Bu hafta:</strong> {{ formatNumber(selectedStore.weekSales || 0) }}
                </div>
                <div class="detail-item">
                  <strong>Bu oy:</strong> {{ formatNumber(selectedStore.monthSales || 0) }}
                </div>
                <div class="detail-item">
                  <strong>Jami:</strong> {{ formatNumber(selectedStore.totalSales || 0) }}
                </div>
              </div>
            </div>
  
            <div class="detail-card full-width">
              <h4>Manzil va boshqa ma'lumotlar</h4>
              <div class="detail-item">
                <strong>Manzil:</strong> {{ selectedStore.address }}
              </div>
              <div class="detail-item">
                <strong>Ish vaqti:</strong> {{ selectedStore.workingHours }}
              </div>
              <div class="detail-item">
                <strong>Ochilgan sana:</strong> {{ formatDate(selectedStore.openDate) }}
              </div>
              <div class="detail-item" v-if="selectedStore.notes">
                <strong>Qo'shimcha:</strong> {{ selectedStore.notes }}
              </div>
            </div>
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
  import { 
    PlusIcon, 
    EyeIcon, 
    EditIcon, 
    TrashIcon, 
    SearchIcon,
    StoreIcon,
    CheckCircleIcon,
    DollarSignIcon
  } from 'lucide-vue-next'
  
  export default {
    name: 'Stores',
    components: {
      Sidebar,
      PlusIcon,
      EyeIcon,
      EditIcon,
      TrashIcon,
      SearchIcon,
      StoreIcon,
      CheckCircleIcon,
      DollarSignIcon
    },
    data() {
      return {
        searchQuery: '',
        filterStatus: '',
        filterType: '',
        stores: [
          {
            id: 1,
            name: 'Mega Planet',
            address: 'Toshkent shahar, Chilonzor tumani, Bunyodkor ko\'chasi',
            phone: '+998 71 123 45 67',
            type: 'supermarket',
            status: 'active',
            openDate: '2023-01-15',
            workingHours: '08:00 - 23:00',
            todaySales: 2500000,
            weekSales: 15000000,
            monthSales: 60000000,
            totalSales: 500000000,
            notes: 'Yirik supermarket'
          },
          {
            id: 2,
            name: 'Samarqand Darvoza',
            address: 'Toshkent shahar, Mirobod tumani, Samarqand Darvoza',
            phone: '+998 71 234 56 78',
            type: 'minimarket',
            status: 'active',
            openDate: '2023-03-20',
            workingHours: '09:00 - 22:00',
            todaySales: 800000,
            weekSales: 5000000,
            monthSales: 20000000,
            totalSales: 150000000,
            notes: 'Kichik do\'kon'
          }
        ],
        showModal: false,
        showDetailsModal: false,
        isEditing: false,
        loading: false,
        selectedStore: {},
        currentStore: {
          name: '',
          address: '',
          phone: '',
          type: '',
          status: 'active',
          openDate: '',
          workingHours: '',
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
      filteredStores() {
        let filtered = this.stores
  
        if (this.searchQuery) {
          filtered = filtered.filter(store => 
            store.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            store.address.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        }
  
        if (this.filterStatus) {
          filtered = filtered.filter(store => store.status === this.filterStatus)
        }
  
        if (this.filterType) {
          filtered = filtered.filter(store => store.type === this.filterType)
        }
  
        return filtered
      },
      activeStores() {
        return this.stores.filter(s => s.status === 'active').length
      },
      todaySales() {
        return this.stores.reduce((sum, store) => sum + store.todaySales, 0)
      }
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('uz-UZ')
      },
      formatNumber(num) {
        return new Intl.NumberFormat('uz-UZ').format(num)
      },
      getStoreTypeName(type) {
        const types = {
          supermarket: 'Supermarket',
          minimarket: 'Minimarket',
          bakery: 'Nonvoyxona'
        }
        return types[type] || type
      },
      openCreateModal() {
        this.isEditing = false
        this.currentStore = {
          name: '',
          address: '',
          phone: '',
          type: '',
          status: 'active',
          openDate: '',
          workingHours: '',
          notes: ''
        }
        this.showModal = true
      },
      editStore(store) {
        this.isEditing = true
        this.currentStore = { ...store }
        this.showModal = true
      },
      viewStore(store) {
        this.selectedStore = store
        this.showDetailsModal = true
      },
      deleteStore(store) {
        if (confirm(`Haqiqatan ham ${store.name} nomli do'konni o'chirmoqchimisiz?`)) {
          this.stores = this.stores.filter(s => s.id !== store.id)
          this.showToast('Do\'kon muvaffaqiyatli o\'chirildi', 'success')
        }
      },
      closeModal() {
        this.showModal = false
      },
      closeDetailsModal() {
        this.showDetailsModal = false
      },
      async saveStore() {
        this.loading = true
        
        try {
          if (this.isEditing) {
            const index = this.stores.findIndex(s => s.id === this.currentStore.id)
            if (index !== -1) {
              this.stores[index] = { ...this.currentStore }
            }
            this.showToast('Do\'kon muvaffaqiyatli yangilandi', 'success')
          } else {
            const newStore = {
              ...this.currentStore,
              id: Date.now(),
              todaySales: 0,
              weekSales: 0,
              monthSales: 0,
              totalSales: 0
            }
            this.stores.push(newStore)
            this.showToast('Do\'kon muvaffaqiyatli qo\'shildi', 'success')
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
  
  .large-modal {
    max-width: 900px;
  }
  
  .store-details {
    max-height: 600px;
    overflow-y: auto;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
  }
  
  .detail-card {
    background-color: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid #6366f1;
  }
  
  .detail-card.full-width {
    grid-column: 1 / -1;
  }
  
  .detail-card h4 {
    margin-bottom: 16px;
    color: #1e293b;
    font-size: 18px;
    font-weight: 600;
  }
  
  .detail-item {
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .detail-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .detail-item strong {
    color: #374151;
    margin-right: 8px;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .search-section {
      flex-direction: column;
      align-items: stretch;
    }
    
    .details-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  