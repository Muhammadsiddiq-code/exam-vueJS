<!-- <template>
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
                  <button class="action-btn view" @click="viewManager(manager)">
                    <EyeIcon />
                  </button>
                  <button class="action-btn edit" @click="editManager(manager)">
                    <EditIcon />
                  </button>
                  <button class="action-btn delete" @click="deleteManager(manager)">
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="managers.length === 0" class="empty-state">
          <h3>Hozircha managerlar yo'q</h3>
          <button class="btn btn-primary" @click="openCreateModal">
            <PlusIcon /> Manager yaratish
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ isEditing ? 'Tahrirlash' : 'Yaratish' }}</h3>
        <form @submit.prevent="saveManager">
          <input v-model="currentManager.name" placeholder="Ism" required />
          <input v-model="currentManager.phone" placeholder="Telefon" required />
          <input v-model="currentManager.email" placeholder="Email" />
          <input v-model="currentManager.password" placeholder="Parol" :required="!isEditing" type="password" />
          <select v-model="currentManager.position" required>
            <option value="">Lavozim tanlang</option>
            <option value="senior">Senior</option>
            <option value="junior">Junior</option>
            <option value="assistant">Assistant</option>
          </select>
          <textarea v-model="currentManager.address" placeholder="Manzil"></textarea>
          <button :disabled="loading">{{ loading ? 'Saqlanmoqda...' : (isEditing ? 'Yangilash' : 'Yaratish') }}</button>
        </form>
      </div>
    </div>

    <div v-if="toast.show" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script>
import Sidebar from '@/components/Layout/Sidebar.vue'
import { PlusIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-vue-next'
import api from '@/Utils/axios'  // bu yerda to‘g‘ri yo‘lga ishonch hosil qiling

export default {
  name: 'Managers',
  components: { Sidebar, PlusIcon, EyeIcon, EditIcon, TrashIcon },
  data() {
    return {
      managers: [],
      showModal: false,
      isEditing: false,
      loading: false,
      currentManager: {
        name: '', phone: '', email: '', password: '', position: '', address: ''
      },
      toast: { show: false, type: '', message: '' }
    }
  },
  created() {
    this.fetchManagers()
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('uz-UZ')
    },
    async fetchManagers() {
      this.loading = true
      try {
        const res = await api.get('/api/managers')
        this.managers = res.data
      } catch (err) {
        this.showToast('Managerlarni yuklashda xatolik', 'error')
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.isEditing = false
      this.currentManager = { name: '', phone: '', email: '', password: '', position: '', address: '' }
      this.showModal = true
    },
    editManager(manager) {
      this.isEditing = true
      this.currentManager = { ...manager, password: '' }
      this.showModal = true
    },
    async saveManager() {
      this.loading = true
      try {
        if (this.isEditing) {
          await api.put(`/api/managers/${this.currentManager.id}`, this.currentManager)
          this.showToast('Manager yangilandi', 'success')
        } else {
          const res = await api.post('/api/manager', this.currentManager)
          this.managers.push(res.data)
          this.showToast('Manager yaratildi', 'success')
        }
        this.fetchManagers()
        this.closeModal()
      } catch (err) {
        this.showToast('Saqlashda xatolik', 'error')
      } finally {
        this.loading = false
      }
    },
    async deleteManager(manager) {
      if (!confirm(`${manager.name} ni o'chirmoqchimisiz?`)) return
      this.loading = true
      try {
        await api.delete(`/api/managers/${manager.id}`)
        this.managers = this.managers.filter(m => m.id !== manager.id)
        this.showToast('Manager o\'chirildi', 'success')
      } catch {
        this.showToast('O\'chirishda xatolik', 'error')
      } finally {
        this.loading = false
      }
    },
    closeModal() {
      this.showModal = false
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type }
      setTimeout(() => { this.toast.show = false }, 3000)
    }
  }
}
</script>

