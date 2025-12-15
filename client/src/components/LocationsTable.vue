<script setup>
import { computed, ref, watch } from 'vue'
import { usePagination } from '../composables/usePagination'
import { formatDate, formatNumber } from '../utils/formatters'

const props = defineProps({
  locations: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  pageSize: { type: Number, default: 5 },
  highlightId: { type: [Number, String], default: null },
})

const wrapper = ref(null)

const {
  currentPage,
  totalPages,
  startIndex,
  pagedItems,
  paginationPages,
  goToPage,
} = usePagination(
  computed(() => props.locations),
  computed(() => props.pageSize),
  { maxButtons: 5 }
)

function pageKey(page, idx) {
  return page === '…' ? `ellipsis-${idx}` : `page-${page}`
}

// Scroll to top when the dataset changes (new save, refresh, etc.)
watch(
  () => props.locations,
  () => {
    requestAnimationFrame(() => {
      wrapper.value?.scrollTo({ top: 0, behavior: 'smooth' })
    })
  },
  { deep: true }
)
</script>

<template>
  <div ref="wrapper" class="locations-table">
    <p v-if="loading" class="status">Loading locations…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else-if="!locations.length" class="empty">
      No locations saved yet.
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Saved At</th>
          </tr>
        </thead>
        <transition-group name="row" tag="tbody">
          <tr v-for="(loc, index) in pagedItems" :key="loc.id" :class="{
            highlight: String(loc.id) === String(highlightId),
            optimistic: !!loc.optimistic,
          }">
            <td>{{ startIndex + index + 1 }}</td>
            <td class="address-cell" :title="loc.address">
              {{ loc.address }}
            </td>
            <td>{{ formatNumber(loc.latitude) }}</td>
            <td>{{ formatNumber(loc.longitude) }}</td>
            <td>{{ formatDate(loc.created_at) }}</td>
          </tr>
        </transition-group>
      </table>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          Prev
        </button>

        <button v-for="(page, idx) in paginationPages" :key="pageKey(page, idx)" :disabled="page === '…'" :class="[
          'page-btn',
          { active: page === currentPage, ellipsis: page === '…' }
        ]" @click="page !== '…' && goToPage(page)">
          {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          Next
        </button>

        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.locations-table {
  overflow-x: auto;
  overflow-y: hidden;
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

.empty {
  margin-top: 0.5rem;
  color: #666;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

th {
  position: sticky;
  top: 0;
  background: #f9f9f9;
  z-index: 1;
}

tbody tr:hover {
  background-color: #f5faff;
}

.address-cell {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

button {
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

.page-btn.active {
  background: #0a5785;
  color: #fff;
  border-color: #0a5785;
}

.page-btn.ellipsis {
  border: none;
  background: transparent;
  font-weight: bold;
  cursor: default;
}

.page-info {
  margin-left: auto;
  font-size: 0.85rem;
  color: #555;
}

.highlight {
  animation: highlightHoldThenFade 5s ease-out;
}

@keyframes highlightHoldThenFade {
  0% {
    background-color: #dbeafe;
  }

  70% {
    background-color: #dbeafe;
  }

  100% {
    background-color: transparent;
  }
}

.optimistic {
  opacity: 0.6;
  font-style: italic;
}

.row-enter-active {
  transition: all 0.25s ease;
}

.row-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
