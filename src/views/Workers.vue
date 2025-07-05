<!-- <template>
    <div class="main-layout">
      <Sidebar />
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">Nonvoylar</h1>
          <button class="btn btn-primary" @click="openCreateModal">
            <PlusIcon />
            
          </button>
        </div>
  
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
          // {
          //   id: 1,
          //   name: 'Bobur Karimov',
          //   phone: '+998 90 123 45 67',
          //   passport: 'AA 1234567',
          //   birthDate: '1990-05-15',
          //   startDate: '2024-01-15',
          //   salary: 3000000,
          //   status: 'active',
          //   position: 'baker',
          //   address: 'Toshkent shahar, Chilonzor tumani, 5-kvartal',
          //   notes: 'Tajribali nonvoy'
          // },
          // {
          //   id: 2,
          //   name: 'Sardor Umarov',
          //   phone: '+998 91 234 56 78',
          //   passport: 'AB 2345678',
          //   birthDate: '1985-08-22',
          //   startDate: '2023-11-10',
          //   salary: 2500000,
          //   status: 'active',
          //   position: 'assistant',
          //   address: 'Toshkent shahar, Yashnobod tumani, 12-kvartal',
          //   notes: 'Yaxshi yordamchi'
          // }
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
        return new Intl.NumberFormat('uz-UZ').format(salary) + ' so`m'
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
   -->



























   <template>
    <div class="dashboard-container">
      <Sidebar />
      
      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <div class="content-header">
          <div class="header-left">
            <div>
              <h1 class="page-title">Nonvoylar</h1>
              <div class="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight class="breadcrumb-separator" />
                <span class="breadcrumb-current">Nonvoylar</span>
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
                  placeholder="Nonvoy qidirish..."
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
                        <input type="checkbox" v-model="filters.baker" @change="applyFilters" />
                        Nonvoy
                      </label>
                    </div>
                    <div class="filter-item">
                      <label>
                        <input type="checkbox" v-model="filters.assistant" @change="applyFilters" />
                        Yordamchi
                      </label>
                    </div>
                    <div class="filter-item">
                      <label>
                        <input type="checkbox" v-model="filters.supervisor" @change="applyFilters" />
                        Nazoratchi
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
              <button class="export-btn" @click="exportData" :disabled="filteredWorkers.length === 0">
                <Download class="export-icon" />
                Export
              </button>
              
              <!-- Refresh -->
              <button class="refresh-btn" @click="loadWorkers" :disabled="loading">
                <RefreshCw class="refresh-icon" :class="{ 'spinning': loading }" />
                Yangilash
              </button>
              
              <!-- Create Button -->
              <button class="create-btn" @click="openCreateModal">
                <Plus class="create-icon" />
                Nonvoy qo'shish
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
              <h3 class="stat-number">{{ totalWorkers }}</h3>
              <p class="stat-label">Jami Nonvoylar</p>
              <span class="stat-change positive">+{{ newWorkersThisWeek }} bu hafta</span>
            </div>
          </div>
          <div class="stat-card" @click="filterByStatus('active')">
            <div class="stat-icon active">
              <UserCheck />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ activeWorkers }}</h3>
              <p class="stat-label">Faol Nonvoylar</p>
              <span class="stat-change">{{ Math.round((activeWorkers / totalWorkers) * 100) }}% faol</span>
            </div>
          </div>
          <div class="stat-card" @click="filterByStatus('new')">
            <div class="stat-icon new">
              <UserPlus />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ newWorkers }}</h3>
              <p class="stat-label">Yangi (Bu oy)</p>
              <span class="stat-change positive">+{{ newWorkersGrowth }}%</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon salary">
              <DollarSign />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ averageSalary }}</h3>
              <p class="stat-label">O'rtacha maosh</p>
              <span class="stat-change" :class="{ positive: salaryChange > 0, negative: salaryChange < 0 }">
                {{ salaryChange > 0 ? '+' : '' }}{{ salaryChange }}%
              </span>
            </div>
          </div>
        </div>
  
        <!-- Table Container -->
        <div class="table-container">
          <!-- Table Header -->
          <div class="table-header">
            <div class="table-title">
              <h3>Nonvoylar ro'yxati</h3>
              <span class="table-count">{{ filteredWorkers.length }} ta nonvoy</span>
            </div>
            <div class="table-actions">
              <button 
                class="bulk-action-btn" 
                :disabled="selectedWorkers.length === 0" 
                @click="showBulkActions = !showBulkActions"
              >
                <MoreHorizontal />
                Amallar ({{ selectedWorkers.length }})
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
            <button class="retry-btn" @click="loadWorkers">
              <RefreshCw />
              Qayta urinish
            </button>
          </div>
  
          <!-- Empty State -->
          <div v-else-if="filteredWorkers.length === 0 && !loading" class="empty-state">
            <div class="empty-illustration">
              <Users class="empty-icon" />
            </div>
            <h3 class="empty-title">
              {{ searchQuery || hasActiveFilters ? 'Natija topilmadi' : 'Hozircha nonvoylar mavjud emas' }}
            </h3>
            <p class="empty-description">
              {{ searchQuery || hasActiveFilters 
                ? 'Qidiruv yoki filtr shartlariga mos nonvoy topilmadi' 
                : 'Yangi nonvoy qo\'shish uchun yuqoridagi tugmani bosing' 
              }}
            </p>
            <button v-if="!searchQuery && !hasActiveFilters" class="empty-action-btn" @click="openCreateModal">
              <Plus />
              Nonvoy qo'shish
            </button>
            <button v-else class="empty-action-btn" @click="clearSearchAndFilters">
              <X />
              Filtrlarni tozalash
            </button>
          </div>
  
          <!-- Table View -->
          <div v-else-if="viewMode === 'table'" class="table-wrapper">
            <table class="workers-table">
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
                  <th>Passport</th>
                  <th class="sortable" @click="sortBy('position')">
                    Lavozimi
                    <ChevronUp v-if="sortField === 'position' && sortDirection === 'asc'" class="sort-icon" />
                    <ChevronDown v-else-if="sortField === 'position' && sortDirection === 'desc'" class="sort-icon" />
                    <ChevronsUpDown v-else class="sort-icon inactive" />
                  </th>
                  <th class="sortable" @click="sortBy('salary')">
                    Maosh
                    <ChevronUp v-if="sortField === 'salary' && sortDirection === 'asc'" class="sort-icon" />
                    <ChevronDown v-else-if="sortField === 'salary' && sortDirection === 'desc'" class="sort-icon" />
                    <ChevronsUpDown v-else class="sort-icon inactive" />
                  </th>
                  <th>Holati</th>
                  <th class="sortable" @click="sortBy('startDate')">
                    Ish boshlagan sana
                    <ChevronUp v-if="sortField === 'startDate' && sortDirection === 'asc'" class="sort-icon" />
                    <ChevronDown v-else-if="sortField === 'startDate' && sortDirection === 'desc'" class="sort-icon" />
                    <ChevronsUpDown v-else class="sort-icon inactive" />
                  </th>
                  <th class="actions-column">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(worker, index) in paginatedWorkers" 
                  :key="worker.id" 
                  class="table-row"
                  :class="{ selected: selectedWorkers.includes(worker.id) }"
                >
                  <td>
                    <input 
                      type="checkbox"
                      :checked="selectedWorkers.includes(worker.id)"
                      @change="toggleSelect(worker.id)"
                      class="table-checkbox"
                    />
                  </td>
                  <td class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="worker-info">
                    <div class="worker-avatar" :style="{ backgroundColor: getAvatarColor(worker.name) }">
                      {{ getInitials(worker.name) }}
                    </div>
                    <div class="worker-details">
                      <span class="worker-name">{{ worker.name }}</span>
                      <span class="worker-id">ID: {{ worker.id }}</span>
                    </div>
                  </td>
                  <td class="phone-cell">
                    <a :href="`tel:${worker.phone}`" class="phone-link">{{ formatPhone(worker.phone) }}</a>
                  </td>
                  <td class="passport-cell">
                    <span class="passport-number">{{ worker.passport }}</span>
                  </td>
                  <td>
                    <span :class="['position-badge', getPositionClass(worker.position)]">
                      {{ getPositionName(worker.position) }}
                    </span>
                  </td>
                  <td class="salary-cell">
                    <span class="salary-amount">{{ formatSalary(worker.salary) }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', worker.status]">
                      <div class="status-dot"></div>
                      {{ getStatusName(worker.status) }}
                    </span>
                  </td>
                  <td class="date-cell">
                    <span :title="formatDateTime(worker.startDate)">
                      {{ formatDate(worker.startDate) }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="action-btn view" @click="viewWorker(worker)" title="Ko'rish">
                        <Eye />
                      </button>
                      <button class="action-btn edit" @click="editWorker(worker)" title="Tahrirlash">
                        <Edit />
                      </button>
                      <button class="action-btn delete" @click="deleteWorker(worker)" title="O'chirish">
                        <Trash2 />
                      </button>
                      <div class="action-dropdown" ref="actionDropdown">
                        <button class="action-btn more" @click="toggleActionMenu(worker.id)">
                          <MoreHorizontal />
                        </button>
                        <div v-if="activeActionMenu === worker.id" class="action-menu">
                          <button @click="duplicateWorker(worker)" class="action-menu-item">
                            <Copy />
                            Nusxalash
                          </button>
                          <button @click="toggleWorkerStatus(worker)" class="action-menu-item">
                            <UserCheck v-if="worker.status !== 'active'" />
                            <UserX v-else />
                            {{ worker.status === 'active' ? 'Nofaollashtirish' : 'Faollashtirish' }}
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
              v-for="worker in paginatedWorkers" 
              :key="worker.id" 
              class="worker-card"
              :class="{ selected: selectedWorkers.includes(worker.id) }"
            >
              <div class="card-header">
                <input 
                  type="checkbox"
                  :checked="selectedWorkers.includes(worker.id)"
                  @change="toggleSelect(worker.id)"
                  class="card-checkbox"
                />
                <div class="worker-avatar large" :style="{ backgroundColor: getAvatarColor(worker.name) }">
                  {{ getInitials(worker.name) }}
                </div>
                <div class="card-actions">
                  <button class="card-action-btn" @click="viewWorker(worker)" title="Ko'rish">
                    <Eye />
                  </button>
                  <button class="card-action-btn" @click="editWorker(worker)" title="Tahrirlash">
                    <Edit />
                  </button>
                  <button class="card-action-btn delete" @click="deleteWorker(worker)" title="O'chirish">
                    <Trash2 />
                  </button>
                </div>
              </div>
              <div class="card-content">
                <h4 class="card-name">{{ worker.name }}</h4>
                <p class="card-position">{{ getPositionName(worker.position) }}</p>
                <div class="card-info">
                  <div class="info-item">
                    <Phone class="info-icon" />
                    <a :href="`tel:${worker.phone}`">{{ formatPhone(worker.phone) }}</a>
                  </div>
                  <div class="info-item">
                    <CreditCard class="info-icon" />
                    <span>{{ worker.passport }}</span>
                  </div>
                  <div class="info-item">
                    <DollarSign class="info-icon" />
                    <span>{{ formatSalary(worker.salary) }}</span>
                  </div>
                  <div class="info-item">
                    <Calendar class="info-icon" />
                    <span :title="formatDateTime(worker.startDate)">{{ formatDate(worker.startDate) }}</span>
                  </div>
                </div>
                <div class="card-footer">
                  <span :class="['status-badge', worker.status]">
                    <div class="status-dot"></div>
                    {{ getStatusName(worker.status) }}
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
              {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredWorkers.length) }} 
              / {{ filteredWorkers.length }} ta natija
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ isEditing ? 'Nonvoy tahrirlash' : 'Nonvoy qo\'shish' }}
            </h3>
            <button class="modal-close" @click="closeModal">
              <X />
            </button>
          </div>
          
          <form @submit.prevent="saveWorker" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nonvoy nomi *</label>
                <input 
                  type="text"
                  class="form-input"
                  v-model="currentWorker.name"
                  placeholder="Nonvoy nomini kiriting"
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
                  v-model="currentWorker.phone"
                  placeholder="+998 90 123 45 67"
                  required
                  :class="{ error: formErrors.phone }"
                  @input="formatPhoneInput"
                />
                <span v-if="formErrors.phone" class="form-error">{{ formErrors.phone }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Passport seriya va raqami *</label>
                <input 
                  type="text"
                  class="form-input"
                  v-model="currentWorker.passport"
                  placeholder="AA 1234567"
                  required
                  :class="{ error: formErrors.passport }"
                  @input="formatPassportInput"
                />
                <span v-if="formErrors.passport" class="form-error">{{ formErrors.passport }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Tug'ilgan sana *</label>
                <input 
                  type="date"
                  class="form-input"
                  v-model="currentWorker.birthDate"
                  required
                  :class="{ error: formErrors.birthDate }"
                />
                <span v-if="formErrors.birthDate" class="form-error">{{ formErrors.birthDate }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Ish boshlagan sana *</label>
                <input 
                  type="date"
                  class="form-input"
                  v-model="currentWorker.startDate"
                  required
                  :class="{ error: formErrors.startDate }"
                />
                <span v-if="formErrors.startDate" class="form-error">{{ formErrors.startDate }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Oylik maosh *</label>
                <input 
                  type="number"
                  class="form-input"
                  v-model="currentWorker.salary"
                  placeholder="0"
                  required
                  min="0"
                  :class="{ error: formErrors.salary }"
                />
                <span v-if="formErrors.salary" class="form-error">{{ formErrors.salary }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Lavozimi *</label>
                <select class="form-select" v-model="currentWorker.position" required :class="{ error: formErrors.position }">
                  <option value="">Lavozimni tanlang</option>
                  <option value="baker">Nonvoy</option>
                  <option value="assistant">Yordamchi</option>
                  <option value="supervisor">Nazoratchi</option>
                </select>
                <span v-if="formErrors.position" class="form-error">{{ formErrors.position }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Holati</label>
                <select class="form-select" v-model="currentWorker.status">
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Manzil *</label>
              <textarea 
                class="form-textarea"
                v-model="currentWorker.address"
                placeholder="To'liq manzilni kiriting"
                rows="3"
                required
                :class="{ error: formErrors.address }"
              ></textarea>
              <span v-if="formErrors.address" class="form-error">{{ formErrors.address }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Qo'shimcha ma'lumot</label>
              <textarea 
                class="form-textarea"
                v-model="currentWorker.notes"
                placeholder="Qo'shimcha ma'lumotlar..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeModal">
                Bekor qilish
              </button>
              <button type="submit" class="btn-primary" :disabled="formLoading">
                <div v-if="formLoading" class="loading-spinner small"></div>
                {{ formLoading ? 'Saqlanmoqda...' : (isEditing ? 'Yangilash' : 'Qo\'shish') }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- View Modal -->
      <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
        <div class="modal large" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Nonvoy ma'lumotlari</h3>
            <button class="modal-close" @click="closeViewModal">
              <X />
            </button>
          </div>
          
          <div class="view-content">
            <div class="worker-profile">
              <div class="profile-avatar" :style="{ backgroundColor: getAvatarColor(viewingWorker.name) }">
                {{ getInitials(viewingWorker.name) }}
              </div>
              <div class="profile-info">
                <h2 class="profile-name">{{ viewingWorker.name }}</h2>
                <p class="profile-position">{{ getPositionName(viewingWorker.position) }}</p>
                <span :class="['status-badge', viewingWorker.status]">
                  <div class="status-dot"></div>
                  {{ getStatusName(viewingWorker.status) }}
                </span>
              </div>
              <div class="profile-actions">
                <button class="btn-secondary" @click="editWorker(viewingWorker)">
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
                      <a :href="`tel:${viewingWorker.phone}`" class="detail-value">{{ formatPhone(viewingWorker.phone) }}</a>
                    </div>
                  </div>
                  <div class="detail-item">
                    <CreditCard class="detail-icon" />
                    <div>
                      <span class="detail-label">Passport</span>
                      <span class="detail-value">{{ viewingWorker.passport }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <Calendar class="detail-icon" />
                    <div>
                      <span class="detail-label">Tug'ilgan sana</span>
                      <span class="detail-value">{{ formatDate(viewingWorker.birthDate) }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <MapPin class="detail-icon" />
                    <div>
                      <span class="detail-label">Manzil</span>
                      <span class="detail-value">{{ viewingWorker.address || 'Kiritilmagan' }}</span>
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
                      <span class="detail-value">{{ getPositionName(viewingWorker.position) }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <DollarSign class="detail-icon" />
                    <div>
                      <span class="detail-label">Oylik maosh</span>
                      <span class="detail-value">{{ formatSalary(viewingWorker.salary) }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <Calendar class="detail-icon" />
                    <div>
                      <span class="detail-label">Ishga kirgan sana</span>
                      <span class="detail-value">{{ formatDate(viewingWorker.startDate) }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <Clock class="detail-icon" />
                    <div>
                      <span class="detail-label">Ish tajribasi</span>
                      <span class="detail-value">{{ getWorkExperience(viewingWorker.startDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="viewingWorker.notes" class="notes-section">
              <h4>Qo'shimcha ma'lumotlar</h4>
              <p class="notes-content">{{ viewingWorker.notes }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
        <div class="modal small" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Nonvoy o'chirish</h3>
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
              <strong>{{ deletingWorker.name }}</strong> nomli nonvoy va unga bog'liq barcha ma'lumotlar o'chiriladi.
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
    Users, UserCheck, UserPlus, DollarSign, ChevronRight, Search, Filter, Download, Plus, Grid, List, 
    Trash2, ChevronUp, ChevronDown, Eye, Edit, Phone, Calendar, ChevronLeft, X, MapPin, Briefcase, 
    Clock, AlertTriangle, CheckCircle, AlertCircle, Info, RefreshCw, MoreHorizontal, Copy, UserX, 
    ChevronsUpDown, ChevronsLeft, ChevronsRight, CreditCard
  } from 'lucide-vue-next'
  import Sidebar from '@/components/Layout/Sidebar.vue'
  
  // Mock API - Bu yerda haqiqiy API bilan almashtiring
  const mockApi = {
    async get(url) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      if (url === '/workers') {
        return {
          data: [
            // {
            //   id: 1,
            //   name: 'Bobur Karimov',
            //   phone: '+998901234567',
            //   passport: 'AA 1234567',
            //   birthDate: '1990-05-15',
            //   startDate: '2024-01-15',
            //   salary: 3000000,
            //   status: 'active',
            //   position: 'baker',
            //   address: 'Toshkent shahar, Chilonzor tumani, 5-kvartal',
            //   notes: 'Tajribali nonvoy'
            // },
            // {
            //   id: 2,
            //   name: 'Sardor Umarov',
            //   phone: '+998912345678',
            //   passport: 'AB 2345678',
            //   birthDate: '1985-08-22',
            //   startDate: '2023-11-10',
            //   salary: 2500000,
            //   status: 'active',
            //   position: 'assistant',
            //   address: 'Toshkent shahar, Yashnobod tumani, 12-kvartal',
            //   notes: 'Yaxshi yordamchi'
            // },
            // {
            //   id: 3,
            //   name: 'Aziz Rahimov',
            //   phone: '+998909876543',
            //   passport: 'AC 3456789',
            //   birthDate: '1992-03-10',
            //   startDate: '2024-02-20',
            //   salary: 2800000,
            //   status: 'inactive',
            //   position: 'baker',
            //   address: 'Samarqand shahar, Markaz tumani',
            //   notes: 'Vaqtincha ishlamaydi'
            // },
            // {
            //   id: 4,
            //   name: 'Dilshod Toshmatov',
            //   phone: '+998905432109',
            //   passport: 'AD 4567890',
            //   birthDate: '1988-12-05',
            //   startDate: '2023-09-15',
            //   salary: 3200000,
            //   status: 'active',
            //   position: 'supervisor',
            //   address: 'Buxoro shahar, Markaz tumani',
            //   notes: 'Nazoratchi lavozimida'
            // },
            // {
            //   id: 5,
            //   name: 'Jasur Abdullayev',
            //   phone: '+998903456789',
            //   passport: 'AE 5678901',
            //   birthDate: '1995-07-18',
            //   startDate: '2024-03-01',
            //   salary: 2200000,
            //   status: 'active',
            //   position: 'assistant',
            //   address: 'Andijon shahar, Markaz tumani',
            //   notes: 'Yangi ishchi'
            // }
          ]
        }
      }
      throw new Error('API endpoint not found')
    },
  
    async post(url, data) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (url === '/workers') {
        return {
          data: {
            id: Date.now(),
            ...data
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
    name: 'WorkersDashboard',
    components: {
      Users, UserCheck, UserPlus, DollarSign, ChevronRight, Search, Filter, Download, Plus, Grid, List, 
      Trash2, ChevronUp, ChevronDown, Eye, Edit, Phone, Calendar, ChevronLeft, X, MapPin, Briefcase, 
      Clock, AlertTriangle, CheckCircle, AlertCircle, Info, RefreshCw, MoreHorizontal, Copy, UserX, 
      ChevronsUpDown, ChevronsLeft, ChevronsRight, CreditCard,
      Sidebar
    },
    data() {
      return {
        // Data
        workers: [],
        filteredWorkers: [],
        
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
        activeActionMenu: null,
        
        // Form Data
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
        viewingWorker: {},
        deletingWorker: {},
        formErrors: {},
        
        // Search & Filter
        searchQuery: '',
        filters: {
          baker: false,
          assistant: false,
          supervisor: false,
          active: false,
          inactive: false
        },
        
        // Sorting
        sortField: 'id',
        sortDirection: 'asc',
        
        // Selection
        selectedWorkers: [],
        
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
      totalWorkers() {
        return this.workers.length
      },
      activeWorkers() {
        return this.workers.filter(w => w.status === 'active').length
      },
      newWorkers() {
        const thisMonth = new Date().getMonth()
        const thisYear = new Date().getFullYear()
        return this.workers.filter(w => {
          const startDate = new Date(w.startDate)
          return startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear
        }).length
      },
      newWorkersThisWeek() {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return this.workers.filter(w => new Date(w.startDate) > oneWeekAgo).length
      },
      newWorkersGrowth() {
        const thisMonth = this.newWorkers
        const lastMonth = this.workers.filter(w => {
          const startDate = new Date(w.startDate)
          const lastMonthDate = new Date()
          lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
          return startDate.getMonth() === lastMonthDate.getMonth() && 
                 startDate.getFullYear() === lastMonthDate.getFullYear()
        }).length
        
        if (lastMonth === 0) return thisMonth > 0 ? 100 : 0
        return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
      },
      averageSalary() {
        if (this.workers.length === 0) return '0'
        const total = this.workers.reduce((sum, w) => sum + Number(w.salary), 0)
        const avg = total / this.workers.length
        return this.formatSalary(avg)
      },
      salaryChange() {
        // Mock salary change calculation
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
        return Math.ceil(this.filteredWorkers.length / this.itemsPerPage)
      },
      paginatedWorkers() {
        const start = (this.currentPage - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        return this.filteredWorkers.slice(start, end)
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
        return this.paginatedWorkers.length > 0 && 
               this.paginatedWorkers.every(w => this.selectedWorkers.includes(w.id))
      }
    },
    async mounted() {
      await this.loadWorkers()
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
      async loadWorkers() {
        this.loading = true
        this.error = null
        
        try {
          const response = await mockApi.get('/workers')
          this.workers = response.data
          this.applyFiltersAndSearch()
          this.showToast('Muvaffaqiyat', 'Ma\'lumotlar muvaffaqiyatli yuklandi', 'success')
        } catch (error) {
          console.error('Nonvoylarni yuklashda xatolik:', error)
          this.error = this.getErrorMessage(error)
          this.showToast('Xatolik', 'Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error')
        } finally {
          this.loading = false
        }
      },
      
      async saveWorker() {
        if (!this.validateForm()) return
        
        this.formLoading = true
        
        try {
          let response
          
          if (this.isEditing) {
            response = await mockApi.put(`/workers/${this.currentWorker.id}`, this.currentWorker)
            const index = this.workers.findIndex(w => w.id === this.currentWorker.id)
            if (index !== -1) {
              this.workers[index] = { ...this.workers[index], ...response.data }
            }
            this.showToast('Muvaffaqiyat', 'Nonvoy muvaffaqiyatli yangilandi', 'success')
          } else {
            response = await mockApi.post('/workers', this.currentWorker)
            this.workers.push(response.data)
            this.showToast('Muvaffaqiyat', 'Nonvoy muvaffaqiyatli qo\'shildi', 'success')
          }
          
          this.applyFiltersAndSearch()
          this.closeModal()
        } catch (error) {
          console.error('Nonvoy saqlashda xatolik:', error)
          this.showToast('Xatolik', this.getErrorMessage(error), 'error')
        } finally {
          this.formLoading = false
        }
      },
      
      async confirmDelete() {
        this.formLoading = true
        
        try {
          await mockApi.delete(`/workers/${this.deletingWorker.id}`)
          this.workers = this.workers.filter(w => w.id !== this.deletingWorker.id)
          this.selectedWorkers = this.selectedWorkers.filter(id => id !== this.deletingWorker.id)
          
          this.applyFiltersAndSearch()
          this.showToast('Muvaffaqiyat', 'Nonvoy muvaffaqiyatli o\'chirildi', 'success')
          this.closeDeleteModal()
        } catch (error) {
          console.error('Nonvoy o\'chirishda xatolik:', error)
          this.showToast('Xatolik', this.getErrorMessage(error), 'error')
        } finally {
          this.formLoading = false
        }
      },
      
      async bulkDelete() {
        if (this.selectedWorkers.length === 0) return
        
        const count = this.selectedWorkers.length
        if (!confirm(`${count} ta nonvoyni o'chirmoqchimisiz?`)) return
        
        this.formLoading = true
        
        try {
          // Simulate bulk delete
          await Promise.all(
            this.selectedWorkers.map(id => mockApi.delete(`/workers/${id}`))
          )
          
          this.workers = this.workers.filter(w => !this.selectedWorkers.includes(w.id))
          this.selectedWorkers = []
          this.showBulkActions = false
          
          this.applyFiltersAndSearch()
          this.showToast('Muvaffaqiyat', `${count} ta nonvoy o'chirildi`, 'success')
        } catch (error) {
          console.error('Bulk delete xatolik:', error)
          this.showToast('Xatolik', this.getErrorMessage(error), 'error')
        } finally {
          this.formLoading = false
        }
      },
      
      async bulkStatusChange(status) {
        if (this.selectedWorkers.length === 0) return
        
        const count = this.selectedWorkers.length
        const statusName = this.getStatusName(status)
        
        if (!confirm(`${count} ta nonvoyni ${statusName.toLowerCase()} holatiga o'tkazmoqchimisiz?`)) return
        
        this.formLoading = true
        
        try {
          // Simulate bulk status change
          await Promise.all(
            this.selectedWorkers.map(id => 
              mockApi.put(`/workers/${id}`, { status })
            )
          )
          
          this.workers.forEach(worker => {
            if (this.selectedWorkers.includes(worker.id)) {
              worker.status = status
            }
          })
          
          this.selectedWorkers = []
          this.showBulkActions = false
          
          this.applyFiltersAndSearch()
          this.showToast('Muvaffaqiyat', `${count} ta nonvoy holati o'zgartirildi`, 'success')
        } catch (error) {
          console.error('Bulk status change xatolik:', error)
          this.showToast('Xatolik', this.getErrorMessage(error), 'error')
        } finally {
          this.formLoading = false
        }
      },
      
      async toggleWorkerStatus(worker) {
        const newStatus = worker.status === 'active' ? 'inactive' : 'active'
        
        try {
          await mockApi.put(`/workers/${worker.id}`, { status: newStatus })
          worker.status = newStatus
          
          this.applyFiltersAndSearch()
          this.showToast('Muvaffaqiyat', 'Nonvoy holati o\'zgartirildi', 'success')
        } catch (error) {
          console.error('Status o\'zgartirishda xatolik:', error)
          this.showToast('Xatolik', this.getErrorMessage(error), 'error')
        }
        
        this.activeActionMenu = null
      },
      
      async duplicateWorker(worker) {
        const duplicatedWorker = {
          ...worker,
          name: `${worker.name} (nusxa)`,
          passport: '',
          phone: ''
        }
        
        delete duplicatedWorker.id
        
        this.currentWorker = duplicatedWorker
        this.isEditing = false
        this.showModal = true
        this.activeActionMenu = null
      },
      
      // Form Validation
      validateForm() {
        this.formErrors = {}
        
        if (!this.currentWorker.name.trim()) {
          this.formErrors.name = 'Nonvoy nomi kiritilishi shart'
        }
        
        if (!this.currentWorker.phone.trim()) {
          this.formErrors.phone = 'Telefon raqami kiritilishi shart'
        } else if (!this.isValidPhone(this.currentWorker.phone)) {
          this.formErrors.phone = 'Telefon raqami noto\'g\'ri formatda'
        }
        
        if (!this.currentWorker.passport.trim()) {
          this.formErrors.passport = 'Passport seriya va raqami kiritilishi shart'
        } else if (!this.isValidPassport(this.currentWorker.passport)) {
          this.formErrors.passport = 'Passport noto\'g\'ri formatda (AA 1234567)'
        }
        
        if (!this.currentWorker.birthDate) {
          this.formErrors.birthDate = 'Tug\'ilgan sana kiritilishi shart'
        }
        
        if (!this.currentWorker.startDate) {
          this.formErrors.startDate = 'Ish boshlagan sana kiritilishi shart'
        }
        
        if (!this.currentWorker.salary || this.currentWorker.salary <= 0) {
          this.formErrors.salary = 'Maosh miqdori kiritilishi shart'
        }
        
        if (!this.currentWorker.position) {
          this.formErrors.position = 'Lavozim tanlanishi shart'
        }
        
        if (!this.currentWorker.address.trim()) {
          this.formErrors.address = 'Manzil kiritilishi shart'
        }
        
        return Object.keys(this.formErrors).length === 0
      },
      
      isValidPhone(phone) {
        const phoneRegex = /^\+998\d{9}$/
        return phoneRegex.test(phone.replace(/\s/g, ''))
      },
      
      isValidPassport(passport) {
        const passportRegex = /^[A-Z]{2}\s\d{7}$/
        return passportRegex.test(passport)
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
        
        this.currentWorker.phone = value.trim()
      },
      
      formatPassportInput(event) {
        let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        
        if (value.length > 9) {
          value = value.slice(0, 9)
        }
        
        // Format: AA 1234567
        if (value.length > 2) {
          value = value.slice(0, 2) + ' ' + value.slice(2)
        }
        
        this.currentWorker.passport = value
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
        let filtered = [...this.workers]
        
        // Search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          filtered = filtered.filter(worker =>
            worker.name.toLowerCase().includes(query) ||
            worker.phone.includes(query) ||
            worker.passport.toLowerCase().includes(query)
          )
        }
        
        // Position filters
        const positionFilters = ['baker', 'assistant', 'supervisor'].filter(key => this.filters[key])
        if (positionFilters.length > 0) {
          filtered = filtered.filter(worker => positionFilters.includes(worker.position))
        }
        
        // Status filters
        const statusFilters = ['active', 'inactive'].filter(key => this.filters[key])
        if (statusFilters.length > 0) {
          filtered = filtered.filter(worker => statusFilters.includes(worker.status))
        }
        
        this.filteredWorkers = filtered
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
          baker: false,
          assistant: false,
          supervisor: false,
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
            this.filteredWorkers = this.workers.filter(w => {
              const startDate = new Date(w.startDate)
              return startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear
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
        this.filteredWorkers.sort((a, b) => {
          let aVal = a[this.sortField]
          let bVal = b[this.sortField]
          
          if (this.sortField === 'startDate' || this.sortField === 'birthDate') {
            aVal = new Date(aVal)
            bVal = new Date(bVal)
          } else if (this.sortField === 'salary') {
            aVal = Number(aVal)
            bVal = Number(bVal)
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
      toggleSelect(workerId) {
        const index = this.selectedWorkers.indexOf(workerId)
        if (index > -1) {
          this.selectedWorkers.splice(index, 1)
        } else {
          this.selectedWorkers.push(workerId)
        }
      },
      
      toggleSelectAll() {
        if (this.allSelected) {
          this.selectedWorkers = this.selectedWorkers.filter(id =>
            !this.paginatedWorkers.some(w => w.id === id)
          )
        } else {
          this.paginatedWorkers.forEach(worker => {
            if (!this.selectedWorkers.includes(worker.id)) {
              this.selectedWorkers.push(worker.id)
            }
          })
        }
      },
      
      // View Toggle
      toggleView() {
        this.viewMode = this.viewMode === 'table' ? 'cards' : 'table'
      },
      
      // Action Menu
      toggleActionMenu(workerId) {
        this.activeActionMenu = this.activeActionMenu === workerId ? null : workerId
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
        this.formErrors = {}
        this.showModal = true
      },
      
      editWorker(worker) {
        this.isEditing = true
        this.currentWorker = { ...worker }
        this.formErrors = {}
        this.showModal = true
        this.closeViewModal()
      },
      
      viewWorker(worker) {
        this.viewingWorker = worker
        this.showViewModal = true
      },
      
      deleteWorker(worker) {
        this.deletingWorker = worker
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
        a.download = `nonvoylar_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        this.showToast('Muvaffaqiyat', 'Ma\'lumotlar CSV formatida eksport qilindi', 'success')
      },
      
      generateCSV() {
        const headers = ['ID', 'Ismi', 'Telefon', 'Passport', 'Lavozimi', 'Maosh', 'Holati', 'Ish boshlagan sana']
        const rows = this.filteredWorkers.map(w => [
          w.id,
          `"${w.name}"`,
          w.phone,
          w.passport,
          this.getPositionName(w.position),
          w.salary,
          this.getStatusName(w.status),
          this.formatDate(w.startDate)
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
      
      formatSalary(salary) {
        if (!salary) return 'N/A'
        return new Intl.NumberFormat('uz-UZ').format(salary) + ' so\'m'
      },
      
      getPositionName(position) {
        const positions = {
          baker: 'Nonvoy',
          assistant: 'Yordamchi',
          supervisor: 'Nazoratchi'
        }
        return positions[position] || position
      },
      
      getPositionClass(position) {
        return position
      },
      
      getStatusName(status) {
        const statuses = {
          active: 'Faol',
          inactive: 'Nofaol'
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
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 280px; /* O'zingizning sidebar kengligiga qarab o'zgartiring */
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
  
  .stat-icon.salary {
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
  
  .workers-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .workers-table th {
    background: #f8fafc;
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }
  
  .workers-table th.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
  }
  
  .workers-table th.sortable:hover {
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
  
  .workers-table td {
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
  
  .worker-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 200px;
  }
  
  .worker-avatar {
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
  
  .worker-avatar.large {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }
  
  .worker-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .worker-name {
    font-weight: 500;
    color: #1e293b;
  }
  
  .worker-id {
    font-size: 12px;
    color: #64748b;
  }
  
  .phone-cell {
    color: #374151;
    min-width: 150px;
  }
  
  .phone-link {
    color: #4f46e5;
    text-decoration: none;
  }
  
  .phone-link:hover {
    text-decoration: underline;
  }
  
  .passport-cell {
    color: #374151;
    min-width: 120px;
  }
  
  .passport-number {
    font-family: monospace;
    font-weight: 500;
  }
  
  .salary-cell {
    color: #374151;
    min-width: 120px;
  }
  
  .salary-amount {
    font-weight: 500;
    color: #059669;
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
  
  .position-badge.baker {
    background: #dcfce7;
    color: #166534;
  }
  
  .position-badge.assistant {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .position-badge.supervisor {
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
  
  .worker-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;
  }
  
  .worker-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .worker-card.selected {
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
  
  .worker-profile {
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
  
  .notes-section {
    margin-top: 24px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
  
  .notes-section h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
  }
  
  .notes-content {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    margin: 0;
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
    .main-content {
      margin-left: 280px;
    }
  }
  
  @media (max-width: 1023px) {
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
    
    .workers-table {
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
    
    .worker-profile {
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
  