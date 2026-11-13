<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const props = defineProps<{ labels: string[]; values: number[]; label?: string }>()
const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label ?? 'Harga',
      data: props.values,
      borderColor: '#0f172a',
      backgroundColor: 'rgba(15,23,42,0.06)',
      tension: 0.3,
      fill: true,
      pointRadius: 0,
    },
  ],
}))
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#e2e8f0' } },
  },
} as const
</script>
<template>
  <div class="h-64">
    <Line :data="data" :options="options" />
  </div>
</template>
