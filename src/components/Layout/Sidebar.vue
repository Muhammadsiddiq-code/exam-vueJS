<template>
    <div class="sidebar" :class="{ open: isOpen }">
      <div class="logo">SAFO-NON</div>
      
      <nav class="nav-menu">
        <ul>
          <li class="nav-item" v-for="item in menuItems" :key="item.name">
            <router-link 
              :to="item.path" 
              class="nav-link"
              :class="{ active: $route.name === item.name }"
            >
              <component :is="item.icon" class="nav-icon" />
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
  
      <div class="user-section">
        <span class="user-name">{{ currentUser.name }}</span>
        <button class="logout-btn" @click="logout" title="Chiqish">
          <LogOutIcon />
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { 
    HomeIcon, 
    UsersIcon, 
    TruckIcon, 
    StoreIcon, 
    CreditCardIcon, 
    PackageIcon, 
    BreadIcon, 
    SettingsIcon,
    LogOutIcon 
  } from 'lucide-vue-next'
  
  export default {
    name: 'Sidebar',
    components: {
      HomeIcon,
      UsersIcon, 
      TruckIcon, 
      StoreIcon, 
      CreditCardIcon, 
      PackageIcon, 
      BreadIcon, 
      SettingsIcon,
      LogOutIcon
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentUser: {
          name: 'Admin'
        },
        menuItems: [
          { name: 'Dashboard', label: 'Dashboard', path: '/', icon: 'HomeIcon' },
          { name: 'Managers', label: 'Managerlar', path: '/managers', icon: 'UsersIcon' },
          { name: 'Workers', label: 'Nonvoylar', path: '/workers', icon: 'UsersIcon' },
          { name: 'Delivery', label: 'Yetkazuvchilar', path: '/delivery', icon: 'TruckIcon' },
          { name: 'Stores', label: "Do'konlar", path: '/stores', icon: 'StoreIcon' },
          { name: 'Expenses', label: 'Chiqimlar', path: '/expenses', icon: 'CreditCardIcon' },
          { name: 'Warehouse', label: 'Omborxona', path: '/warehouse', icon: 'PackageIcon' },
          { name: 'BreadTypes', label: 'Non turlari', path: '/bread-types', icon: 'BreadIcon' },
          { name: 'Settings', label: 'Sozlamalar', path: '/settings', icon: 'SettingsIcon' }
        ]
      }
    },
    methods: {
      logout() {
        this.$router.push('/login')
      }
    }
  }
  </script>
  