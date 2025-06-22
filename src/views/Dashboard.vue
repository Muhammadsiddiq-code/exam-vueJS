<template>
    <div class="main-layout">
      <Sidebar />
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">Dashboard</h1>
        </div>
  
        <!-- Main Stats -->
        <div class="stats-grid">
          <div class="stat-card" @click="openModal('kirimlar')">
            <div class="stat-icon">
              <DollarSignIcon />
            </div>
            <div class="stat-content">
              <h3>Kirimlar</h3>
              <div class="stat-value">{{ formatNumber(stats.kirimlar) }}</div>
            </div>
          </div>
  
          <div class="stat-card" @click="openModal('chiqim')">
            <div class="stat-icon">
              <CreditCardIcon />
            </div>
            <div class="stat-content">
              <h3>Chiqim</h3>
              <div class="stat-value">{{ formatNumber(stats.chiqim) }}</div>
            </div>
          </div>
  
          <div class="stat-card" @click="openModal('kutilayotgan')">
            <div class="stat-icon">
              <ClockIcon />
            </div>
            <div class="stat-content">
              <h3>Kutilayotgan</h3>
              <div class="stat-value">{{ formatNumber(stats.kutilayotgan) }}</div>
            </div>
          </div>
        </div>
  
        <!-- Manager Stats -->
        <div class="stats-grid" v-for="manager in managerStats" :key="manager.id">
          <div class="stat-card">
            <div class="stat-icon">
              <DollarSignIcon />
            </div>
            <div class="stat-content">
              <h3>{{ manager.name }}</h3>
              <div class="stat-value">{{ formatNumber(manager.kirimlar) }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <CreditCardIcon />
            </div>
            <div class="stat-content">
              <h3>{{ manager.name }}</h3>
              <div class="stat-value">{{ formatNumber(manager.chiqim) }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <ClockIcon />
            </div>
            <div class="stat-content">
              <h3>{{ manager.name }}</h3>
              <div class="stat-value">{{ formatNumber(manager.kutilayotgan) }}</div>
            </div>
          </div>
        </div>
  
        <!-- Warehouse Report -->
        <h2 style="margin: 48px 0 24px 0; font-size: 24px; font-weight: 700;">Omborxona hisobot</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <PackageIcon />
            </div>
            <div class="stat-content">
              <h3>Kirimlar Soni</h3>
              <div class="stat-value">{{ warehouseStats.count }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <DollarSignIcon />
            </div>
            <div class="stat-content">
              <h3>Omborxonadagi Summasi</h3>
              <div class="stat-value">{{ formatNumber(warehouseStats.total) }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <TrendingDownIcon />
            </div>
            <div class="stat-content">
              <h3>Nonvoy rasxodlar</h3>
              <div class="stat-value">{{ formatNumber(warehouseStats.expenses) }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal for detailed stats -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ modalTitle }} Tafsilotlari</h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <div class="modal-content">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Tavsif</th>
                    <th>Summa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in modalData" :key="item.id">
                    <td>{{ formatDate(item.date) }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ formatNumber(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Layout/Sidebar.vue'
  import { 
    DollarSignIcon, 
    CreditCardIcon, 
    ClockIcon, 
    PackageIcon, 
    TrendingDownIcon 
  } from 'lucide-vue-next'
  
  export default {
    name: 'Dashboard',
    components: {
      Sidebar,
      DollarSignIcon,
      CreditCardIcon,
      ClockIcon,
      PackageIcon,
      TrendingDownIcon
    },
    data() {
      return {
        showModal: false,
        modalTitle: '',
        modalData: [],
        stats: {
          kirimlar: 0,
          chiqim: 0,
          kutilayotgan: 0
        },
        managerStats: [
          {
            id: 1,
            name: 'Azamjon',
            kirimlar: 0,
            chiqim: 0,
            kutilayotgan: 0
          }
        ],
        warehouseStats: {
          count: 1,
          total: 30500000,
          expenses: 0
        }
      }
    },
    methods: {
      formatNumber(num) {
        return new Intl.NumberFormat('uz-UZ').format(num)
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString('uz-UZ')
      },
      openModal(type) {
        this.modalTitle = type === 'kirimlar' ? 'Kirimlar' : 
                         type === 'chiqim' ? 'Chiqimlar' : 'Kutilayotgan'
        
        // Sample data - replace with actual API call
        this.modalData = [
          {
            id: 1,
            date: new Date(),
            description: 'Non sotish',
            amount: 150000
          },
          {
            id: 2,
            date: new Date(),
            description: 'Qo\'shimcha xarid',
            amount: 75000
          }
        ]
        
        this.showModal = true
      },
      closeModal() {
        this.showModal = false
      },
      async loadDashboardData() {
        // Load dashboard statistics from API
        try {
          // Replace with actual API calls
          // const response = await api.get('/dashboard/stats')
          // this.stats = response.data.stats
          // this.managerStats = response.data.managerStats
          // this.warehouseStats = response.data.warehouseStats
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        }
      }
    },
    mounted() {
      this.loadDashboardData()
    }
  }
  </script>
  