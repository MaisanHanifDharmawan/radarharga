<script setup lang="ts">
import { formatDateID } from '@/lib/format'
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold text-slate-900">Tentang RadarHarga</h1>
    <p class="text-sm text-slate-600 mt-2 leading-relaxed">
      RadarHarga menampilkan harga bahan baku per kota, alert kenaikan/penurunan, tren pencarian, dan kalkulator HPP.
      Ditujukan untuk restoran & reseller, terbuka untuk umum.
    </p>

    <h2 class="font-semibold text-slate-900 mt-6">Sumber data</h2>
    <ul class="text-sm text-slate-600 list-disc list-inside mt-2 space-y-1">
      <li>PIHPS Nasional (Bank Indonesia) — hargapangan.id</li>
      <li>Panel Harga Badan Pangan Nasional — panelharga.badanpangan.go.id</li>
      <li>Google Trends (adapter, bisa diganti)</li>
      <li>Input manual / CSV admin (fallback)</li>
    </ul>
    <p class="text-xs text-slate-500 mt-2">Terakhir diperbarui: {{ formatDateID(new Date().toISOString()) }} · Detail run ada di ingestion_logs (admin).</p>

    <h2 class="font-semibold text-slate-900 mt-6">Metodologi</h2>
    <ul class="text-sm text-slate-600 list-disc list-inside mt-2 space-y-1">
      <li>Perubahan harga: <code>(terbaru - rata-rata N hari)/rata-rata N hari *100</code></li>
      <li>Alert: bandingkan perubahan vs threshold rule, dengan cooldown agar idempotent.</li>
      <li>View publik <code>v_*</code> (security_invoker) agar RLS tetap berlaku.</li>
      <li>Data kompetitor privat — publik hanya agregat jika sampel ≥3.</li>
    </ul>

    <h2 class="font-semibold text-slate-900 mt-6">Disclaimer</h2>
    <p class="text-sm text-slate-600 mt-2">Saran harga dari kalkulator bersifat estimasi, bukan jaminan. Selalu cek harga aktual dan biaya operasionalmu.</p>

    <h2 class="font-semibold text-slate-900 mt-6">Kontak</h2>
    <p class="text-sm text-slate-600 mt-2">Email: halo@radarharga.id · Admin: /admin/login (invite manual)</p>
  </div>
</template>
