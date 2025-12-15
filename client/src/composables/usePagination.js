import { ref, computed, watch } from 'vue'

export function usePagination(itemsRef, pageSizeRef, options = {}) {
  const currentPage = ref(options.initialPage ?? 1)

  const totalPages = computed(() => {
    const total = Math.ceil(itemsRef.value.length / pageSizeRef.value)
    return Math.max(1, total)
  })

  const startIndex = computed(() => (currentPage.value - 1) * pageSizeRef.value)

  const pagedItems = computed(() => {
    const start = startIndex.value
    return itemsRef.value.slice(start, start + pageSizeRef.value)
  })

  function goToPage(page) {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  }

  const paginationPages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const maxButtons = options.maxButtons ?? 5

    if (total <= maxButtons + 2) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages = [1]
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)

    if (start > 2) pages.push('…')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < total - 1) pages.push('…')

    pages.push(total)
    return pages
  })

  // Keep page valid when items change
  watch(
    () => itemsRef.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
      }
    }
  )

  function reset() {
    currentPage.value = 1
  }

  return {
    currentPage,
    totalPages,
    startIndex,
    pagedItems,
    paginationPages,
    goToPage,
    reset,
  }
}
