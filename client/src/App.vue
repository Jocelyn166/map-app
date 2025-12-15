<script setup>
import { onMounted, computed, ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import MapView from './components/MapView.vue'
import LocationsTable from './components/LocationsTable.vue'

const store = useStore()

const locations = computed(() => store.state.locations)
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)

const sidebarOpen = ref(true)
const tableKey = ref(0)
const highlightId = ref(null)

const windowWidth = ref(window.innerWidth)

function onResize() {
  windowWidth.value = window.innerWidth
}
window.addEventListener('resize', onResize)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

onMounted(() => {
  store.dispatch('fetchLocations')
})

async function handleSaveLocation(payload) {
  const saved = await store.dispatch('saveLocation', payload)
  highlightId.value = saved.id
  tableKey.value++
  return saved
}

const toggleArrow = computed(() => {
  return windowWidth.value >= 900
    ? (sidebarOpen.value ? '◀' : '▶')
    : (sidebarOpen.value ? '▼' : '▲')
})

function handleHeaderClick() {
  if (windowWidth.value < 900) sidebarOpen.value = !sidebarOpen.value
}

// Button click always toggles (stop bubbling to header)
function toggleSidebar(e) {
  e?.stopPropagation?.()
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="app-shell">
    <aside :class="['sidebar', sidebarOpen ? 'open' : 'closed']">
      <div class="sidebar-header" @click="handleHeaderClick">
        <div class="header-left">
          <h2 title="Saved Locations">Saved Locations</h2>
          <span class="count">({{ locations.length }})</span>
        </div>
        <button class="toggle-btn" @click="toggleSidebar" type="button" aria-label="Toggle saved locations">
          {{ toggleArrow }}
        </button>
      </div>

      <div class="sidebar-body" v-if="sidebarOpen">
        <p v-if="loading" class="status">Loading…</p>
        <p v-if="error" class="error">{{ error }}</p>
        <LocationsTable :key="tableKey" :locations="locations" :loading="loading" :error="error" :page-size="5"
          :highlight-id="highlightId" />
      </div>
    </aside>

    <main class="map-container">
      <MapView :onSaveLocation="handleSaveLocation" />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 80vw;
  height: 80vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04);
}

.sidebar {
  width: 380px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 220ms ease, height 220ms ease;
  z-index: 2;
}

.sidebar.closed {
  width: 56px;
}

.sidebar.closed .header-left {
  display: none;
}

.sidebar.closed .sidebar-header {
  justify-content: center;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  min-width: 0;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.count {
  font-size: 0.9rem;
  color: #6b7280;
}

.toggle-btn {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0a5785;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: #f9fafb;
  transform: scale(1.06);
}

.sidebar-body {
  padding: 0.75rem;
  overflow: hidden;
}

.map-container {
  flex: 1;
  height: 100%;
}

.status {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.error {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.9rem;
  color: #b00020;
}

@media (max-width: 900px) {

  .app-shell {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
    position: relative;
    overflow: hidden;
  }

  .map-container {
    width: 90%;
    height: 100%;
  }

  .sidebar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    border-right: none;
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.08);
    z-index: 10;
    transition: height 0.25s ease;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
  }

  .sidebar.closed .header-left {
    display: flex;
  }

  .sidebar.closed .sidebar-header {
    justify-content: space-between;
  }

  .sidebar.closed {
    width: 100%;
    height: 64px;
  }

  .sidebar.open {
    height: min(55vh, 520px);
  }

  .sidebar-header {
    cursor: pointer;
    padding: 0.75rem 1rem;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .sidebar-header h2 {
    overflow: visible;
    text-overflow: clip;
    white-space: nowrap;
  }

  .sidebar-body {
    height: calc(100% - 64px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 1rem;
  }

  .toggle-btn {
    padding: 4px 8px;
  }
}
</style>
