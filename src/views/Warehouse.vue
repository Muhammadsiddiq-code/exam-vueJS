<template>
  <div class="warehouse-system">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div style="margin-left: 25px;" class="header">
        <h1 class="page-title">Omborxona</h1>
        <button @click="showCreateModal = true" class="create-btn">
          Mahsulot yaratish
        </button>
      </div>

      <!-- Products Table -->
      <div style="margin-left: 25px;"  class="table-container">
        <table class="products-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Nomi</th>
              <th>Narxi</th>
              <th>Soni</th>
              <th>Umumiy summa</th>
              <th>Holati</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.id">
              <td>{{ index + 1 }}</td>
              <td>{{ product.name }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ formatPrice(product.price * product.quantity) }} sum</td>
              <td>
                <span :class="['status', product.status]">
                  {{ product.status === 'active' ? 'Faol' : 'Nofaol' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="viewProduct(product)" class="action-btn view-btn" title="Ko'rish">
                    <EyeIcon class="icon" />
                  </button>
                  <button @click="editProduct(product)" class="action-btn edit-btn" title="Tahrirlash">
                    <EditIcon class="icon" />
                  </button>
                  <button @click="deleteProduct(product.id)" class="action-btn delete-btn" title="O'chirish">
                    <TrashIcon class="icon" />
                  </button>
                  <button @click="toggleDropdown(product.id)" class="action-btn more-btn" title="Ko'proq">
                    <MoreVerticalIcon class="icon" />
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="activeDropdown === product.id" class="dropdown-menu">
                    <button @click="duplicateProduct(product)" class="dropdown-item">
                      <CopyIcon class="icon" />
                      Nusxalash
                    </button>
                    <button @click="exportProduct(product)" class="dropdown-item">
                      <DownloadIcon class="icon" />
                      Eksport
                    </button>
                    <button @click="archiveProduct(product.id)" class="dropdown-item">
                      <ArchiveIcon class="icon" />
                      Arxivlash
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="products.length === 0" class="empty-state">
          <PackageIcon class="empty-icon" />
          <h3>Hech qanday mahsulot topilmadi</h3>
          <p>Yangi mahsulot qo'shish uchun "Mahsulot yaratish" tugmasini bosing</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="products.length > 0" class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
          <ChevronLeftIcon class="icon" />
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
          <ChevronRightIcon class="icon" />
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Mahsulotni tahrirlash' : 'Omborxona mahsulotini yaratish' }}</h2>
          <button @click="closeModal" class="close-btn">
            <XIcon class="icon" />
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="productName">Mahsulot nomi</label>
              <input
                id="productName"
                v-model="formData.name"
                type="text"
                placeholder="Omborxona turini tanglang"
                required
              />
            </div>
            <div class="form-group">
              <label for="productPrice">Narxi (dona)</label>
              <input
                id="productPrice"
                v-model="formData.price"
                type="number"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="productStatus">Mahsulot holati</label>
              <select id="productStatus" v-model="formData.status" required>
                <option value="">Tanlang...</option>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>
            <div class="form-group">
              <label for="productQuantity">Soni (dona/kg/metr)</label>
              <input
                id="productQuantity"
                v-model="formData.quantity"
                type="number"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="productDescription">Umumiy narx</label>
            <input
              id="productDescription"
              v-model="totalPrice"
              type="text"
              readonly
              class="readonly-input"
            />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Chiqish
            </button>
            <button type="submit" class="save-btn">
              {{ showEditModal ? 'Saqlash' : 'Yaratish' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Mahsulot ma'lumotlari</h2>
          <button @click="closeModal" class="close-btn">
            <XIcon class="icon" />
          </button>
        </div>

        <div class="view-content">
          <div class="info-group">
            <label>Mahsulot nomi:</label>
            <span>{{ selectedProduct?.name }}</span>
          </div>
          <div class="info-group">
            <label>Narxi:</label>
            <span>{{ formatPrice(selectedProduct?.price) }}</span>
          </div>
          <div class="info-group">
            <label>Soni:</label>
            <span>{{ selectedProduct?.quantity }}</span>
          </div>
          <div class="info-group">
            <label>Umumiy summa:</label>
            <span>{{ formatPrice(selectedProduct?.price * selectedProduct?.quantity) }} sum</span>
          </div>
          <div class="info-group">
            <label>Holati:</label>
            <span :class="['status', selectedProduct?.status]">
              {{ selectedProduct?.status === 'active' ? 'Faol' : 'Nofaol' }}
            </span>
          </div>
          <div class="info-group">
            <label>Yaratilgan sana:</label>
            <span>{{ formatDate(selectedProduct?.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import { 
  EyeIcon, 
  EditIcon, 
  TrashIcon, 
  MoreVerticalIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PackageIcon,
  CopyIcon,
  DownloadIcon,
  ArchiveIcon
} from 'lucide-vue-next'

// Reactive data
const products = ref([
  {
    id: 1,
    name: "Mo'tabar",
    price: 305000,
    quantity: 100,
    status: 'active',
    createdAt: new Date('2024-01-15')
  }
])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedProduct = ref(null)
const editingProduct = ref(null)
const activeDropdown = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const formData = ref({
  name: '',
  price: 0,
  quantity: 0,
  status: ''
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed properties
const totalPrice = computed(() => {
  const total = formData.value.price * formData.value.quantity
  return formatPrice(total) + ' sum'
})

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage.value)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const resetForm = () => {
  formData.value = {
    name: '',
    price: 0,
    quantity: 0,
    status: ''
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  selectedProduct.value = null
  editingProduct.value = null
  resetForm()
}

const saveProduct = () => {
  if (showEditModal.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (index !== -1) {
      products.value[index] = {
        ...editingProduct.value,
        ...formData.value,
        price: Number(formData.value.price),
        quantity: Number(formData.value.quantity)
      }
      showToast('Mahsulot muvaffaqiyatli yangilandi!')
    }
  } else {
    // Create new product
    const newProduct = {
      id: Date.now(),
      ...formData.value,
      price: Number(formData.value.price),
      quantity: Number(formData.value.quantity),
      createdAt: new Date()
    }
    products.value.push(newProduct)
    showToast('Yangi mahsulot muvaffaqiyatli yaratildi!')
  }
  closeModal()
}

const viewProduct = (product) => {
  selectedProduct.value = product
  showViewModal.value = true
}

const editProduct = (product) => {
  editingProduct.value = product
  formData.value = {
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    status: product.status
  }
  showEditModal.value = true
}

const deleteProduct = (id) => {
  if (confirm('Haqiqatan ham bu mahsulotni o\'chirmoqchimisiz?')) {
    products.value = products.value.filter(p => p.id !== id)
    showToast('Mahsulot muvaffaqiyatli o\'chirildi!', 'error')
  }
}

const duplicateProduct = (product) => {
  const newProduct = {
    ...product,
    id: Date.now(),
    name: product.name + ' (nusxa)',
    createdAt: new Date()
  }
  products.value.push(newProduct)
  activeDropdown.value = null
  showToast('Mahsulot muvaffaqiyatli nusxalandi!')
}

const exportProduct = (product) => {
  const data = JSON.stringify(product, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${product.name}.json`
  a.click()
  URL.revokeObjectURL(url)
  activeDropdown.value = null
  showToast('Mahsulot muvaffaqiyatli eksport qilindi!')
}

const archiveProduct = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) {
    product.status = 'archived'
    activeDropdown.value = null
    showToast('Mahsulot arxivlandi!')
  }
}

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.action-buttons')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.warehouse-system {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.create-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.products-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.products-table tr:hover {
  background: #f8fafc;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.inactive {
  background: #fef2f2;
  color: #dc2626;
}

.status.archived {
  background: #f3f4f6;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 8px;
  position: relative;
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
  /* background: #dbeafe; */
  background-color: #fff;
  color: #1d4ed8;
}

.view-btn:hover {
  background: #bfdbfe;
}

.edit-btn {
  /* background: #fef3c7; */
  background-color: #fff;
  color: #d97706;
}

.edit-btn:hover {
  background: #fde68a;
}

.delete-btn {
  /* background: #fecaca; */
  background-color: #fff;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fca5a5;
}

.more-btn {
  /* background: #f3f4f6; */
  background-color: #fff;
  color: #6b7280;
}

.more-btn:hover {
  background: #e5e7eb;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 150px;
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.icon {
  width: 16px;
  height: 16px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: #6b7280;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #d1d5db;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: #374151;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
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

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.readonly-input {
  background: #f9fafb;
  color: #6b7280;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  padding: 12px 24px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-btn:hover {
  background: #f9fafb;
}

.save-btn {
  padding: 12px 24px;
  border: none;
  background: #4f46e5;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.save-btn:hover {
  background: #4338ca;
}

.view-content {
  padding: 24px;
}

.info-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-group:last-child {
  border-bottom: none;
}

.info-group label {
  font-weight: 600;
  color: #6b7280;
}

.info-group span {
  color: #1e293b;
}

.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
    margin: 16px;
  }
  
  .products-table {
    font-size: 14px;
  }
  
  .products-table th,
  .products-table td {
    padding: 12px 8px;
  }
}
</style>