<style scoped>
.main-layout { padding: 20px; }
.table { width: 100%; border-collapse: collapse }
.table th, .table td { border: 1px solid #ddd; padding: 8px; }
.modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; }
.modal { background:#fff; padding:20px; border-radius:8px; width:300px; }
/* .toast { position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; border-radius: 4px; color: #fff; } */
.toast.success { background: #16a34a; }
.toast.error { background: #dc2626; }
</style> -->

























<template>
  <div class="dashboard-container">
    <Sidebar />
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="content-header">
        <div class="header-left">
          <div>
            <h1 class="page-title">Boshqaruvchilar</h1>
            <div class="breadcrumb">
              <span>Dashboard</span>
              <ChevronRight class="breadcrumb-separator" />
              <span class="breadcrumb-current">Managerlar</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <!-- Search -->
            <div class="search-box">
              <Search class="search-icon" />
              <input 
                type="text"
                placeholder="Manager qidirish..."
                v-model="searchQuery"
                @input="handleSearch"
                class="search-input"
              />
              <button v-if="searchQuery" class="search-clear" @click="clearSearch">
                <X />
              </button>
            </div>
            
            <!-- Filter -->
            <div class="filter-dropdown" ref="filterDropdown">
              <button class="filter-btn" @click="toggleFilter">
                <Filter class="filter-icon" />
                Filter
                <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
              </button>
              <div v-if="showFilter" class="filter-menu">
                <div class="filter-section">
                  <h4>Lavozim bo'yicha</h4>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.senior" @change="applyFilters" />
                      Senior Manager
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.junior" @change="applyFilters" />
                      Junior Manager
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.assistant" @change="applyFilters" />
                      Assistant Manager
                    </label>
                  </div>
                </div>
                <div class="filter-section">
                  <h4>Holat bo'yicha</h4>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.active" @change="applyFilters" />
                      Faol
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.inactive" @change="applyFilters" />
                      Nofaol
                    </label>
                  </div>
                </div>
                <div class="filter-actions">
                  <button class="filter-clear" @click="clearFilters">Tozalash</button>
                </div>
              </div>
            </div>
            
            <!-- Export -->
            <button class="export-btn" @click="exportData" :disabled="filteredManagers.length === 0">
              <Download class="export-icon" />
              Export
            </button>
            
            <!-- Refresh -->
            <button class="refresh-btn" @click="loadManagers" :disabled="loading">
              <RefreshCw class="refresh-icon" :class="{ 'spinning': loading }" />
              Yangilash
            </button>
            
            <!-- Create Button -->
            <button class="create-btn" @click="openCreateModal">
              <Plus class="create-icon" />
              Manager yaratish
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" @click="filterByStatus('all')">
          <div class="stat-icon total">
            <Users />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ totalManagers }}</h3>
            <p class="stat-label">Jami Managerlar</p>
            <span class="stat-change positive">+{{ newManagersThisWeek }} bu hafta</span>
          </div>
        </div>
        <div class="stat-card" @click="filterByStatus('active')">
          <div class="stat-icon active">
            <UserCheck />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ activeManagers }}</h3>
            <p class="stat-label">Faol Managerlar</p>
            <span class="stat-change">{{ Math.round((activeManagers / totalManagers) * 100) }}% faol</span>
          </div>
        </div>
        <div class="stat-card" @click="filterByStatus('new')">
          <div class="stat-icon new">
            <UserPlus />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ newManagers }}</h3>
            <p class="stat-label">Yangi (Bu oy)</p>
            <span class="stat-change positive">+{{ newManagersGrowth }}%</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon performance">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ performance }}%</h3>
            <p class="stat-label">Samaradorlik</p>
            <span class="stat-change" :class="{ positive: performanceChange > 0, negative: performanceChange < 0 }">
              {{ performanceChange > 0 ? '+' : '' }}{{ performanceChange }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <!-- Table Header -->
        <div class="table-header">
          <div class="table-title">
            <h3>Managerlar ro'yxati</h3>
            <span class="table-count">{{ filteredManagers.length }} ta manager</span>
          </div>
          <div class="table-actions">
            <button 
              class="bulk-action-btn" 
              :disabled="selectedManagers.length === 0" 
              @click="showBulkActions = !showBulkActions"
            >
              <MoreHorizontal />
              Amallar ({{ selectedManagers.length }})
            </button>
            <div v-if="showBulkActions" class="bulk-actions-menu">
              <button @click="bulkDelete" class="bulk-action-item danger">
                <Trash2 />
                O'chirish
              </button>
              <button @click="bulkStatusChange('active')" class="bulk-action-item">
                <UserCheck />
                Faollashtirish
              </button>
              <button @click="bulkStatusChange('inactive')" class="bulk-action-item">
                <UserX />
                Nofaollashtirish
              </button>
            </div>
            <button class="view-toggle-btn" @click="toggleView">
              <Grid v-if="viewMode === 'table'" />
              <List v-else />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">
            <AlertCircle />
          </div>
          <h3>Xatolik yuz berdi</h3>
          <p>{{ error }}</p>
          <button class="retry-btn" @click="loadManagers">
            <RefreshCw />
            Qayta urinish
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredManagers.length === 0 && !loading" class="empty-state">
          <div class="empty-illustration">
            <Users class="empty-icon" />
          </div>
          <h3 class="empty-title">
            {{ searchQuery || hasActiveFilters ? 'Natija topilmadi' : 'Hozircha boshqaruvchilar mavjud emas' }}
          </h3>
          <p class="empty-description">
            {{ searchQuery || hasActiveFilters 
              ? 'Qidiruv yoki filtr shartlariga mos manager topilmadi' 
              : 'Yangi manager qo\'shish uchun yuqoridagi tugmani bosing' 
            }}
          </p>
          <button v-if="!searchQuery && !hasActiveFilters" class="empty-action-btn" @click="openCreateModal">
            <Plus />
            Manager yaratish
          </button>
          <button v-else class="empty-action-btn" @click="clearSearchAndFilters">
            <X />
            Filtrlarni tozalash
          </button>
        </div>

        <!-- Table View -->
        <div v-else-if="viewMode === 'table'" class="table-wrapper">
          <table class="managers-table">
            <thead>
              <tr>
                <th class="checkbox-column">
                  <input 
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                    class="table-checkbox"
                  />
                </th>
                <th class="sortable" @click="sortBy('id')">
                  №
                  <ChevronUp v-if="sortField === 'id' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'id' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th class="sortable" @click="sortBy('name')">
                  Ismi
                  <ChevronUp v-if="sortField === 'name' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'name' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th>Telefon</th>
                <th>Email</th>
                <th class="sortable" @click="sortBy('position')">
                  Lavozimi
                  <ChevronUp v-if="sortField === 'position' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'position' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th>Holati</th>
                <th class="sortable" @click="sortBy('created_at')">
                  Sana
                  <ChevronUp v-if="sortField === 'created_at' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'created_at' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th class="actions-column">Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(manager, index) in paginatedManagers" 
                :key="manager.id" 
                class="table-row"
                :class="{ selected: selectedManagers.includes(manager.id) }"
              >
                <td>
                  <input 
                    type="checkbox"
                    :checked="selectedManagers.includes(manager.id)"
                    @change="toggleSelect(manager.id)"
                    class="table-checkbox"
                  />
                </td>
                <td class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="manager-info">
                  <div class="manager-avatar" :style="{ backgroundColor: getAvatarColor(manager.name) }">
                    {{ getInitials(manager.name) }}
                  </div>
                  <div class="manager-details">
                    <span class="manager-name">{{ manager.name }}</span>
                    <span class="manager-id">ID: {{ manager.id }}</span>
                  </div>
                </td>
                <td class="phone-cell">
                  <a :href="`tel:${manager.phone}`" class="phone-link">{{ formatPhone(manager.phone) }}</a>
                </td>
                <td class="email-cell">
                  <a v-if="manager.email" :href="`mailto:${manager.email}`" class="email-link">{{ manager.email }}</a>
                  <span v-else class="no-data">N/A</span>
                </td>
                <td>
                  <span :class="['position-badge', getPositionClass(manager.position)]">
                    {{ getPositionName(manager.position) }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', manager.status]">
                    <div class="status-dot"></div>
                    {{ getStatusName(manager.status) }}
                  </span>
                </td>
                <td class="date-cell">
                  <span :title="formatDateTime(manager.created_at)">
                    {{ formatDate(manager.created_at) }}
                  </span>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewManager(manager)" title="Ko'rish">
                      <Eye />
                    </button>
                    <button class="action-btn edit" @click="editManager(manager)" title="Tahrirlash">
                      <Edit />
                    </button>
                    <button class="action-btn delete" @click="deleteManager(manager)" title="O'chirish">
                      <Trash2 />
                    </button>
                    <div class="action-dropdown" ref="actionDropdown">
                      <button class="action-btn more" @click="toggleActionMenu(manager.id)">
                        <MoreHorizontal />
                      </button>
                      <div v-if="activeActionMenu === manager.id" class="action-menu">
                        <button @click="duplicateManager(manager)" class="action-menu-item">
                          <Copy />
                          Nusxalash
                        </button>
                        <button @click="toggleManagerStatus(manager)" class="action-menu-item">
                          <UserCheck v-if="manager.status !== 'active'" />
                          <UserX v-else />
                          {{ manager.status === 'active' ? 'Nofaollashtirish' : 'Faollashtirish' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card View -->
        <div v-else class="cards-grid">
          <div 
            v-for="manager in paginatedManagers" 
            :key="manager.id" 
            class="manager-card"
            :class="{ selected: selectedManagers.includes(manager.id) }"
          >
            <div class="card-header">
              <input 
                type="checkbox"
                :checked="selectedManagers.includes(manager.id)"
                @change="toggleSelect(manager.id)"
                class="card-checkbox"
              />
              <div class="manager-avatar large" :style="{ backgroundColor: getAvatarColor(manager.name) }">
                {{ getInitials(manager.name) }}
              </div>
              <div class="card-actions">
                <button class="card-action-btn" @click="viewManager(manager)" title="Ko'rish">
                  <Eye />
                </button>
                <button class="card-action-btn" @click="editManager(manager)" title="Tahrirlash">
                  <Edit />
                </button>
                <button class="card-action-btn delete" @click="deleteManager(manager)" title="O'chirish">
                  <Trash2 />
                </button>
              </div>
            </div>
            <div class="card-content">
              <h4 class="card-name">{{ manager.name }}</h4>
              <p class="card-position">{{ getPositionName(manager.position) }}</p>
              <div class="card-info">
                <div class="info-item">
                  <Phone class="info-icon" />
                  <a :href="`tel:${manager.phone}`">{{ formatPhone(manager.phone) }}</a>
                </div>
                <div class="info-item">
                  <Mail class="info-icon" />
                  <a v-if="manager.email" :href="`mailto:${manager.email}`">{{ manager.email }}</a>
                  <span v-else class="no-data">N/A</span>
                </div>
                <div class="info-item">
                  <Calendar class="info-icon" />
                  <span :title="formatDateTime(manager.created_at)">{{ formatDate(manager.created_at) }}</span>
                </div>
              </div>
              <div class="card-footer">
                <span :class="['status-badge', manager.status]">
                  <div class="status-dot"></div>
                  {{ getStatusName(manager.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="goToPage(1)"
          >
            <ChevronsLeft />
          </button>
          <button 
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft />
            Oldingi
          </button>
          
          <div class="pagination-numbers">
            <button 
              v-for="page in visiblePages"
              :key="page"
              :class="['pagination-number', { active: page === currentPage }]"
              @click="goToPage(page)"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Keyingi
            <ChevronRight />
          </button>
          <button 
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
          >
            <ChevronsRight />
          </button>
        </div>

        <!-- Items per page selector -->
        <div class="pagination-info">
          <div class="items-per-page">
            <label>Sahifada:</label>
            <select v-model="itemsPerPage" @change="changeItemsPerPage">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <div class="pagination-summary">
            {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredManagers.length) }} 
            / {{ filteredManagers.length }} ta natija
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ isEditing ? 'Manager tahrirlash' : 'Manager yaratish' }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <X />
          </button>
        </div>
        
        <form @submit.prevent="saveManager" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Manager nomi *</label>
              <input 
                type="text"
                class="form-input"
                v-model="currentManager.name"
                placeholder="Manager nomini kiriting"
                required
                :class="{ error: formErrors.name }"
              />
              <span v-if="formErrors.name" class="form-error">{{ formErrors.name }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Telefon raqami *</label>
              <input 
                type="tel"
                class="form-input"
                v-model="currentManager.phone"
                placeholder="+998 90 123 45 67"
                required
                :class="{ error: formErrors.phone }"
                @input="formatPhoneInput"
              />
              <span v-if="formErrors.phone" class="form-error">{{ formErrors.phone }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email"
                class="form-input"
                v-model="currentManager.email"
                placeholder="manager@example.com"
                :class="{ error: formErrors.email }"
              />
              <span v-if="formErrors.email" class="form-error">{{ formErrors.email }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Lavozimi *</label>
              <select class="form-select" v-model="currentManager.position" required :class="{ error: formErrors.position }">
                <option value="">Lavozimni tanlang</option>
                <option value="senior">Senior Manager</option>
                <option value="junior">Junior Manager</option>
                <option value="assistant">Assistant Manager</option>
              </select>
              <span v-if="formErrors.position" class="form-error">{{ formErrors.position }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Parol {{ isEditing ? '' : '*' }}</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                v-model="currentManager.password"
                :placeholder="isEditing ? 'Yangi parol (bo\'sh qoldiring agar o\'zgartirmasangiz)' : 'Parolni kiriting'"
                :required="!isEditing"
                :class="{ error: formErrors.password }"
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <Eye v-if="!showPassword" />
                <EyeOff v-else />
              </button>
            </div>
            <span v-if="formErrors.password" class="form-error">{{ formErrors.password }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Manzil</label>
            <textarea 
              class="form-textarea"
              v-model="currentManager.address"
              placeholder="Manager manzilini kiriting"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Holati</label>
            <select class="form-select" v-model="currentManager.status">
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
              <option value="suspended">To'xtatilgan</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              Bekor qilish
            </button>
            <button type="submit" class="btn-primary" :disabled="formLoading">
              <div v-if="formLoading" class="loading-spinner small"></div>
              {{ formLoading ? 'Saqlanmoqda...' : (isEditing ? 'Yangilash' : 'Yaratish') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Manager ma'lumotlari</h3>
          <button class="modal-close" @click="closeViewModal">
            <X />
          </button>
        </div>
        
        <div class="view-content">
          <div class="manager-profile">
            <div class="profile-avatar" :style="{ backgroundColor: getAvatarColor(viewingManager.name) }">
              {{ getInitials(viewingManager.name) }}
            </div>
            <div class="profile-info">
              <h2 class="profile-name">{{ viewingManager.name }}</h2>
              <p class="profile-position">{{ getPositionName(viewingManager.position) }}</p>
              <span :class="['status-badge', viewingManager.status]">
                <div class="status-dot"></div>
                {{ getStatusName(viewingManager.status) }}
              </span>
            </div>
            <div class="profile-actions">
              <button class="btn-secondary" @click="editManager(viewingManager)">
                <Edit />
                Tahrirlash
              </button>
            </div>
          </div>
          <div class="details-grid">
            <div class="detail-card">
              <h4>Shaxsiy ma'lumotlar</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <Phone class="detail-icon" />
                  <div>
                    <span class="detail-label">Telefon</span>
                    <a :href="`tel:${viewingManager.phone}`" class="detail-value">{{ formatPhone(viewingManager.phone) }}</a>
                  </div>
                </div>
                <div class="detail-item">
                  <Mail class="detail-icon" />
                  <div>
                    <span class="detail-label">Email</span>
                    <a v-if="viewingManager.email" :href="`mailto:${viewingManager.email}`" class="detail-value">{{ viewingManager.email }}</a>
                    <span v-else class="detail-value no-data">Kiritilmagan</span>
                  </div>
                </div>
                <div class="detail-item">
                  <MapPin class="detail-icon" />
                  <div>
                    <span class="detail-label">Manzil</span>
                    <span class="detail-value">{{ viewingManager.address || 'Kiritilmagan' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-card">
              <h4>Ish ma'lumotlari</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <Briefcase class="detail-icon" />
                  <div>
                    <span class="detail-label">Lavozimi</span>
                    <span class="detail-value">{{ getPositionName(viewingManager.position) }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <Calendar class="detail-icon" />
                  <div>
                    <span class="detail-label">Ishga kirgan sana</span>
                    <span class="detail-value">{{ formatDate(viewingManager.created_at) }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <Clock class="detail-icon" />
                  <div>
                    <span class="detail-label">Ish tajribasi</span>
                    <span class="detail-value">{{ getWorkExperience(viewingManager.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Manager o'chirish</h3>
          <button class="modal-close" @click="closeDeleteModal">
            <X />
          </button>
        </div>
        
        <div class="delete-content">
          <div class="delete-icon">
            <AlertTriangle />
          </div>
          <h4>Haqiqatan ham o'chirmoqchimisiz?</h4>
          <p>
            <strong>{{ deletingManager.name }}</strong> nomli manager va unga bog'liq barcha ma'lumotlar o'chiriladi.
          </p>
          <p class="warning-text">Bu amal qaytarib bo'lmaydi!</p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="closeDeleteModal">
            Bekor qilish
          </button>
          <button type="button" class="btn-danger" @click="confirmDelete" :disabled="formLoading">
            <div v-if="formLoading" class="loading-spinner small"></div>
            {{ formLoading ? 'O\'chirilmoqda...' : 'O\'chirish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
          <div class="toast-icon">
            <CheckCircle v-if="toast.type === 'success'" />
            <AlertCircle v-else-if="toast.type === 'error'" />
            <Info v-else />
          </div>
          <div class="toast-content">
            <h4 class="toast-title">{{ toast.title }}</h4>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button class="toast-close" @click="removeToast(toast.id)">
            <X />
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import {
  LayoutDashboard, Users, UserCheck, Truck, Store, TrendingUp, Package, Cookie, Settings, LogOut,
  ChevronRight, Search, Filter, Download, Plus, Grid, List, Trash2, ChevronUp, ChevronDown,
  Eye, Edit, Phone, Mail, Calendar, ChevronLeft, X, MapPin, Briefcase, Clock,
  AlertTriangle, CheckCircle, AlertCircle, Info, UserPlus, RefreshCw, Menu,
  MoreHorizontal, Copy, UserX, ChevronsUpDown, ChevronsLeft, ChevronsRight,
  EyeOff, User, ChevronDown as ChevronDownIcon
} from 'lucide-vue-next'
import Sidebar from '@/components/Layout/Sidebar.vue'

// Mock API - Bu yerda haqiqiy API bilan almashtiring
const mockApi = {
  async get(url) {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
    
    if (url === '/managers') {
      return {
        data: [
          // {
          //   id: 1,
          //   name: 'Alisher Karimov',
          //   phone: '+998901234567',
          //   email: 'alisher@example.com',
          //   position: 'senior',
          //   status: 'active',
          //   address: 'Toshkent, Chilonzor tumani',
          //   created_at: '2024-01-15T10:30:00Z'
          // },
          // {
          //   id: 2,
          //   name: 'Malika Toshmatova',
          //   phone: '+998907654321',
          //   email: 'malika@example.com',
          //   position: 'junior',
          //   status: 'active',
          //   address: 'Toshkent, Yunusobod tumani',
          //   created_at: '2024-02-20T14:15:00Z'
          // },
          // {
          //   id: 3,
          //   name: 'Bobur Rahimov',
          //   phone: '+998909876543',
          //   email: '',
          //   position: 'assistant',
          //   status: 'inactive',
          //   address: 'Samarqand, Markaz tumani',
          //   created_at: '2024-03-10T09:45:00Z'
          // },
          // {
          //   id: 4,
          //   name: 'Nilufar Abdullayeva',
          //   phone: '+998905432109',
          //   email: 'nilufar@example.com',
          //   position: 'senior',
          //   status: 'active',
          //   address: 'Buxoro, Markaz tumani',
          //   created_at: '2024-01-05T16:20:00Z'
          // },
          // {
          //   id: 5,
          //   name: 'Jasur Tursunov',
          //   phone: '+998903456789',
          //   email: 'jasur@example.com',
          //   position: 'junior',
          //   status: 'suspended',
          //   address: 'Andijon, Markaz tumani',
          //   created_at: '2024-03-25T11:10:00Z'
          // }
        ]
      }
    }
    throw new Error('API endpoint not found')
  },

  async post(url, data) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (url === '/managers') {
      return {
        data: {
          id: Date.now(),
          ...data,
          created_at: new Date().toISOString()
        }
      }
    }
    throw new Error('API endpoint not found')
  },

  async put(url, data) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { data }
  },

  async delete(url) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }
}

export default {
  name: 'ManagerDashboard',
  components: {
    LayoutDashboard, Users, UserCheck, Truck, Store, TrendingUp, Package, Cookie, Settings, LogOut,
    ChevronRight, Search, Filter, Download, Plus, Grid, List, Trash2, ChevronUp, ChevronDown,
    Eye, Edit, Phone, Mail, Calendar, ChevronLeft, X, MapPin, Briefcase, Clock,
    AlertTriangle, CheckCircle, AlertCircle, Info, UserPlus, RefreshCw, Menu,
    MoreHorizontal, Copy, UserX, ChevronsUpDown, ChevronsLeft, ChevronsRight,
    EyeOff, User, ChevronDown: ChevronDownIcon,
    Sidebar
  },
  data() {
    return {
      // Data
      managers: [],
      filteredManagers: [],
      
      // UI State
      loading: false,
      formLoading: false,
      error: null,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      showFilter: false,
      showBulkActions: false,
      isEditing: false,
      viewMode: 'table', // 'table' or 'cards'
      showPassword: false,
      activeActionMenu: null,
      
      // Form Data
      currentManager: {
        name: '',
        phone: '',
        email: '',
        password: '',
        position: '',
        address: '',
        status: 'active'
      },
      viewingManager: {},
      deletingManager: {},
      formErrors: {},
      
      // Search & Filter
      searchQuery: '',
      filters: {
        senior: false,
        junior: false,
        assistant: false,
        active: false,
        inactive: false
      },
      
      // Sorting
      sortField: 'id',
      sortDirection: 'asc',
      
      // Selection
      selectedManagers: [],
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      
      // Notifications
      toasts: [],
      toastId: 0
    }
  },
  computed: {
    // Stats
    totalManagers() {
      return this.managers.length
    },
    activeManagers() {
      return this.managers.filter(m => m.status === 'active').length
    },
    newManagers() {
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      return this.managers.filter(m => {
        const createdDate = new Date(m.created_at)
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
      }).length
    },
    newManagersThisWeek() {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return this.managers.filter(m => new Date(m.created_at) > oneWeekAgo).length
    },
    newManagersGrowth() {
      const thisMonth = this.newManagers
      const lastMonth = this.managers.filter(m => {
        const createdDate = new Date(m.created_at)
        const lastMonthDate = new Date()
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
        return createdDate.getMonth() === lastMonthDate.getMonth() && 
               createdDate.getFullYear() === lastMonthDate.getFullYear()
      }).length
      
      if (lastMonth === 0) return thisMonth > 0 ? 100 : 0
      return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    },
    performance() {
      return Math.round((this.activeManagers / this.totalManagers) * 100) || 0
    },
    performanceChange() {
      // Mock performance change calculation
      return Math.floor(Math.random() * 20) - 10 // Random between -10 and +10
    },
    
    // Filters
    activeFiltersCount() {
      return Object.values(this.filters).filter(Boolean).length
    },
    hasActiveFilters() {
      return this.activeFiltersCount > 0
    },
    
    // Pagination
    totalPages() {
      return Math.ceil(this.filteredManagers.length / this.itemsPerPage)
    },
    paginatedManagers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredManagers.slice(start, end)
    },
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    },
    
    // Selection
    allSelected() {
      return this.paginatedManagers.length > 0 && 
             this.paginatedManagers.every(m => this.selectedManagers.includes(m.id))
    }
  },
  async mounted() {
    await this.loadManagers()
    this.setupEventListeners()
  },
  beforeUnmount() {
    this.removeEventListeners()
  },
  methods: {
    // Setup
    setupEventListeners() {
      document.addEventListener('click', this.handleOutsideClick)
      document.addEventListener('keydown', this.handleKeydown)
    },
    removeEventListeners() {
      document.removeEventListener('click', this.handleOutsideClick)
      document.removeEventListener('keydown', this.handleKeydown)
    },
    handleOutsideClick(event) {
      // Close dropdowns when clicking outside
      if (!event.target.closest('.filter-dropdown')) {
        this.showFilter = false
      }
      if (!event.target.closest('.action-dropdown')) {
        this.activeActionMenu = null
      }
      if (!event.target.closest('.user-profile')) {
        this.showUserMenu = false
      }
      if (!event.target.closest('.bulk-action-btn') && !event.target.closest('.bulk-actions-menu')) {
        this.showBulkActions = false
      }
    },
    handleKeydown(event) {
      // Handle keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault()
            this.$refs.searchInput?.focus()
            break
          case 'n':
            event.preventDefault()
            this.openCreateModal()
            break
        }
      }
      
      // Handle escape key
      if (event.key === 'Escape') {
        if (this.showModal) this.closeModal()
        if (this.showViewModal) this.closeViewModal()
        if (this.showDeleteModal) this.closeDeleteModal()
        if (this.showFilter) this.showFilter = false
        if (this.activeActionMenu) this.activeActionMenu = null
      }
    },
    
    // API Methods
    async loadManagers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await mockApi.get('/managers')
        this.managers = response.data
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', 'Ma\'lumotlar muvaffaqiyatli yuklandi', 'success')
      } catch (error) {
        console.error('Managerlarni yuklashda xatolik:', error)
        this.error = this.getErrorMessage(error)
        this.showToast('Xatolik', 'Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async saveManager() {
      if (!this.validateForm()) return
      
      this.formLoading = true
      
      try {
        let response
        
        if (this.isEditing) {
          response = await mockApi.put(`/managers/${this.currentManager.id}`, this.currentManager)
          const index = this.managers.findIndex(m => m.id === this.currentManager.id)
          if (index !== -1) {
            this.managers[index] = { ...this.managers[index], ...response.data }
          }
          this.showToast('Muvaffaqiyat', 'Manager muvaffaqiyatli yangilandi', 'success')
        } else {
          response = await mockApi.post('/managers', this.currentManager)
          this.managers.push(response.data)
          this.showToast('Muvaffaqiyat', 'Manager muvaffaqiyatli yaratildi', 'success')
        }
        
        this.applyFiltersAndSearch()
        this.closeModal()
      } catch (error) {
        console.error('Manager saqlashda xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    async confirmDelete() {
      this.formLoading = true
      
      try {
        await mockApi.delete(`/managers/${this.deletingManager.id}`)
        this.managers = this.managers.filter(m => m.id !== this.deletingManager.id)
        this.selectedManagers = this.selectedManagers.filter(id => id !== this.deletingManager.id)
        
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', 'Manager muvaffaqiyatli o\'chirildi', 'success')
        this.closeDeleteModal()
      } catch (error) {
        console.error('Manager o\'chirishda xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    async bulkDelete() {
      if (this.selectedManagers.length === 0) return
      
      const count = this.selectedManagers.length
      if (!confirm(`${count} ta managerni o'chirmoqchimisiz?`)) return
      
      this.formLoading = true
      
      try {
        // Simulate bulk delete
        await Promise.all(
          this.selectedManagers.map(id => mockApi.delete(`/managers/${id}`))
        )
        
        this.managers = this.managers.filter(m => !this.selectedManagers.includes(m.id))
        this.selectedManagers = []
        this.showBulkActions = false
        
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', `${count} ta manager o'chirildi`, 'success')
      } catch (error) {
        console.error('Bulk delete xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    async bulkStatusChange(status) {
      if (this.selectedManagers.length === 0) return
      
      const count = this.selectedManagers.length
      const statusName = this.getStatusName(status)
      
      if (!confirm(`${count} ta managerni ${statusName.toLowerCase()} holatiga o'tkazmoqchimisiz?`)) return
      
      this.formLoading = true
      
      try {
        // Simulate bulk status change
        await Promise.all(
          this.selectedManagers.map(id => 
            mockApi.put(`/managers/${id}`, { status })
          )
        )
        
        this.managers.forEach(manager => {
          if (this.selectedManagers.includes(manager.id)) {
            manager.status = status
          }
        })
        
        this.selectedManagers = []
        this.showBulkActions = false
        
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', `${count} ta manager holati o'zgartirildi`, 'success')
      } catch (error) {
        console.error('Bulk status change xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    async toggleManagerStatus(manager) {
      const newStatus = manager.status === 'active' ? 'inactive' : 'active'
      
      try {
        await mockApi.put(`/managers/${manager.id}`, { status: newStatus })
        manager.status = newStatus
        
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', 'Manager holati o\'zgartirildi', 'success')
      } catch (error) {
        console.error('Status o\'zgartirishda xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      }
      
      this.activeActionMenu = null
    },
    
    async duplicateManager(manager) {
      const duplicatedManager = {
        ...manager,
        name: `${manager.name} (nusxa)`,
        email: manager.email ? `copy_${manager.email}` : '',
        phone: '',
        password: ''
      }
      
      delete duplicatedManager.id
      delete duplicatedManager.created_at
      
      this.currentManager = duplicatedManager
      this.isEditing = false
      this.showModal = true
      this.activeActionMenu = null
    },
    
    // Form Validation
    validateForm() {
      this.formErrors = {}
      
      if (!this.currentManager.name.trim()) {
        this.formErrors.name = 'Manager nomi kiritilishi shart'
      }
      
      if (!this.currentManager.phone.trim()) {
        this.formErrors.phone = 'Telefon raqami kiritilishi shart'
      } else if (!this.isValidPhone(this.currentManager.phone)) {
        this.formErrors.phone = 'Telefon raqami noto\'g\'ri formatda'
      }
      
      if (this.currentManager.email && !this.isValidEmail(this.currentManager.email)) {
        this.formErrors.email = 'Email manzili noto\'g\'ri formatda'
      }
      
      if (!this.currentManager.position) {
        this.formErrors.position = 'Lavozim tanlanishi shart'
      }
      
      if (!this.isEditing && !this.currentManager.password.trim()) {
        this.formErrors.password = 'Parol kiritilishi shart'
      } else if (this.currentManager.password && this.currentManager.password.length < 6) {
        this.formErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
      }
      
      return Object.keys(this.formErrors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isValidPhone(phone) {
      const phoneRegex = /^\+998\d{9}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    },
    
    formatPhoneInput(event) {
      let value = event.target.value.replace(/\D/g, '')
      
      if (!value.startsWith('998')) {
        value = '998' + value
      }
      
      if (value.length > 12) {
        value = value.slice(0, 12)
      }
      
      // Format: +998 90 123 45 67
      if (value.length >= 3) {
        value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + 
                value.slice(5, 8) + ' ' + value.slice(8, 10) + ' ' + value.slice(10, 12)
      }
      
      this.currentManager.phone = value.trim()
    },
    
    // Error handling
    getErrorMessage(error) {
      if (error.response?.data?.message) {
        return error.response.data.message
      } else if (error.response?.data?.error) {
        return error.response.data.error
      } else if (error.message) {
        return error.message
      } else {
        return 'Noma\'lum xatolik yuz berdi'
      }
    },
    
    // Search & Filter
    handleSearch() {
      this.applyFiltersAndSearch()
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.applyFiltersAndSearch()
    },
    
    applyFiltersAndSearch() {
      let filtered = [...this.managers]
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(manager =>
          manager.name.toLowerCase().includes(query) ||
          manager.phone.includes(query) ||
          (manager.email && manager.email.toLowerCase().includes(query))
        )
      }
      
      // Position filters
      const positionFilters = ['senior', 'junior', 'assistant'].filter(key => this.filters[key])
      if (positionFilters.length > 0) {
        filtered = filtered.filter(manager => positionFilters.includes(manager.position))
      }
      
      // Status filters
      const statusFilters = ['active', 'inactive'].filter(key => this.filters[key])
      if (statusFilters.length > 0) {
        filtered = filtered.filter(manager => statusFilters.includes(manager.status))
      }
      
      this.filteredManagers = filtered
      this.currentPage = 1
      this.applySorting()
    },
    
    applyFilters() {
      this.applyFiltersAndSearch()
    },
    
    toggleFilter() {
      this.showFilter = !this.showFilter
    },
    
    clearFilters() {
      this.filters = {
        senior: false,
        junior: false,
        assistant: false,
        active: false,
        inactive: false
      }
      this.applyFiltersAndSearch()
      this.showFilter = false
    },
    
    clearSearchAndFilters() {
      this.searchQuery = ''
      this.clearFilters()
    },
    
    filterByStatus(status) {
      this.clearFilters()
      if (status !== 'all') {
        if (status === 'new') {
          // Filter by this month
          const thisMonth = new Date().getMonth()
          const thisYear = new Date().getFullYear()
          this.filteredManagers = this.managers.filter(m => {
            const createdDate = new Date(m.created_at)
            return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
          })
          this.currentPage = 1
          return
        } else {
          this.filters[status] = true
        }
      }
      this.applyFiltersAndSearch()
    },
    
    // Sorting
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
      
      this.applySorting()
    },
    
    applySorting() {
      this.filteredManagers.sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]
        
        if (this.sortField === 'created_at') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1
        return 0
      })
    },
    
    // Selection
    toggleSelect(managerId) {
      const index = this.selectedManagers.indexOf(managerId)
      if (index > -1) {
        this.selectedManagers.splice(index, 1)
      } else {
        this.selectedManagers.push(managerId)
      }
    },
    
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedManagers = this.selectedManagers.filter(id =>
          !this.paginatedManagers.some(m => m.id === id)
        )
      } else {
        this.paginatedManagers.forEach(manager => {
          if (!this.selectedManagers.includes(manager.id)) {
            this.selectedManagers.push(manager.id)
          }
        })
      }
    },
    
    // View Toggle
    toggleView() {
      this.viewMode = this.viewMode === 'table' ? 'cards' : 'table'
    },
    
    // Action Menu
    toggleActionMenu(managerId) {
      this.activeActionMenu = this.activeActionMenu === managerId ? null : managerId
    },
    
    // Pagination
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== '...') {
        this.currentPage = page
      }
    },
    
    changeItemsPerPage() {
      this.currentPage = 1
      this.applyFiltersAndSearch()
    },
    
    // Modal Management
    openCreateModal() {
      this.isEditing = false
      this.currentManager = {
        name: '',
        phone: '',
        email: '',
        password: '',
        position: '',
        address: '',
        status: 'active'
      }
      this.formErrors = {}
      this.showModal = true
    },
    
    editManager(manager) {
      this.isEditing = true
      this.currentManager = { ...manager, password: '' }
      this.formErrors = {}
      this.showModal = true
      this.closeViewModal()
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
      this.formErrors = {}
    },
    
    closeViewModal() {
      this.showViewModal = false
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    
    // Export
    exportData() {
      const csvContent = this.generateCSV()
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `managers_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      this.showToast('Muvaffaqiyat', 'Ma\'lumotlar CSV formatida eksport qilindi', 'success')
    },
    
    generateCSV() {
      const headers = ['ID', 'Ismi', 'Telefon', 'Email', 'Lavozimi', 'Holati', 'Sana']
      const rows = this.filteredManagers.map(m => [
        m.id,
        `"${m.name}"`,
        m.phone,
        m.email || '',
        this.getPositionName(m.position),
        this.getStatusName(m.status),
        this.formatDate(m.created_at)
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    },
    
    // Utility Functions
    getInitials(name) {
      return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
    },
    
    getAvatarColor(name) {
      const colors = [
        '#4f46e5', '#059669', '#dc2626', '#d97706', '#7c3aed',
        '#db2777', '#0891b2', '#65a30d', '#dc2626', '#ea580c'
      ]
      const index = name.charCodeAt(0) % colors.length
      return colors[index]
    },
    
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
    
    formatDateTime(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    formatPhone(phone) {
      if (!phone) return 'N/A'
      // Format: +998 90 123 45 67
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 12 && cleaned.startsWith('998')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
      }
      return phone
    },
    
    getPositionName(position) {
      const positions = {
        senior: 'Senior Manager',
        junior: 'Junior Manager',
        assistant: 'Assistant Manager'
      }
      return positions[position] || position
    },
    
    getPositionClass(position) {
      return position
    },
    
    getStatusName(status) {
      const statuses = {
        active: 'Faol',
        inactive: 'Nofaol',
        suspended: 'To\'xtatilgan'
      }
      return statuses[status] || status
    },
    
    getWorkExperience(startDate) {
      if (!startDate) return 'N/A'
      
      const start = new Date(startDate)
      const now = new Date()
      const diffTime = Math.abs(now - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) {
        return `${diffDays} kun`
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} oy`
      } else {
        const years = Math.floor(diffDays / 365)
        const months = Math.floor((diffDays % 365) / 30)
        return `${years} yil ${months} oy`
      }
    },
    
    // Toast Notifications
    showToast(title, message, type = 'success') {
      const toast = {
        id: ++this.toastId,
        title,
        message,
        type
      }
      
      this.toasts.push(toast)
      
      setTimeout(() => {
        this.removeToast(toast.id)
      }, 5000)
    },
    
    removeToast(id) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* SIDEBAR STYLES NI OLIB TASHLANG */

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px; /* O'zingizning sidebar kengligiga qarab o'zgartiring */
  padding: 24px;
  overflow-x: auto;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  margin-right: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mobile-menu-btn:hover {
  background: #f9fafb;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 24px;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.breadcrumb-separator {
  width: 16px;
  height: 16px;
}

.breadcrumb-current {
  color: #4f46e5;
  font-weight: 500;
}

.header-right {
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Search Box */
.search-box {
  position: relative;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-clear:hover {
  background: #f1f5f9;
}

/* Filter Dropdown */
.filter-dropdown {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-icon {
  width: 16px;
  height: 16px;
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.filter-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 250px;
  z-index: 50;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.filter-item {
  padding: 4px 0;
}

.filter-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.filter-actions {
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
  margin-top: 12px;
}

.filter-clear {
  width: 100%;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-clear:hover {
  background: #f1f5f9;
}

/* Action Buttons */
.export-btn, .create-btn, .refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn, .refresh-btn {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.export-btn:hover, .refresh-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.export-btn:disabled, .refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.create-btn {
  background: #4f46e5;
  color: white;
}

.create-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.export-icon, .create-icon, .refresh-icon {
  width: 16px;
  height: 16px;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.total {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-icon.active {
  background: #dcfce7;
  color: #16a34a;
}

.stat-icon.new {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon.performance {
  background: #fce7f3;
  color: #be185d;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.stat-change.positive {
  color: #16a34a;
}

.stat-change.negative {
  color: #dc2626;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.table-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.table-count {
  font-size: 14px;
  color: #64748b;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.bulk-action-btn, .view-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-action-btn:hover:not(:disabled), .view-toggle-btn:hover {
  background: #f9fafb;
}

.bulk-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bulk-actions-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 180px;
  z-index: 50;
}

.bulk-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
}

.bulk-action-item:hover {
  background: #f1f5f9;
}

.bulk-action-item.danger {
  color: #dc2626;
}

.bulk-action-item.danger:hover {
  background: #fef2f2;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 24px;
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
  margin: 0 auto 24px;
}

.error-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.error-state p {
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #4338ca;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-illustration {
  margin-bottom: 24px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin: 0 auto;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-action-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.managers-table {
  width: 100%;
  border-collapse: collapse;
}

.managers-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.managers-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.managers-table th.sortable:hover {
  background: #f1f5f9;
}

.sort-icon {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  vertical-align: middle;
}

.sort-icon.inactive {
  opacity: 0.3;
}

.managers-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  vertical-align: middle;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row.selected {
  background: #eff6ff;
}

.checkbox-column, .actions-column {
  width: 50px;
}

.table-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
}

.row-number {
  font-weight: 500;
  color: #64748b;
  width: 60px;
}

.manager-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.manager-avatar {
  width: 40px;
  height: 40px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.manager-avatar.large {
  width: 60px;
  height: 60px;
  font-size: 18px;
}

.manager-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.manager-name {
  font-weight: 500;
  color: #1e293b;
}

.manager-id {
  font-size: 12px;
  color: #64748b;
}

.phone-cell, .email-cell {
  color: #374151;
  min-width: 150px;
}

.phone-link, .email-link {
  color: #4f46e5;
  text-decoration: none;
}

.phone-link:hover, .email-link:hover {
  text-decoration: underline;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.position-badge.senior {
  background: #dcfce7;
  color: #166534;
}

.position-badge.junior {
  background: #dbeafe;
  color: #1e40af;
}

.position-badge.assistant {
  background: #fef3c7;
  color: #92400e;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #374151;
}

.status-badge.suspended {
  background: #fee2e2;
  color: #dc2626;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.date-cell {
  color: #64748b;
  min-width: 100px;
}

.actions-cell {
  width: 140px;
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
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
  background: transparent;
}

.action-btn:hover {
  background: #f1f5f9;
}

.action-btn.view {
  color: #059669;
}

.action-btn.edit {
  color: #d97706;
}

.action-btn.delete {
  color: #dc2626;
}

.action-btn.more {
  color: #64748b;
}

.action-dropdown {
  position: relative;
}

.action-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 160px;
  z-index: 50;
}

.action-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
}

.action-menu-item:hover {
  background: #f1f5f9;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 24px;
}

.manager-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.manager-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.manager-card.selected {
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px #4f46e5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.card-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #f8fafc;
  color: #64748b;
}

.card-action-btn:hover {
  background: #f1f5f9;
}

.card-action-btn.delete {
  color: #dc2626;
}

.card-content {
  text-align: center;
}

.card-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.card-position {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

.card-footer {
  display: flex;
  justify-content: center;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
}

.pagination-number {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination-number:disabled {
  cursor: default;
  opacity: 0.5;
}

.pagination-number.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.items-per-page select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.pagination-summary {
  font-size: 14px;
  color: #64748b;
}

/* Modal Styles */
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
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.large {
  max-width: 800px;
}

.modal.small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
}

/* Form Styles */
.modal-form {
  padding: 0 24px 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #ef4444;
}

.form-error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4338ca;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-primary:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* View Modal */
.view-content {
  padding: 0 24px 24px;
}

.manager-profile {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.profile-position {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.profile-actions {
  display: flex;
  gap: 8px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.detail-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.detail-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.detail-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-item > div {
  flex: 1;
}

.detail-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.detail-value {
  display: block;
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  text-decoration: none;
}

.detail-value:hover {
  text-decoration: underline;
}

.detail-value.no-data {
  color: #9ca3af;
  font-style: italic;
}

/* Delete Modal */
.delete-content {
  padding: 0 24px;
  text-align: center;
}

.delete-icon {
  width: 64px;
  height: 64px;
  color: #f59e0b;
  margin: 0 auto 20px;
}

.delete-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.delete-content p {
  color: #64748b;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.warning-text {
  color: #dc2626;
  font-weight: 500;
  font-size: 14px;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  min-width: 300px;
  max-width: 400px;
}

.toast.success {
  border-left-color: #10b981;
}

.toast.error {
  border-left-color: #ef4444;
}

.toast.info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast.success .toast-icon {
  color: #10b981;
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast.info .toast-icon {
  color: #3b82f6;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.toast-message {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: #f1f5f9;
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive Design */
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0);
    position: fixed;
  }
  
  .main-content {
    margin-left: 280px;
  }
  
  .mobile-menu-btn {
    display: none;
  }
  
  .sidebar-overlay {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .sidebar-toggle {
    display: block;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .search-box {
    min-width: auto;
    flex: 1;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .managers-table {
    min-width: 800px;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .pagination-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
  
  .modal {
    margin: 10px;
    width: calc(100% - 20px);
  }
  
  .toast-container {
    left: 10px;
    right: 10px;
    top: 10px;
  }
  
  .toast {
    min-width: auto;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .manager-profile {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
}
</style>
