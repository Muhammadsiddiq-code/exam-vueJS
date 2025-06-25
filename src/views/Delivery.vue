<template>
    <div class="main-layout">
      <Sidebar />
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">Yetkazuvchilar</h1>
          <button class="btn btn-primary" @click="openCreateModal">
            <PlusIcon />
            Yetkazuvchi qo'shish
          </button>
        </div>
  
        <div class="stats-grid" style="margin-bottom: 32px;">
          <div class="stat-card">
            <div class="stat-icon">
              <TruckIcon />
            </div>
            <div class="stat-content">
              <h3>Jami yetkazuvchilar</h3>
              <div class="stat-value">{{ deliveryPersons.length }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <CheckCircleIcon />
            </div>
            <div class="stat-content">
              <h3>Faol yetkazuvchilar</h3>
              <div class="stat-value">{{ activeDeliveryPersons }}</div>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <PackageIcon />
            </div>
            <div class="stat-content">
              <h3>Bugungi yetkazishlar</h3>
              <div class="stat-value">{{ todayDeliveries }}</div>
            </div>
          </div>
        </div>
  
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Ismi</th>
                <th>Telefon</th>
                <th>Transport turi</th>
                <th>Holati</th>
                <th>Yetkazishlar soni</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(person, index) in deliveryPersons" :key="person.id">
                <td>{{ index + 1 }}</td>
                <td>{{ person.name }}</td>
                <td>{{ person.phone }}</td>
                <td>{{ getTransportName(person.transportType) }}</td>
                <td>
                  <span :class="['status-badge', person.status]">
                    {{ person.status === 'active' ? 'Faol' : person.status === 'busy' ? 'Band' : 'Nofaol' }}
                  </span>
                </td>
                <td>{{ person.deliveryCount }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewDeliveries(person)" title="Yetkazishlar">
                      <PackageIcon />
                    </button>
                    <button class="action-btn edit" @click="editPerson(person)" title="Tahrirlash">
                      <EditIcon />
                    </button>
                    <button class="action-btn delete" @click="deletePerson(person)" title="O'chirish">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ isEditing ? 'Yetkazuvchi tahrirlash' : 'Yetkazuvchi qo\'shish' }}
            </h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          
          <form @submit.prevent="savePerson">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Ismi</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentPerson.name"
                  placeholder="Yetkazuvchi ismini kiriting"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Telefon raqami</label>
                <input 
                  type="tel" 
                  class="form-input" 
                  v-model="currentPerson.phone"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Transport turi</label>
                <select class="form-select" v-model="currentPerson.transportType" required>
                  <option value="">Transport turini tanlang</option>
                  <option value="car">Mashina</option>
                  <option value="motorcycle">Mototsikl</option>
                  <option value="bicycle">Velosiped</option>
                  <option value="walking">Piyoda</option>
                </select>
              </div>
  
              <div class="form-group">
                <label class="form-label">Transport raqami</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentPerson.vehicleNumber"
                  placeholder="01 A 123 BC"
                />
              </div>
  
              <div class="form-group">
                <label class="form-label">Holati</label>
                <select class="form-select" v-model="currentPerson.status" required>
                  <option value="active">Faol</option>
                  <option value="busy">Band</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>
  
              <div class="form-group">
                <label class="form-label">Ish boshlagan sana</label>
                <input 
                  type="date" 
                  class="form-input" 
                  v-model="currentPerson.startDate"
                  required
                />
              </div>
            </div>
  
            <div class="form-group">
              <label class="form-label">Manzil</label>
              <textarea 
                class="form-textarea" 
                v-model="currentPerson.address"
                placeholder="Yetkazuvchi manzilini kiriting"
                required
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
  
      <div v-if="showDeliveriesModal" class="modal-overlay" @click="closeDeliveriesModal">
        <div class="modal large-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ selectedPerson.name }} - Yetkazishlar</h3>
            <button class="close-btn" @click="closeDeliveriesModal">&times;</button>
          </div>
          
          <div class="deliveries-content">
            <div class="deliveries-stats">
              <div class="delivery-stat">
                <strong>Bugun:</strong> {{ getTodayDeliveries(selectedPerson.id) }}
              </div>
              <div class="delivery-stat">
                <strong>Bu hafta:</strong> {{ getWeekDeliveries(selectedPerson.id) }}
              </div>
              <div class="delivery-stat">
                <strong>Bu oy:</strong> {{ getMonthDeliveries(selectedPerson.id) }}
              </div>
            </div>
  
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Do'kon</th>
                    <th>Mahsulot</th>
                    <th>Miqdor</th>
                    <th>Holati</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="delivery in getPersonDeliveries(selectedPerson.id)" :key="delivery.id">
                    <td>{{ formatDate(delivery.date) }}</td>
                    <td>{{ delivery.storeName }}</td>
                    <td>{{ delivery.productName }}</td>
                    <td>{{ delivery.quantity }}</td>
                    <td>
                      <span :class="['status-badge', delivery.status]">
                        {{ getDeliveryStatusName(delivery.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Layout/Sidebar.vue'
  import { 
    PlusIcon, 
    EditIcon, 
    TrashIcon, 
    TruckIcon, 
    CheckCircleIcon, 
    PackageIcon 
  } from 'lucide-vue-next'
  
  export default {
    name: 'Delivery',
    components: {
      Sidebar,
      PlusIcon,
      EditIcon,
      TrashIcon,
      TruckIcon,
      CheckCircleIcon,
      PackageIcon
    },
    data() {
      return {
        deliveryPersons: [
          {
            id: 1,
            name: 'Jasur Toshmatov',
            phone: '+998 90 123 45 67',
            transportType: 'car',
            vehicleNumber: '01 A 123 BC',
            status: 'active',
            startDate: '2024-01-15',
            address: 'Toshkent shahar, Mirobod tumani',
            deliveryCount: 45
          },
          {
            id: 2,
            name: 'Bekzod Karimov',
            phone: '+998 91 234 56 78',
            transportType: 'motorcycle',
            vehicleNumber: '01 B 456 DE',
            status: 'busy',
            startDate: '2024-02-20',
            address: 'Toshkent shahar, Yunusobod tumani',
            deliveryCount: 32
          }
        ],
        deliveries: [
          {
            id: 1,
            deliveryPersonId: 1,
            date: new Date().toISOString().split('T')[0],
            storeName: 'Mega Planet',
            productName: 'Oq non',
            quantity: '50 dona',
            status: 'completed'
          },
          {
            id: 2,
            deliveryPersonId: 1,
            date: new Date().toISOString().split('T')[0],
            storeName: 'Samarqand Darvoza',
            productName: 'Qora non',
            quantity: '30 dona',
            status: 'pending'
          }
        ],
        showModal: false,
        showDeliveriesModal: false,
        isEditing: false,
        loading: false,
        selectedPerson: {},
        currentPerson: {
          name: '',
          phone: '',
          transportType: '',
          vehicleNumber: '',
          status: 'active',
          startDate: '',
          address: ''
        },
        toast: {
          show: false,
          type: 'success',
          message: ''
        }
      }
    },
    computed: {
      activeDeliveryPersons() {
        return this.deliveryPersons.filter(p => p.status === 'active').length
      },
      todayDeliveries() {
        const today = new Date().toISOString().split('T')[0]
        return this.deliveries.filter(d => d.date === today).length
      }
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('uz-UZ')
      },
      getTransportName(type) {
        const types = {
          car: 'Mashina',
          motorcycle: 'Mototsikl',
          bicycle: 'Velosiped',
          walking: 'Piyoda'
        }
        return types[type] || type
      },
      getDeliveryStatusName(status) {
        const statuses = {
          completed: 'Bajarildi',
          pending: 'Kutilmoqda',
          cancelled: 'Bekor qilindi'
        }
        return statuses[status] || status
      },
      getTodayDeliveries(personId) {
        const today = new Date().toISOString().split('T')[0]
        return this.deliveries.filter(d => d.deliveryPersonId === personId && d.date === today).length
      },
      getWeekDeliveries(personId) {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return this.deliveries.filter(d => 
          d.deliveryPersonId === personId && 
          new Date(d.date) >= weekAgo
        ).length
      },
      getMonthDeliveries(personId) {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return this.deliveries.filter(d => 
          d.deliveryPersonId === personId && 
          new Date(d.date) >= monthAgo
        ).length
      },
      getPersonDeliveries(personId) {
        return this.deliveries.filter(d => d.deliveryPersonId === personId)
      },
      openCreateModal() {
        this.isEditing = false
        this.currentPerson = {
          name: '',
          phone: '',
          transportType: '',
          vehicleNumber: '',
          status: 'active',
          startDate: '',
          address: ''
        }
        this.showModal = true
      },
      editPerson(person) {
        this.isEditing = true
        this.currentPerson = { ...person }
        this.showModal = true
      },
      viewDeliveries(person) {
        this.selectedPerson = person
        this.showDeliveriesModal = true
      },
      deletePerson(person) {
        if (confirm(`Haqiqatan ham ${person.name} nomli yetkazuvchini o'chirmoqchimisiz?`)) {
          this.deliveryPersons = this.deliveryPersons.filter(p => p.id !== person.id)
          this.showToast('Yetkazuvchi muvaffaqiyatli o\'chirildi', 'success')
        }
      },
      closeModal() {
        this.showModal = false
      },
      closeDeliveriesModal() {
        this.showDeliveriesModal = false
      },
      async savePerson() {
        this.loading = true
        
        try {
          if (this.isEditing) {
            const index = this.deliveryPersons.findIndex(p => p.id === this.currentPerson.id)
            if (index !== -1) {
              this.deliveryPersons[index] = { ...this.currentPerson }
            }
            this.showToast('Yetkazuvchi muvaffaqiyatli yangilandi', 'success')
          } else {
            const newPerson = {
              ...this.currentPerson,
              id: Date.now(),
              deliveryCount: 0
            }
            this.deliveryPersons.push(newPerson)
            this.showToast('Yetkazuvchi muvaffaqiyatli qo\'shildi', 'success')
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
  
  .status-badge.busy {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .status-badge.inactive {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  .status-badge.completed {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .status-badge.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .status-badge.cancelled {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  .large-modal {
    max-width: 800px;
  }
  
  .deliveries-content {
    max-height: 500px;
    overflow-y: auto;
  }
  
  .deliveries-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px;
    background-color: #f8fafc;
    border-radius: 8px;
  }
  
  .delivery-stat {
    font-size: 14px;
    color: #475569;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .deliveries-stats {
      flex-direction: column;
      gap: 12px;
    }
  }
  </style>
  