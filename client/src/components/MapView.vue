<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { reverseGeocode } from '../utils/geocode'
import { buildInfoWindowContent } from '../utils/infoWindow'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID

const props = defineProps({
  onSaveLocation: {
    type: Function,
    required: true,
  },
})

const mapEl = ref(null)

let map = null
let marker = null
let infoWindow = null
let clickListener = null

const center = { lat: -33.8688, lng: 151.2093 }

// prevent stale updates
let lastToken = 0
let abortCtrl = null

function setInfoWindow(position, address) {
  infoWindow.setContent(
    buildInfoWindowContent({
      lat: position.lat,
      lng: position.lng,
      address,
      onSaveLocation: props.onSaveLocation,
    })
  )
  infoWindow.open({ anchor: marker, map })
}

function setLoadingInfoWindow(lat, lng) {
  infoWindow.setContent(`
    <div style="font-family: Roboto, Arial, sans-serif; padding: 8px;">
      <strong>Loading address...</strong><br/>
      ${lat.toFixed(6)}, ${lng.toFixed(6)}
    </div>
  `)
  infoWindow.open({ anchor: marker, map })
}

async function initMap() {
  if (!apiKey || !mapId || !mapEl.value) {
    console.error('Missing map config or map container not ready')
    return
  }

  setOptions({ key: apiKey, v: 'weekly' })

  const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    importLibrary('maps'),
    importLibrary('marker'),
  ])

  map = new Map(mapEl.value, {
    center,
    zoom: 13,
    mapId,
    mapTypeControl: false,
    clickableIcons: false,
  })

  marker = new AdvancedMarkerElement({ map, position: center })
  infoWindow = new google.maps.InfoWindow()

  abortCtrl = new AbortController()
  const t0 = ++lastToken
  const def = await reverseGeocode({ lat: center.lat, lng: center.lng, apiKey, signal: abortCtrl.signal })
  if (t0 === lastToken) setInfoWindow(center, def.address)

  marker.addListener('click', () => infoWindow.open({ anchor: marker, map }))

  clickListener = map.addListener('click', async (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    const position = { lat, lng }

    marker.position = position
    map.panTo(position)

    setLoadingInfoWindow(lat, lng)

    if (abortCtrl) abortCtrl.abort()
    abortCtrl = new AbortController()

    const t = ++lastToken
    const info = await reverseGeocode({ lat, lng, apiKey, signal: abortCtrl.signal })
    if (t !== lastToken) return

    setInfoWindow(position, info.address)
  })
}

onMounted(initMap)

onBeforeUnmount(() => {
  if (clickListener) clickListener.remove()
  if (abortCtrl) abortCtrl.abort()
})
</script>

<template>
  <div ref="mapEl" class="map"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
