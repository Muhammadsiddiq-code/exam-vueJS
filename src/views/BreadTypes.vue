<template>
  <div class="bread-types-system">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <div class="title-section">
            <div class="bread-icon">🍞</div>
            <div>
              <h1 class="page-title">Non turlari</h1>
              <p class="page-subtitle">Non turlarini boshqarish va yangi turlar qo'shish</p>
            </div>
          </div>
          <button @click="openCreateModal" class="create-btn">
            <div class="btn-content">
              <PlusIcon class="btn-icon" />
              <span>Non turini yaratish</span>
            </div>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon bread">🥖</div>
          <div class="stat-info">
            <h3>{{ breadTypes.length }}</h3>
            <p>Jami non turlari</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">✅</div>
          <div class="stat-info">
            <h3>{{ activeBreadTypes }}</h3>
            <p>Faol turlar</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon revenue">💰</div>
          <div class="stat-info">
            <h3>{{ formatPrice(totalRevenue) }}</h3>
            <p>Umumiy daromad</p>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="filter-section">
        <div class="search-container">
          <SearchIcon class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Non turlarini qidirish..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Barcha holatlar</option>
            <option value="Bor">Mavjud</option>
            <option value="Yo'q">Mavjud emas</option>
          </select>
          <button @click="exportData" class="export-btn">
            <DownloadIcon class="icon" />
            Eksport
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-container">
        <div class="table-header">
          <h3>Non turlari ro'yxati</h3>
          <div class="table-actions">
            <button @click="refreshData" class="refresh-btn">
              <RefreshCwIcon class="icon" />
            </button>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>№</th>
                <th @click="sortBy('name')" class="sortable">
                  <div class="th-content">
                    Nomi
                    <ArrowUpDownIcon class="sort-icon" />
                  </div>
                </th>
                <th @click="sortBy('costPrice')" class="sortable">
                  <div class="th-content">
                    Tan narxi
                    <ArrowUpDownIcon class="sort-icon" />
                  </div>
                </th>
                <th @click="sortBy('shopPrice')" class="sortable">
                  <div class="th-content">
                    Narxi (do'kon)
                    <ArrowUpDownIcon class="sort-icon" />
                  </div>
                </th>
                <th @click="sortBy('weddingPrice')" class="sortable">
                  <div class="th-content">
                    To'yxona
                    <ArrowUpDownIcon class="sort-icon" />
                  </div>
                </th>
                <th @click="sortBy('bagPrice')" class="sortable">
                  <div class="th-content">
                    Qop narxi
                    <ArrowUpDownIcon class="sort-icon" />
                  </div>
                </th>
                <th>Holati</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <transition-group name="table-row" tag="tbody">
                <tr v-for="(item, index) in filteredBreadTypes" :key="item.id" class="table-row">
                  <td>
                    <div class="row-number">{{ index + 1 }}</div>
                  </td>
                  <td>
                    <div class="bread-name">
                      <div class="bread-emoji">{{ item.emoji }}</div>
                      <span>{{ item.name }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="price-cell">{{ formatPrice(item.costPrice) }}</div>
                  </td>
                  <td>
                    <div class="price-cell">{{ formatPrice(item.shopPrice) }}</div>
                  </td>
                  <td>
                    <div class="price-cell">{{ formatPrice(item.weddingPrice) }}</div>
                  </td>
                  <td>
                    <div class="price-cell">{{ formatPrice(item.bagPrice) }}</div>
                  </td>
                  <td>
                    <div class="status-container">
                      <span :class="['status-badge', item.status.toLowerCase()]">
                        {{ item.status }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button @click="viewItem(item)" class="action-btn view-btn" title="Ko'rish">
                        <EyeIcon class="icon" />
                      </button>
                      <button @click="editItem(item)" class="action-btn edit-btn" title="Tahrirlash">
                        <EditIcon class="icon" />
                      </button>
                      <button @click="deleteItem(item.id)" class="action-btn delete-btn" title="O'chirish">
                        <TrashIcon class="icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </transition-group>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Slide-in Modal -->
    <transition name="modal-slide">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-title-section">
              <div class="modal-icon">🍞</div>
              <div>
                <h2>{{ isEditing ? 'Non turini tahrirlash' : 'Yangi non turi yaratish' }}</h2>
                <p>Non turi ma'lumotlarini kiriting</p>
              </div>
            </div>
            <button @click="closeModal" class="close-btn">
              <XIcon class="icon" />
            </button>
          </div>

          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-section">
              <h3>Asosiy ma'lumotlar</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="breadName">Non nomi</label>
                  <input
                    id="breadName"
                    v-model="formData.name"
                    type="text"
                    placeholder="Masalan: Patir"
                    required
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label for="breadEmoji">Emoji</label>
                  <select id="breadEmoji" v-model="formData.emoji" class="form-select">
                    <option value="🍞">🍞 Oddiy non</option>
                    <option value="🥖">🥖 Baget</option>
                    <option value="🥯">🥯 Bagel</option>
                    <option value="🧈">🧈 Sariyog'li</option>
                    <option value="🥐">🥐 Kruassan</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Narxlar</h3>
              <div class="price-grid">
                <div class="form-group">
                  <label for="costPrice">Tan narxi</label>
                  <div class="price-input-container">
                    <input
                      id="costPrice"
                      v-model="formData.costPrice"
                      type="number"
                      placeholder="0"
                      min="0"
                      required
                      class="form-input price-input"
                    />
                    <span class="currency">so'm</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="shopPrice">Do'kon narxi</label>
                  <div class="price-input-container">
                    <input
                      id="shopPrice"
                      v-model="formData.shopPrice"
                      type="number"
                      placeholder="0"
                      min="0"
                      required
                      class="form-input price-input"
                    />
                    <span class="currency">so'm</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="weddingPrice">To'yxona narxi</label>
                  <div class="price-input-container">
                    <input
                      id="weddingPrice"
                      v-model="formData.weddingPrice"
                      type="number"
                      placeholder="0"
                      min="0"
                      required
                      class="form-input price-input"
                    />
                    <span class="currency">so'm</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="bagPrice">Qop narxi</label>
                  <div class="price-input-container">
                    <input
                      id="bagPrice"
                      v-model="formData.bagPrice"
                      type="number"
                      placeholder="0"
                      min="0"
                      required
                      class="form-input price-input"
                    />
                    <span class="currency">so'm</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Holat</h3>
              <div class="status-options">
                <label class="radio-option">
                  <input type="radio" v-model="formData.status" value="Bor" />
                  <span class="radio-custom"></span>
                  <span class="radio-label">Mavjud</span>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="formData.status" value="Yo'q" />
                  <span class="radio-custom"></span>
                  <span class="radio-label">Mavjud emas</span>
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">
                <XIcon class="icon" />
                Bekor qilish
              </button>
              <button type="submit" class="save-btn">
                <CheckIcon class="icon" />
                {{ isEditing ? 'Saqlash' : 'Yaratish' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Toast Notifications -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <div class="toast-content">
          <CheckCircleIcon v-if="toast.type === 'success'" class="toast-icon" />
          <AlertCircleIcon v-else class="toast-icon" />
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import { 
  PlusIcon, 
  SearchIcon, 
  DownloadIcon,
  RefreshCwIcon,
  ArrowUpDownIcon,
  EyeIcon, 
  EditIcon, 
  TrashIcon, 
  XIcon,
  CheckIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-vue-next'

// Reactive data
const breadTypes = ref([
  {
    id: 1,
    name: 'patir',
    emoji: '🍞',
    costPrice: 12,
    shopPrice: 3333,
    weddingPrice: 454,
    bagPrice: 4545,
    status: 'Bor'
  },
  {
    id: 2,
    name: 'Oq non',
    emoji: '🥖',
    costPrice: 15,
    shopPrice: 4000,
    weddingPrice: 500,
    bagPrice: 5000,
    status: 'Bor'
  },
  {
    id: 3,
    name: 'Qora non',
    emoji: '🥯',
    costPrice: 18,
    shopPrice: 4500,
    weddingPrice: 600,
    bagPrice: 5500,
    status: 'Yo\'q'
  }
])

const showModal = ref(false)
const isEditing = ref(false)
const editingItem = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const sortField = ref('')
const sortOrder = ref('asc')

const formData = ref({
  name: '',
  emoji: '🍞',
  costPrice: 0,
  shopPrice: 0,
  weddingPrice: 0,
  bagPrice: 0,
  status: 'Bor'
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed properties
const filteredBreadTypes = computed(() => {
  let filtered = breadTypes.value

  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }

  return filtered
})

const activeBreadTypes = computed(() => {
  return breadTypes.value.filter(item => item.status === 'Bor').length
})

const totalRevenue = computed(() => {
  return breadTypes.value.reduce((sum, item) => sum + item.shopPrice, 0)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const openCreateModal = () => {
  isEditing.value = false
  editingItem.value = null
  resetForm()
  showModal.value = true
}

const editItem = (item) => {
  isEditing.value = true
  editingItem.value = item
  formData.value = { ...item }
  showModal.value = true
}

const viewItem = (item) => {
  alert(`Non turi: ${item.name}\nTan narxi: ${formatPrice(item.costPrice)}\nDo'kon narxi: ${formatPrice(item.shopPrice)}\nTo'yxona narxi: ${formatPrice(item.weddingPrice)}\nQop narxi: ${formatPrice(item.bagPrice)}\nHolati: ${item.status}`)
}

const deleteItem = (id) => {
  if (confirm('Haqiqatan ham bu non turini o\'chirmoqchimisiz?')) {
    breadTypes.value = breadTypes.value.filter(item => item.id !== id)
    showToast('Non turi muvaffaqiyatli o\'chirildi!', 'success')
  }
}

const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    isEditing.value = false
    editingItem.value = null
    resetForm()
  }, 300)
}

const resetForm = () => {
  formData.value = {
    name: '',
    emoji: '🍞',
    costPrice: 0,
    shopPrice: 0,
    weddingPrice: 0,
    bagPrice: 0,
    status: 'Bor'
  }
}

const saveItem = () => {
  if (isEditing.value) {
    const index = breadTypes.value.findIndex(item => item.id === editingItem.value.id)
    if (index !== -1) {
      breadTypes.value[index] = {
        ...editingItem.value,
        ...formData.value,
        costPrice: Number(formData.value.costPrice),
        shopPrice: Number(formData.value.shopPrice),
        weddingPrice: Number(formData.value.weddingPrice),
        bagPrice: Number(formData.value.bagPrice)
      }
      showToast('Non turi muvaffaqiyatli yangilandi!')
    }
  } else {
    const newItem = {
      id: Date.now(),
      ...formData.value,
      costPrice: Number(formData.value.costPrice),
      shopPrice: Number(formData.value.shopPrice),
      weddingPrice: Number(formData.value.weddingPrice),
      bagPrice: Number(formData.value.bagPrice)
    }
    breadTypes.value.push(newItem)
    showToast('Yangi non turi muvaffaqiyatli yaratildi!')
  }
  closeModal()
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const exportData = () => {
  const data = JSON.stringify(breadTypes.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'non-turlari.json'
  a.click()
  URL.revokeObjectURL(url)
  showToast('Ma\'lumotlar muvaffaqiyatli eksport qilindi!')
}

const refreshData = () => {
  showToast('Ma\'lumotlar yangilandi!')
}

onMounted(() => {
  // Initialize component
})
</script>

<style scoped>
.bread-types-system {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.bread-icon {
  font-size: 48px;
  background: rgba(255, 255, 255, 0.2);
  padding: 16px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0;
}

.create-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.create-btn:hover .btn-glow {
  transform: translateX(100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.bread {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.stat-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-info h3 {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.stat-info p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.export-btn, .refresh-btn {
  padding: 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.export-btn:hover, .refresh-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.table-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
}

.table-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8fafc;
  padding: 20px 24px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.data-table th.sortable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.data-table th.sortable:hover {
  background: #f1f5f9;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
}

.data-table td {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.row-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.bread-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bread-emoji {
  font-size: 24px;
}

.price-cell {
  font-weight: 600;
  color: #059669;
}

.status-container {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.bor {
  background: #dcfce7;
  color: #166534;
}

.status-badge.yoq {
  background: #fef2f2;
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.view-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.view-btn:hover {
  background: #bfdbfe;
  transform: scale(1.1);
}

.edit-btn {
  background: #fef3c7;
  color: #d97706;
}

.edit-btn:hover {
  background: #fde68a;
  transform: scale(1.1);
}

.delete-btn {
  background: #fecaca;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fca5a5;
  transform: scale(1.1);
}

.icon {
  width: 18px;
  height: 18px;
}

/* Modal Animations */
.modal-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-container {
  background: white;
  width: 600px;
  height: 100vh;
  overflow-y: auto;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  font-size: 32px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.modal-header p {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-form {
  padding: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.price-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input, .form-select {
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.price-input-container {
  position: relative;
}

.price-input {
  padding-right: 60px;
}

.currency {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 600;
}

.status-options {
  display: flex;
  gap: 24px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.radio-option:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.radio-option input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-option input[type="radio"]:checked + .radio-custom {
  border-color: #667eea;
  background: #667eea;
}

.radio-option input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.radio-label {
  font-weight: 600;
  color: #374151;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  padding: 16px 32px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.save-btn {
  padding: 16px 32px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  z-index: 1001;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  width: 20px;
  height: 20px;
}

.table-row-enter-active, .table-row-leave-active {
  transition: all 0.3s ease;
}

.table-row-enter-from, .table-row-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .modal-container {
    width: 100%;
  }
  
  .form-grid, .price-grid {
    grid-template-columns: 1fr;
  }
  
  .status-options {
    flex-direction: column;
  }
}
</style>