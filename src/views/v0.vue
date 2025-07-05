<template>
    <div class="dashboard-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header">
          <h2 class="logo">SAFO-NON</h2>
        </div>
  
        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('dashboard')">
                <LayoutDashboard class="nav-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link active" @click="setActiveMenu('managers')">
                <Users class="nav-icon" />
                <span>Managerlar</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('nonvoylar')">
                <UserCheck class="nav-icon" />
                <span>Nonvoylar</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('yetkazuvchilar')">
                <Truck class="nav-icon" />
                <span>Yetkazuvchilar</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('dokonlar')">
                <Store class="nav-icon" />
                <span>Do'konlar</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('chiqimlar')">
                <TrendingUp class="nav-icon" />
                <span>Chiqimlar</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('omborxona')">
                <Package class="nav-icon" />
                <span>Omborxona</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('non-turlari')">
                <Cookie class="nav-icon" />
                <span>Non turlari</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="setActiveMenu('sozlamalar')">
                <Settings class="nav-icon" />
                <span>Sozlamalar</span>
              </a>
            </li>
          </ul>
        </nav>
  
        <!-- User Profile -->
        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">A</div>
            <span class="user-name">Admin</span>
            <LogOut class="logout-icon" @click="logout" />
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <div class="content-header">
          <div class="header-left">
            <h1 class="page-title">Boshqaruvchilar</h1>
            <div class="breadcrumb">
              <span>Dashboard</span>
              <ChevronRight class="breadcrumb-separator" />
              <span class="breadcrumb-current">Managerlar</span>
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
                  @input="filterManagers"
                  class="search-input"
                />
              </div>
              <!-- Filter -->
              <div class="filter-dropdown">
                <button class="filter-btn" @click="toggleFilter">
                  <Filter class="filter-icon" />
                  Filter
                </button>
                <div v-if="showFilter" class="filter-menu">
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.senior" @change="filterManagers" />
                      Senior Manager
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.junior" @change="filterManagers" />
                      Junior Manager
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.assistant" @change="filterManagers" />
                      Assistant Manager
                    </label>
                  </div>
                </div>
              </div>
              <!-- Export -->
              <button class="export-btn" @click="exportData">
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
          <div class="stat-card">
            <div class="stat-icon total">
              <Users />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalManagers }}</h3>
              <p class="stat-label">Jami Managerlar</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon active">
              <UserCheck />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ activeManagers }}</h3>
              <p class="stat-label">Faol Managerlar</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon new">
              <UserPlus />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ newManagers }}</h3>
              <p class="stat-label">Yangi (Bu oy)</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon performance">
              <TrendingUp />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ performance }}%</h3>
              <p class="stat-label">Samaradorlik</p>
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
              <button class="bulk-action-btn" :disabled="selectedManagers.length === 0" @click="bulkDelete">
                <Trash2 />
                O'chirish ({{ selectedManagers.length }})
              </button>
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
            <h3 class="empty-title">Hozircha boshqaruvchilar mavjud emas</h3>
            <p class="empty-description">
              {{ searchQuery ? 'Qidiruv bo\'yicha natija topilmadi' : 'Yangi manager qo\'shish uchun yuqoridagi tugmani bosing' }}
            </p>
            <button v-if="!searchQuery" class="empty-action-btn" @click="openCreateModal">
              <Plus />
              Manager yaratish
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
                  </th>
                  <th class="sortable" @click="sortBy('name')">
                    Ismi
                    <ChevronUp v-if="sortField === 'name' && sortDirection === 'asc'" class="sort-icon" />
                    <ChevronDown v-else-if="sortField === 'name' && sortDirection === 'desc'" class="sort-icon" />
                  </th>
                  <th>Telefon</th>
                  <th>Email</th>
                  <th class="sortable" @click="sortBy('position')">
                    Lavozimi
                    <ChevronUp v-if="sortField === 'position' && sortDirection === 'asc'" class="sort-icon" />
                    <ChevronDown v-else-if="sortField === 'position' && sortDirection === 'desc'" class="sort-icon" />
                  </th>
                  <th>Holati</th>
                  <th class="sortable" @click="sortBy('created_at')">
                    Sana
                    <ChevronUp v-if="sortField === 'created_at' && sortDirection === 'asc'" class="sort-icon" />
                    <ChevronDown v-else-if="sortField === 'created_at' && sortDirection === 'desc'" class="sort-icon" />
                  </th>
                  <th class="actions-column">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(manager, index) in paginatedManagers" :key="manager.id" class="table-row">
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
                    <div class="manager-avatar">{{ getInitials(manager.name) }}</div>
                    <div class="manager-details">
                      <span class="manager-name">{{ manager.name }}</span>
                      <span class="manager-id">ID: {{ manager.id }}</span>
                    </div>
                  </td>
                  <td class="phone-cell">{{ manager.phone }}</td>
                  <td class="email-cell">{{ manager.email || 'N/A' }}</td>
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
                  <td class="date-cell">{{ formatDate(manager.created_at) }}</td>
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Card View -->
          <div v-else class="cards-grid">
            <div v-for="manager in paginatedManagers" :key="manager.id" class="manager-card">
              <div class="card-header">
                <div class="manager-avatar large">{{ getInitials(manager.name) }}</div>
                <div class="card-actions">
                  <button class="card-action-btn" @click="viewManager(manager)">
                    <Eye />
                  </button>
                  <button class="card-action-btn" @click="editManager(manager)">
                    <Edit />
                  </button>
                  <button class="card-action-btn delete" @click="deleteManager(manager)">
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
                    <span>{{ manager.phone }}</span>
                  </div>
                  <div class="info-item">
                    <Mail class="info-icon" />
                    <span>{{ manager.email || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <Calendar class="info-icon" />
                    <span>{{ formatDate(manager.created_at) }}</span>
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
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Telefon raqami *</label>
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
                <label class="form-label">Lavozimi *</label>
                <select class="form-select" v-model="currentManager.position" required>
                  <option value="">Lavozimni tanlang</option>
                  <option value="senior">Senior Manager</option>
                  <option value="junior">Junior Manager</option>
                  <option value="assistant">Assistant Manager</option>
                </select>
              </div>
            </div>
  
            <div class="form-group">
              <label class="form-label">Parol {{ isEditing ? '' : '*' }}</label>
              <input 
                type="password" 
                class="form-input" 
                v-model="currentManager.password"
                :placeholder="isEditing ? 'Yangi parol (bo\'sh qoldiring agar o\'zgartirmasangiz)' : 'Parolni kiriting'"
                :required="!isEditing"
              />
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
              <div class="profile-avatar">{{ getInitials(viewingManager.name) }}</div>
              <div class="profile-info">
                <h2 class="profile-name">{{ viewingManager.name }}</h2>
                <p class="profile-position">{{ getPositionName(viewingManager.position) }}</p>
                <span :class="['status-badge', viewingManager.status]">
                  <div class="status-dot"></div>
                  {{ getStatusName(viewingManager.status) }}
                </span>
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
                      <span class="detail-value">{{ viewingManager.phone }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <Mail class="detail-icon" />
                    <div>
                      <span class="detail-label">Email</span>
                      <span class="detail-value">{{ viewingManager.email || 'Kiritilmagan' }}</span>
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
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../axios'
  import { 
    LayoutDashboard, Users, UserCheck, Truck, Store, TrendingUp, Package, Cookie, Settings, LogOut,
    ChevronRight, Search, Filter, Download, Plus, Grid, List, Trash2, ChevronUp, ChevronDown,
    Eye, Edit, Phone, Mail, Calendar, ChevronLeft, X, MapPin, Briefcase, Clock,
    AlertTriangle, CheckCircle, AlertCircle, Info, UserPlus, RefreshCw
  } from 'lucide-vue-next'
  
  // Axios konfiguratsiyasi - siz o'zingizning API URL ni qo'yasiz
  const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'https://api.kodx.uz', // Bu yerga o'zingizning API URL ni qo'ying
  
    // baseUrl:  'https://api.kodx.uz',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  
  // Request interceptor - token qo'shish uchun
  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  
  // Response interceptor - xatoliklarni handle qilish uchun
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Token muddati tugagan bo'lsa
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
  
  export default {
    name: 'ManagerDashboard',
    components: {
      LayoutDashboard, Users, UserCheck, Truck, Store, TrendingUp, Package, Cookie, Settings, LogOut,
      ChevronRight, Search, Filter, Download, Plus, Grid, List, Trash2, ChevronUp, ChevronDown,
      Eye, Edit, Phone, Mail, Calendar, ChevronLeft, X, MapPin, Briefcase, Clock,
      AlertTriangle, CheckCircle, AlertCircle, Info, UserPlus, RefreshCw
    },
    data() {
      return {
        // Navigation
        activeMenu: 'managers',
        
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
        isEditing: false,
        viewMode: 'table', // 'table' or 'cards'
        
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
        
        // Search & Filter
        searchQuery: '',
        filters: {
          senior: false,
          junior: false,
          assistant: false
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
      performance() {
        return Math.round((this.activeManagers / this.totalManagers) * 100) || 0
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
    },
    methods: {
      // API Methods
      async loadManagers() {
        this.loading = true
        this.error = null
        
        try {
          const response = await api.get('/managers')
          this.managers = response.data.data || response.data
          this.filteredManagers = [...this.managers]
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
        this.formLoading = true
        
        try {
          let response
          
          if (this.isEditing) {
            // PUT request for updating
            response = await api.put(`/managers/${this.currentManager.id}`, this.currentManager)
            
            // Update local data
            const index = this.managers.findIndex(m => m.id === this.currentManager.id)
            if (index !== -1) {
              this.managers[index] = response.data.data || response.data
            }
            
            this.showToast('Muvaffaqiyat', 'Manager muvaffaqiyatli yangilandi', 'success')
          } else {
            // POST request for creating
            response = await api.post('/managers', this.currentManager)
            
            // Add to local data
            this.managers.push(response.data.data || response.data)
            
            this.showToast('Muvaffaqiyat', 'Manager muvaffaqiyatli yaratildi', 'success')
          }
          
          this.filterManagers()
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
          await api.delete(`/managers/${this.deletingManager.id}`)
          
          // Remove from local data
          this.managers = this.managers.filter(m => m.id !== this.deletingManager.id)
          this.selectedManagers = this.selectedManagers.filter(id => id !== this.deletingManager.id)
          
          this.filterManagers()
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
          // Bulk delete API call
          await api.post('/managers/bulk-delete', {
            ids: this.selectedManagers
          })
          
          // Remove from local data
          this.managers = this.managers.filter(m => !this.selectedManagers.includes(m.id))
          this.selectedManagers = []
          
          this.filterManagers()
          this.showToast('Muvaffaqiyat', `${count} ta manager o'chirildi`, 'success')
        } catch (error) {
          console.error('Bulk delete xatolik:', error)
          this.showToast('Xatolik', this.getErrorMessage(error), 'error')
        } finally {
          this.formLoading = false
        }
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
      
      // Navigation
      setActiveMenu(menu) {
        this.activeMenu = menu
      },
      
      logout() {
        localStorage.removeItem('auth_token')
        this.showToast('Muvaffaqiyat', 'Tizimdan muvaffaqiyatli chiqildi', 'success')
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      },
      
      // Search & Filter
      filterManagers() {
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
        
        // Position filter
        const activeFilters = Object.keys(this.filters).filter(key => this.filters[key])
        if (activeFilters.length > 0) {
          filtered = filtered.filter(manager => activeFilters.includes(manager.position))
        }
        
        this.filteredManagers = filtered
        this.currentPage = 1
      },
      
      toggleFilter() {
        this.showFilter = !this.showFilter
      },
      
      // Sorting
      sortBy(field) {
        if (this.sortField === field) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortField = field
          this.sortDirection = 'asc'
        }
        
        this.filteredManagers.sort((a, b) => {
          let aVal = a[field]
          let bVal = b[field]
          
          if (field === 'created_at') {
            aVal = new Date(aVal)
            bVal = new Date(bVal)
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
      
      // Pagination
      goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page
        }
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
      
      formatDate(date) {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('uz-UZ', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
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
  /* Previous styles remain the same... */
  * {
    box-sizing: border-box;
  }
  
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* Sidebar Styles */
  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
  }
  
  .sidebar-header {
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .logo {
    font-size: 24px;
    font-weight: 700;
    color: #4f46e5;
    margin: 0;
    letter-spacing: -0.5px;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 16px 0;
    overflow-y: auto;
  }
  
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    margin-bottom: 4px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    color: #64748b;
    text-decoration: none;
    transition: all 0.2s;
    border-radius: 0;
  }
  
  .nav-link:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
  
  .nav-link.active {
    background-color: #4f46e5;
    color: white;
    font-weight: 500;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  .sidebar-footer {
    padding: 16px 24px;
    border-top: 1px solid #e2e8f0;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .user-profile:hover {
    background-color: #f1f5f9;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    background: #4f46e5;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }
  
  .user-name {
    flex: 1;
    font-weight: 500;
    color: #334155;
  }
  
  .logout-icon {
    width: 16px;
    height: 16px;
    color: #64748b;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 280px;
    padding: 24px;
    overflow-x: auto;
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
  }
  
  .filter-btn:hover {
    background: #f9fafb;
  }
  
  .filter-icon {
    width: 16px;
    height: 16px;
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
    padding: 8px;
    min-width: 200px;
    z-index: 50;
  }
  
  .filter-item {
    padding: 8px;
  }
  
  .filter-item label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
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
  
  .refresh-btn:disabled {
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
    margin: 0;
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
  
  .managers-table td {
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    vertical-align: middle;
  }
  
  .table-row:hover {
    background: #f8fafc;
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
    width: 120px;
  }
  
  .action-buttons {
    display: flex;
    gap: 4px;
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
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
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
  
  .pagination-number:hover {
    background: #f9fafb;
  }
  
  .pagination-number.active {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
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
  
  .form-textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
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
    animation: slideInRight 0.3s ease;
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
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;
    }
    
    .main-content {
      margin-left: 0;
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
    .dashboard-container {
      flex-direction: column;
    }
    
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
  }
  </style>