<!-- <template>
    <div class="chiqim">
     <div class="chiqim_top">
       <h1>Chiqimlar</h1>
       <button>Chiqim yaratish</button>
     </div>
       <div class="chiqim_blog">
         <header>
           <b>№</b>
           <b>Nomi</b>
           <b>Soni</b>
           <b>Narxi</b>
           <b>Tavsif</b>
           <b>Kimdan</b>
           <b></b>
         </header>
       </div>
   </div>
 </template>
 
 
 
 <script>
 export default {
   name: "Chiqim"
 }
 </script>
 
 
 
 <style>
    .chiqim{
 
   width: 88%;
 }
 .chiqim_blog{
   border: 1px solid rgb(200, 200, 200);
   height: 85vh;
   border-radius: 20px;
   padding: 20px;
 }
 .chiqim_top{
   display: flex;
   height: 70px;
   justify-content: space-between;
   align-items: center;
   
 }
 .chiqim_top h1{
     font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
 }
 .chiqim_top button{
   width: 250px;
   height: 40px;
     background-color: #5565ff;
     border: none;
     border-radius: 10px;
     font-family: Verdana, Geneva, Tahoma, sans-serif;
 font-size: 18px;
 color: #fff;
 }
 .chiqim_blog header{
   display: flex;
   justify-content: space-between;
   background-color: #ddd;
   padding: 20px;
   border-radius: 10px;
 
 }
 header b{
   width: 250px;
 }
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
            <h1 class="page-title">Chiqimlar</h1>
            <div class="breadcrumb">
              <span>Dashboard</span>
              <ChevronRight class="breadcrumb-separator" />
              <span class="breadcrumb-current">Chiqimlar</span>
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
                placeholder="Chiqim qidirish..."
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
                  <h4>Kategoriya bo'yicha</h4>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.material" @change="applyFilters" />
                      Material
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.salary" @change="applyFilters" />
                      Maosh
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.utility" @change="applyFilters" />
                      Kommunal
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.other" @change="applyFilters" />
                      Boshqa
                    </label>
                  </div>
                </div>
                <div class="filter-section">
                  <h4>Sana bo'yicha</h4>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.today" @change="applyFilters" />
                      Bugun
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.thisWeek" @change="applyFilters" />
                      Bu hafta
                    </label>
                  </div>
                  <div class="filter-item">
                    <label>
                      <input type="checkbox" v-model="filters.thisMonth" @change="applyFilters" />
                      Bu oy
                    </label>
                  </div>
                </div>
                <div class="filter-actions">
                  <button class="filter-clear" @click="clearFilters">Tozalash</button>
                </div>
              </div>
            </div>
            
            <!-- Export -->
            <button class="export-btn" @click="exportData" :disabled="filteredExpenses.length === 0">
              <Download class="export-icon" />
              Export
            </button>
            
            <!-- Refresh -->
            <button class="refresh-btn" @click="loadExpenses" :disabled="loading">
              <RefreshCw class="refresh-icon" :class="{ 'spinning': loading }" />
              Yangilash
            </button>
            
            <!-- Create Button -->
            <button class="create-btn" @click="openCreateModal">
              <Plus class="create-icon" />
              Chiqim yaratish
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" @click="filterByPeriod('all')">
          <div class="stat-icon total">
            <TrendingDown />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ totalExpenses }}</h3>
            <p class="stat-label">Jami Chiqimlar</p>
            <span class="stat-change">{{ formatCurrency(totalAmount) }}</span>
          </div>
        </div>
        <div class="stat-card" @click="filterByPeriod('today')">
          <div class="stat-icon today">
            <Calendar />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ todayExpenses }}</h3>
            <p class="stat-label">Bugungi Chiqimlar</p>
            <span class="stat-change">{{ formatCurrency(todayAmount) }}</span>
          </div>
        </div>
        <div class="stat-card" @click="filterByPeriod('thisMonth')">
          <div class="stat-icon month">
            <BarChart3 />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ thisMonthExpenses }}</h3>
            <p class="stat-label">Bu Oy</p>
            <span class="stat-change">{{ formatCurrency(thisMonthAmount) }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon average">
            <Calculator />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ formatCurrency(averageExpense) }}</h3>
            <p class="stat-label">O'rtacha Chiqim</p>
            <span class="stat-change" :class="{ positive: expenseChange > 0, negative: expenseChange < 0 }">
              {{ expenseChange > 0 ? '+' : '' }}{{ expenseChange }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <!-- Table Header -->
        <div class="table-header">
          <div class="table-title">
            <h3>Chiqimlar ro'yxati</h3>
            <span class="table-count">{{ filteredExpenses.length }} ta chiqim</span>
          </div>
          <div class="table-actions">
            <button 
              class="bulk-action-btn" 
              :disabled="selectedExpenses.length === 0" 
              @click="showBulkActions = !showBulkActions"
            >
              <MoreHorizontal />
              Amallar ({{ selectedExpenses.length }})
            </button>
            <div v-if="showBulkActions" class="bulk-actions-menu">
              <button @click="bulkDelete" class="bulk-action-item danger">
                <Trash2 />
                O'chirish
              </button>
              <button @click="bulkExport" class="bulk-action-item">
                <Download />
                Eksport qilish
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
          <button class="retry-btn" @click="loadExpenses">
            <RefreshCw />
            Qayta urinish
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredExpenses.length === 0 && !loading" class="empty-state">
          <div class="empty-illustration">
            <TrendingDown class="empty-icon" />
          </div>
          <h3 class="empty-title">
            {{ searchQuery || hasActiveFilters ? 'Natija topilmadi' : 'Hozircha chiqimlar mavjud emas' }}
          </h3>
          <p class="empty-description">
            {{ searchQuery || hasActiveFilters 
              ? 'Qidiruv yoki filtr shartlariga mos chiqim topilmadi' 
              : 'Yangi chiqim qo\'shish uchun yuqoridagi tugmani bosing' 
            }}
          </p>
          <button v-if="!searchQuery && !hasActiveFilters" class="empty-action-btn" @click="openCreateModal">
            <Plus />
            Chiqim yaratish
          </button>
          <button v-else class="empty-action-btn" @click="clearSearchAndFilters">
            <X />
            Filtrlarni tozalash
          </button>
        </div>

        <!-- Table View -->
        <div v-else-if="viewMode === 'table'" class="table-wrapper">
          <table class="expenses-table">
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
                  Nomi
                  <ChevronUp v-if="sortField === 'name' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'name' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th class="sortable" @click="sortBy('quantity')">
                  Soni
                  <ChevronUp v-if="sortField === 'quantity' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'quantity' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th class="sortable" @click="sortBy('price')">
                  Narxi
                  <ChevronUp v-if="sortField === 'price' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'price' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th>Tavsif</th>
                <th>Kimdan</th>
                <th class="sortable" @click="sortBy('category')">
                  Kategoriya
                  <ChevronUp v-if="sortField === 'category' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'category' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th class="sortable" @click="sortBy('date')">
                  Sana
                  <ChevronUp v-if="sortField === 'date' && sortDirection === 'asc'" class="sort-icon" />
                  <ChevronDown v-else-if="sortField === 'date' && sortDirection === 'desc'" class="sort-icon" />
                  <ChevronsUpDown v-else class="sort-icon inactive" />
                </th>
                <th class="actions-column">Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(expense, index) in paginatedExpenses" 
                :key="expense.id" 
                class="table-row"
                :class="{ selected: selectedExpenses.includes(expense.id) }"
              >
                <td>
                  <input 
                    type="checkbox"
                    :checked="selectedExpenses.includes(expense.id)"
                    @change="toggleSelect(expense.id)"
                    class="table-checkbox"
                  />
                </td>
                <td class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="expense-info">
                  <div class="expense-details">
                    <span class="expense-name">{{ expense.name }}</span>
                    <span class="expense-total">{{ formatCurrency(expense.quantity * expense.price) }}</span>
                  </div>
                </td>
                <td class="quantity-cell">
                  <span class="quantity-value">{{ expense.quantity }} {{ expense.unit }}</span>
                </td>
                <td class="price-cell">
                  <span class="price-amount">{{ formatCurrency(expense.price) }}</span>
                </td>
                <td class="description-cell">
                  <span class="description-text" :title="expense.description">
                    {{ truncateText(expense.description, 30) }}
                  </span>
                </td>
                <td class="supplier-cell">
                  <span class="supplier-name">{{ expense.supplier }}</span>
                </td>
                <td>
                  <span :class="['category-badge', getCategoryClass(expense.category)]">
                    {{ getCategoryName(expense.category) }}
                  </span>
                </td>
                <td class="date-cell">
                  <span :title="formatDateTime(expense.date)">
                    {{ formatDate(expense.date) }}
                  </span>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewExpense(expense)" title="Ko'rish">
                      <Eye />
                    </button>
                    <button class="action-btn edit" @click="editExpense(expense)" title="Tahrirlash">
                      <Edit />
                    </button>
                    <button class="action-btn delete" @click="deleteExpense(expense)" title="O'chirish">
                      <Trash2 />
                    </button>
                    <div class="action-dropdown" ref="actionDropdown">
                      <button class="action-btn more" @click="toggleActionMenu(expense.id)">
                        <MoreHorizontal />
                      </button>
                      <div v-if="activeActionMenu === expense.id" class="action-menu">
                        <button @click="duplicateExpense(expense)" class="action-menu-item">
                          <Copy />
                          Nusxalash
                        </button>
                        <button @click="printExpense(expense)" class="action-menu-item">
                          <Printer />
                          Chop etish
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
            v-for="expense in paginatedExpenses" 
            :key="expense.id" 
            class="expense-card"
            :class="{ selected: selectedExpenses.includes(expense.id) }"
          >
            <div class="card-header">
              <input 
                type="checkbox"
                :checked="selectedExpenses.includes(expense.id)"
                @change="toggleSelect(expense.id)"
                class="card-checkbox"
              />
              <div class="expense-category" :style="{ backgroundColor: getCategoryColor(expense.category) }">
                <component :is="getCategoryIcon(expense.category)" class="category-icon" />
              </div>
              <div class="card-actions">
                <button class="card-action-btn" @click="viewExpense(expense)" title="Ko'rish">
                  <Eye />
                </button>
                <button class="card-action-btn" @click="editExpense(expense)" title="Tahrirlash">
                  <Edit />
                </button>
                <button class="card-action-btn delete" @click="deleteExpense(expense)" title="O'chirish">
                  <Trash2 />
                </button>
              </div>
            </div>
            <div class="card-content">
              <h4 class="card-name">{{ expense.name }}</h4>
              <p class="card-total">{{ formatCurrency(expense.quantity * expense.price) }}</p>
              <div class="card-info">
                <div class="info-item">
                  <Package class="info-icon" />
                  <span>{{ expense.quantity }} {{ expense.unit }}</span>
                </div>
                <div class="info-item">
                  <DollarSign class="info-icon" />
                  <span>{{ formatCurrency(expense.price) }}</span>
                </div>
                <div class="info-item">
                  <User class="info-icon" />
                  <span>{{ expense.supplier }}</span>
                </div>
                <div class="info-item">
                  <Calendar class="info-icon" />
                  <span :title="formatDateTime(expense.date)">{{ formatDate(expense.date) }}</span>
                </div>
              </div>
              <div class="card-footer">
                <span :class="['category-badge', getCategoryClass(expense.category)]">
                  {{ getCategoryName(expense.category) }}
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
            {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredExpenses.length) }} 
            / {{ filteredExpenses.length }} ta natija
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ isEditing ? 'Chiqim tahrirlash' : 'Chiqim yaratish' }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <X />
          </button>
        </div>
        
        <form @submit.prevent="saveExpense" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Chiqim nomi *</label>
              <input 
                type="text"
                class="form-input"
                v-model="currentExpense.name"
                placeholder="Chiqim nomini kiriting"
                required
                :class="{ error: formErrors.name }"
              />
              <span v-if="formErrors.name" class="form-error">{{ formErrors.name }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Kategoriya *</label>
              <select class="form-select" v-model="currentExpense.category" required :class="{ error: formErrors.category }">
                <option value="">Kategoriyani tanlang</option>
                <option value="material">Material</option>
                <option value="salary">Maosh</option>
                <option value="utility">Kommunal</option>
                <option value="other">Boshqa</option>
              </select>
              <span v-if="formErrors.category" class="form-error">{{ formErrors.category }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Miqdori *</label>
              <input 
                type="number"
                class="form-input"
                v-model="currentExpense.quantity"
                placeholder="0"
                required
                min="0"
                step="0.01"
                :class="{ error: formErrors.quantity }"
              />
              <span v-if="formErrors.quantity" class="form-error">{{ formErrors.quantity }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">O'lchov birligi *</label>
              <select class="form-select" v-model="currentExpense.unit" required :class="{ error: formErrors.unit }">
                <option value="">Birlikni tanlang</option>
                <option value="kg">kg</option>
                <option value="dona">dona</option>\
                <option value=\"litr\">litr</option>\
                <option value="metr">metr</option>
                <option value="paket">paket</option>
                <option value="qop">qop</option>
              </select>
              <span v-if="formErrors.unit\" class=\"form-error\">{{ formErrors.unit }}</span>\
            </div>
            <div class="form-group">
              <label class="form-label\">Narxi *</label>\
              <input \
                type="number"
                class="form-input"
                v-model="currentExpense.price"\
                placeholder="0"
                required
                min="0"
                step="0.01"
                :class=\"{ error: formErrors.price }"
              />
              <span v-if="formErrors.price" class=\"form-error\">{{ formErrors.price }}</span>
            </div>\
            <div class="form-group">
              <label class="form-label">Kimdan *</label>
              <input 
                type="text"\
                class="form-input"
                v-model="currentExpense.supplier"\
                placeholder="Ta'minotchi nomi"
                required
                :class="{ error: formErrors.supplier }"
              />\
              <span v-if="formErrors.supplier" class="form-error">{{ formErrors.supplier }}</span>
            </div>\
            <div class="form-group">
              <label class="form-label">Sana *</label>
              <input \
                type="date"\
                class=\"form-input"\
                v-model="currentExpense.date"
                required
                :class="{ error: formErrors.date }"
              />
              <span v-if="formErrors.date" class="form-error">{{ formErrors.date }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Vaqt</label>
              <input 
                type="time"
                class="form-input"
                v-model="currentExpense.time"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tavsif</label>
            <textarea 
              class="form-textarea"
              v-model="currentExpense.description"
              placeholder="Chiqim haqida qo'shimcha ma'lumot..."
              rows="3"
            ></textarea>
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
          <h3 class="modal-title">Chiqim ma'lumotlari</h3>
          <button class="modal-close" @click="closeViewModal">
            <X />
          </button>
        </div>
        
        <div class="view-content">
          <div class="expense-profile">
            <div class="profile-category" :style="{ backgroundColor: getCategoryColor(viewingExpense.category) }">
              <component :is="getCategoryIcon(viewingExpense.category)" class="profile-category-icon" />
            </div>
            <div class="profile-info">
              <h2 class="profile-name">{{ viewingExpense.name }}</h2>
              <p class="profile-total">{{ formatCurrency(viewingExpense.quantity * viewingExpense.price) }}</p>
              <span :class="['category-badge', getCategoryClass(viewingExpense.category)]">
                {{ getCategoryName(viewingExpense.category) }}
              </span>
            </div>
            <div class="profile-actions">
              <button class="btn-secondary" @click="editExpense(viewingExpense)">
                <Edit />
                Tahrirlash
              </button>
            </div>
          </div>
          <div class="details-grid">
            <div class="detail-card">
              <h4>Asosiy ma'lumotlar</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <Package class="detail-icon" />
                  <div>
                    <span class="detail-label">Miqdori</span>
                    <span class="detail-value">{{ viewingExpense.quantity }} {{ viewingExpense.unit }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <DollarSign class="detail-icon" />
                  <div>
                    <span class="detail-label">Narxi</span>
                    <span class="detail-value">{{ formatCurrency(viewingExpense.price) }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <User class="detail-icon" />
                  <div>
                    <span class="detail-label">Ta'minotchi</span>
                    <span class="detail-value">{{ viewingExpense.supplier }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <Calendar class="detail-icon" />
                  <div>
                    <span class="detail-label">Sana</span>
                    <span class="detail-value">{{ formatDateTime(viewingExpense.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-card">
              <h4>Qo'shimcha ma'lumotlar</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <Calculator class="detail-icon" />
                  <div>
                    <span class="detail-label">Jami summa</span>
                    <span class="detail-value">{{ formatCurrency(viewingExpense.quantity * viewingExpense.price) }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <Tag class="detail-icon" />
                  <div>
                    <span class="detail-label">Kategoriya</span>
                    <span class="detail-value">{{ getCategoryName(viewingExpense.category) }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <Clock class="detail-icon" />
                  <div>
                    <span class="detail-label">Vaqt</span>
                    <span class="detail-value">{{ viewingExpense.time || 'Kiritilmagan' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="viewingExpense.description" class="notes-section">
            <h4>Tavsif</h4>
            <p class="notes-content">{{ viewingExpense.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Chiqim o'chirish</h3>
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
            <strong>{{ deletingExpense.name }}</strong> nomli chiqim va unga bog'liq barcha ma'lumotlar o'chiriladi.
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
  TrendingDown, Calendar, BarChart3, Calculator, ChevronRight, Search, Filter, Download, Plus, Grid, List, 
  Trash2, ChevronUp, ChevronDown, Eye, Edit, ChevronLeft, X, AlertTriangle, CheckCircle, AlertCircle, 
  Info, RefreshCw, MoreHorizontal, Copy, ChevronsUpDown, ChevronsLeft, ChevronsRight, Package, DollarSign, 
  User, Clock, Tag, Printer, Wrench, Zap, Home, ShoppingCart
} from 'lucide-vue-next'
import Sidebar from '@/components/Layout/Sidebar.vue'

// Mock API - Bu yerda haqiqiy API bilan almashtiring
const mockApi = {
  async get(url) {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
    
    if (url === '/expenses') {
      return {
        data: [
          {
            id: 1,
            name: 'Un sotib olish',
            quantity: 50,
            unit: 'kg',
            price: 8000,
            supplier: 'Guliston Un Fabrikasi',
            category: 'material',
            description: 'Yuqori sifatli un, non tayyorlash uchun',
            date: '2024-01-15',
            time: '10:30'
          },
          {
            id: 2,
            name: 'Ishchilar maoshi',
            quantity: 1,
            unit: 'oy',
            price: 15000000,
            supplier: 'Kompaniya',
            category: 'salary',
            description: 'Yanvar oyi uchun ishchilar maoshi',
            date: '2024-01-31',
            time: '17:00'
          },
          {
            id: 3,
            name: 'Elektr energiya',
            quantity: 1200,
            unit: 'kWh',
            price: 850,
            supplier: 'Toshkent Elektr Tarmog\'i',
            category: 'utility',
            description: 'Yanvar oyi uchun elektr energiya to\'lovi',
            date: '2024-01-20',
            time: '14:15'
          },
          {
            id: 4,
            name: 'Xamirturush',
            quantity: 10,
            unit: 'kg',
            price: 12000,
            supplier: 'Kimyo Mahsulotlari',
            category: 'material',
            description: 'Non tayyorlash uchun xamirturush',
            date: '2024-01-18',
            time: '09:45'
          },
          {
            id: 5,
            name: 'Gaz to\'lovi',
            quantity: 500,
            unit: 'm³',
            price: 1200,
            supplier: 'Hududgaz',
            category: 'utility',
            description: 'Yanvar oyi uchun tabiiy gaz to\'lovi',
            date: '2024-01-25',
            time: '11:20'
          }
        ]
      }
    }
    throw new Error('API endpoint not found')
  },

  async post(url, data) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (url === '/expenses') {
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
  name: 'ChiqimlarDashboard',
  components: {
    TrendingDown, Calendar, BarChart3, Calculator, ChevronRight, Search, Filter, Download, Plus, Grid, List, 
    Trash2, ChevronUp, ChevronDown, Eye, Edit, ChevronLeft, X, AlertTriangle, CheckCircle, AlertCircle, 
    Info, RefreshCw, MoreHorizontal, Copy, ChevronsUpDown, ChevronsLeft, ChevronsRight, Package, DollarSign, 
    User, Clock, Tag, Printer, Wrench, Zap, Home, ShoppingCart,
    Sidebar
  },
  data() {
    return {
      // Data
      expenses: [],
      filteredExpenses: [],
      
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
      currentExpense: {
        name: '',
        quantity: '',
        unit: '',
        price: '',
        supplier: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: ''
      },
      viewingExpense: {},
      deletingExpense: {},
      formErrors: {},
      
      // Search & Filter
      searchQuery: '',
      filters: {
        material: false,
        salary: false,
        utility: false,
        other: false,
        today: false,
        thisWeek: false,
        thisMonth: false
      },
      
      // Sorting
      sortField: 'id',
      sortDirection: 'desc',
      
      // Selection
      selectedExpenses: [],
      
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
    totalExpenses() {
      return this.expenses.length
    },
    totalAmount() {
      return this.expenses.reduce((sum, expense) => sum + (expense.quantity * expense.price), 0)
    },
    todayExpenses() {
      const today = new Date().toISOString().split('T')[0]
      return this.expenses.filter(e => e.date === today).length
    },
    todayAmount() {
      const today = new Date().toISOString().split('T')[0]
      return this.expenses
        .filter(e => e.date === today)
        .reduce((sum, expense) => sum + (expense.quantity * expense.price), 0)
    },
    thisMonthExpenses() {
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      return this.expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear
      }).length
    },
    thisMonthAmount() {
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      return this.expenses
        .filter(e => {
          const expenseDate = new Date(e.date)
          return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear
        })
        .reduce((sum, expense) => sum + (expense.quantity * expense.price), 0)
    },
    averageExpense() {
      if (this.expenses.length === 0) return 0
      return this.totalAmount / this.expenses.length
    },
    expenseChange() {
      // Mock expense change calculation
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
      return Math.ceil(this.filteredExpenses.length / this.itemsPerPage)
    },
    paginatedExpenses() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredExpenses.slice(start, end)
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
      return this.paginatedExpenses.length > 0 && 
             this.paginatedExpenses.every(e => this.selectedExpenses.includes(e.id))
    }
  },
  async mounted() {
    await this.loadExpenses()
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
    async loadExpenses() {
      this.loading = true
      this.error = null
      
      try {
        const response = await mockApi.get('/expenses')
        this.expenses = response.data
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', 'Ma\'lumotlar muvaffaqiyatli yuklandi', 'success')
      } catch (error) {
        console.error('Chiqimlarni yuklashda xatolik:', error)
        this.error = this.getErrorMessage(error)
        this.showToast('Xatolik', 'Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async saveExpense() {
      if (!this.validateForm()) return
      
      this.formLoading = true
      
      try {
        let response
        
        if (this.isEditing) {
          response = await mockApi.put(`/expenses/${this.currentExpense.id}`, this.currentExpense)
          const index = this.expenses.findIndex(e => e.id === this.currentExpense.id)
          if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...response.data }
          }
          this.showToast('Muvaffaqiyat', 'Chiqim muvaffaqiyatli yangilandi', 'success')
        } else {
          response = await mockApi.post('/expenses', this.currentExpense)
          this.expenses.push(response.data)
          this.showToast('Muvaffaqiyat', 'Chiqim muvaffaqiyatli yaratildi', 'success')
        }
        
        this.applyFiltersAndSearch()
        this.closeModal()
      } catch (error) {
        console.error('Chiqim saqlashda xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    async confirmDelete() {
      this.formLoading = true
      
      try {
        await mockApi.delete(`/expenses/${this.deletingExpense.id}`)
        this.expenses = this.expenses.filter(e => e.id !== this.deletingExpense.id)
        this.selectedExpenses = this.selectedExpenses.filter(id => id !== this.deletingExpense.id)
        
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', 'Chiqim muvaffaqiyatli o\'chirildi', 'success')
        this.closeDeleteModal()
      } catch (error) {
        console.error('Chiqim o\'chirishda xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    async bulkDelete() {
      if (this.selectedExpenses.length === 0) return
      
      const count = this.selectedExpenses.length
      if (!confirm(`${count} ta chiqimni o'chirmoqchimisiz?`)) return
      
      this.formLoading = true
      
      try {
        // Simulate bulk delete
        await Promise.all(
          this.selectedExpenses.map(id => mockApi.delete(`/expenses/${id}`))
        )
        
        this.expenses = this.expenses.filter(e => !this.selectedExpenses.includes(e.id))
        this.selectedExpenses = []
        this.showBulkActions = false
        
        this.applyFiltersAndSearch()
        this.showToast('Muvaffaqiyat', `${count} ta chiqim o'chirildi`, 'success')
      } catch (error) {
        console.error('Bulk delete xatolik:', error)
        this.showToast('Xatolik', this.getErrorMessage(error), 'error')
      } finally {
        this.formLoading = false
      }
    },
    
    bulkExport() {
      if (this.selectedExpenses.length === 0) return
      
      const selectedData = this.expenses.filter(e => this.selectedExpenses.includes(e.id))
      const csvContent = this.generateCSV(selectedData)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tanlangan_chiqimlar_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      this.showToast('Muvaffaqiyat', `${this.selectedExpenses.length} ta chiqim eksport qilindi`, 'success')
      this.showBulkActions = false
    },
    
    duplicateExpense(expense) {
      const duplicatedExpense = {
        ...expense,
        name: `${expense.name} (nusxa)`,
        date: new Date().toISOString().split('T')[0],
        time: ''
      }
      
      delete duplicatedExpense.id
      
      this.currentExpense = duplicatedExpense
      this.isEditing = false
      this.showModal = true
      this.activeActionMenu = null
    },
    
    printExpense(expense) {
      // Mock print functionality
      this.showToast('Ma\'lumot', 'Chop etish funksiyasi ishlab chiqilmoqda', 'info')
      this.activeActionMenu = null
    },
    
    // Form Validation
    validateForm() {
      this.formErrors = {}
      
      if (!this.currentExpense.name.trim()) {
        this.formErrors.name = 'Chiqim nomi kiritilishi shart'
      }
      
      if (!this.currentExpense.category) {
        this.formErrors.category = 'Kategoriya tanlanishi shart'
      }
      
      if (!this.currentExpense.quantity || this.currentExpense.quantity <= 0) {
        this.formErrors.quantity = 'Miqdor kiritilishi shart'
      }
      
      if (!this.currentExpense.unit) {
        this.formErrors.unit = 'O\'lchov birligi tanlanishi shart'
      }
      
      if (!this.currentExpense.price || this.currentExpense.price <= 0) {
        this.formErrors.price = 'Narx kiritilishi shart'
      }
      
      if (!this.currentExpense.supplier.trim()) {
        this.formErrors.supplier = 'Ta\'minotchi nomi kiritilishi shart'
      }
      
      if (!this.currentExpense.date) {
        this.formErrors.date = 'Sana kiritilishi shart'
      }
      
      return Object.keys(this.formErrors).length === 0
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
      let filtered = [...this.expenses]
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(expense =>
          expense.name.toLowerCase().includes(query) ||
          expense.supplier.toLowerCase().includes(query) ||
          expense.description.toLowerCase().includes(query)
        )
      }
      
      // Category filters
      const categoryFilters = ['material', 'salary', 'utility', 'other'].filter(key => this.filters[key])
      if (categoryFilters.length > 0) {
        filtered = filtered.filter(expense => categoryFilters.includes(expense.category))
      }
      
      // Date filters
      if (this.filters.today) {
        const today = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(expense => expense.date === today)
      }
      
      if (this.filters.thisWeek) {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        filtered = filtered.filter(expense => new Date(expense.date) > oneWeekAgo)
      }
      
      if (this.filters.thisMonth) {
        const thisMonth = new Date().getMonth()
        const thisYear = new Date().getFullYear()
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear
        })
      }
      
      this.filteredExpenses = filtered
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
        material: false,
        salary: false,
        utility: false,
        other: false,
        today: false,
        thisWeek: false,
        thisMonth: false
      }
      this.applyFiltersAndSearch()
      this.showFilter = false
    },
    
    clearSearchAndFilters() {
      this.searchQuery = ''
      this.clearFilters()
    },
    
    filterByPeriod(period) {
      this.clearFilters()
      if (period !== 'all') {
        this.filters[period] = true
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
      this.filteredExpenses.sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]
        
        if (this.sortField === 'date') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        } else if (this.sortField === 'quantity' || this.sortField === 'price') {
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
    toggleSelect(expenseId) {
      const index = this.selectedExpenses.indexOf(expenseId)
      if (index > -1) {
        this.selectedExpenses.splice(index, 1)
      } else {
        this.selectedExpenses.push(expenseId)
      }
    },
    
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedExpenses = this.selectedExpenses.filter(id =>
          !this.paginatedExpenses.some(e => e.id === id)
        )
      } else {
        this.paginatedExpenses.forEach(expense => {
          if (!this.selectedExpenses.includes(expense.id)) {
            this.selectedExpenses.push(expense.id)
          }
        })
      }
    },
    
    // View Toggle
    toggleView() {
      this.viewMode = this.viewMode === 'table' ? 'cards' : 'table'
    },
    
    // Action Menu
    toggleActionMenu(expenseId) {
      this.activeActionMenu = this.activeActionMenu === expenseId ? null : expenseId
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
      this.currentExpense = {
        name: '',
        quantity: '',
        unit: '',
        price: '',
        supplier: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: ''
      }
      this.formErrors = {}
      this.showModal = true
    },
    
    editExpense(expense) {
      this.isEditing = true
      this.currentExpense = { ...expense }
      this.formErrors = {}
      this.showModal = true
      this.closeViewModal()
    },
    
    viewExpense(expense) {
      this.viewingExpense = expense
      this.showViewModal = true
    },
    
    deleteExpense(expense) {
      this.deletingExpense = expense
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
      const csvContent = this.generateCSV(this.filteredExpenses)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chiqimlar_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      this.showToast('Muvaffaqiyat', 'Ma\'lumotlar CSV formatida eksport qilindi', 'success')
    },
    
    generateCSV(data) {
      const headers = ['ID', 'Nomi', 'Miqdori', 'Birlik', 'Narxi', 'Jami', 'Ta\'minotchi', 'Kategoriya', 'Sana']
      const rows = data.map(e => [
        e.id,
        `"${e.name}"`,
        e.quantity,
        e.unit,
        e.price,
        e.quantity * e.price,
        `"${e.supplier}"`,
        this.getCategoryName(e.category),
        this.formatDate(e.date)
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    },
    
    // Utility Functions
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
        year:
      if (!date) return 'N/A'
      return new Date(date).toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    formatCurrency(amount) {
      if (!amount) return '0 so\'m'
      return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m'
    },
    
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    
    getCategoryName(category) {
      const categories = {
        material: 'Material',
        salary: 'Maosh',
        utility: 'Kommunal',
        other: 'Boshqa'
      }
      return categories[category] || category
    },
    
    getCategoryClass(category) {
      return category
    },
    
    getCategoryColor(category) {
      const colors = {
        material: '#4f46e5',
        salary: '#059669',
        utility: '#d97706',
        other: '#dc2626'
      }
      return colors[category] || '#64748b'
    },
    
    getCategoryIcon(category) {
      const icons = {
        material: Package,
        salary: DollarSign,
        utility: Zap,
        other: ShoppingCart
      }
      return icons[category] || Package
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
  background: #fee2e2;
  color: #dc2626;
}

.stat-icon.today {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-icon.month {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon.average {
  background: #dcfce7;
  color: #16a34a;
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

.expenses-table {
  width: 100%;
  border-collapse: collapse;
}

.expenses-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.expenses-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.expenses-table th.sortable:hover {
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

.expenses-table td {
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

.expense-info {
  min-width: 200px;
}

.expense-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.expense-name {
  font-weight: 500;
  color: #1e293b;
}

.expense-total {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.quantity-cell {
  color: #374151;
  min-width: 100px;
}

.quantity-value {
  font-weight: 500;
}

.price-cell {
  color: #374151;
  min-width: 120px;
}

.price-amount {
  font-weight: 500;
  color: #059669;
}

.description-cell {
  color: #64748b;
  min-width: 150px;
  max-width: 200px;
}

.description-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.supplier-cell {
  color: #374151;
  min-width: 120px;
}

.supplier-name {
  font-weight: 500;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-badge.material {
  background: #dbeafe;
  color: #1e40af;
}

.category-badge.salary {
  background: #dcfce7;
  color: #166534;
}

.category-badge.utility {
  background: #fef3c7;
  color: #92400e;
}

.category-badge.other {
  background: #fee2e2;
  color: #991b1b;
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

.expense-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.expense-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expense-card.selected {
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

.expense-category {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.category-icon {
  width: 20px;
  height: 20px;
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

.card-total {
  font-size: 16px;
  color: #059669;
  font-weight: 600;
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

.expense-profile {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.profile-category {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.profile-category-icon {
  width: 32px;
  height: 32px;
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

.profile-total {
  font-size: 18px;
  color: #059669;
  font-weight: 600;
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
  {/* </merged_code> */}
}
</style>