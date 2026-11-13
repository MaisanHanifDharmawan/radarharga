import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Publik (tanpa login) — layout PublicLayout
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/features/home/HomeView.vue'), meta: { title: 'Price Radar — Harga bahan baku hari ini per kota' } },
        { path: 'harga', name: 'prices', component: () => import('@/features/prices/PricesView.vue'), meta: { title: 'Semua harga — Price Radar' } },
        { path: 'harga/:slug', name: 'price-detail', component: () => import('@/features/prices/CommodityDetailView.vue'), props: true, meta: { title: 'Detail komoditas — Price Radar' } },
        { path: 'tren', name: 'trends', component: () => import('@/features/trends/TrendsView.vue'), meta: { title: 'Tren pencarian — Price Radar' } },
        { path: 'alert', name: 'alerts', component: () => import('@/features/alerts/AlertsView.vue'), meta: { title: 'Alert harga — Price Radar' } },
        { path: 'alert/:id', name: 'alert-detail', component: () => import('@/features/alerts/AlertDetailView.vue'), props: true, meta: { title: 'Alert — Price Radar' } },
        { path: 'kalkulator', name: 'calculator', component: () => import('@/features/calculator/CalculatorView.vue'), meta: { title: 'Kalkulator dampak harga — Price Radar' } },
        { path: 'langganan', name: 'subscribe', component: () => import('@/features/subscribe/SubscribeView.vue'), meta: { title: 'Berlangganan alert — Price Radar' } },
        { path: 'langganan/verifikasi', name: 'verify-subscription', component: () => import('@/features/subscribe/VerifyView.vue'), meta: { title: 'Verifikasi langganan — Price Radar' } },
        { path: 'berhenti', name: 'unsubscribe', component: () => import('@/features/subscribe/UnsubscribeView.vue'), meta: { title: 'Berhenti berlangganan — Price Radar' } },
        { path: 'tentang', name: 'about', component: () => import('@/features/about/AboutView.vue'), meta: { title: 'Tentang — Price Radar' } },
      ],
    },
    // Admin auth (tanpa layout)
    { path: '/admin/login', name: 'admin-login', component: () => import('@/features/auth/LoginView.vue'), meta: { guest: true } },
    // Admin area (guard)
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/features/dashboard/DashboardView.vue') },
        { path: 'commodities', name: 'admin-commodities', component: () => import('@/features/commodities/CommoditiesView.vue') },
        { path: 'cities', name: 'admin-cities', component: () => import('@/features/admin/CitiesView.vue') },
        { path: 'prices', name: 'admin-prices', component: () => import('@/features/admin/PricesView.vue') },
        { path: 'competitors', name: 'admin-competitors', component: () => import('@/features/competitors/CompetitorsView.vue') },
        { path: 'keywords', name: 'admin-keywords', component: () => import('@/features/admin/KeywordsView.vue') },
        { path: 'alerts', name: 'admin-alerts', component: () => import('@/features/admin/AlertsView.vue') },
        { path: 'rules', name: 'admin-rules', component: () => import('@/features/admin/RulesView.vue') },
        { path: 'templates', name: 'admin-templates', component: () => import('@/features/admin/TemplatesView.vue') },
        { path: 'subscribers', name: 'admin-subscribers', component: () => import('@/features/admin/SubscribersView.vue') },
        { path: 'sources', name: 'admin-sources', component: () => import('@/features/admin/SourcesView.vue') },
        { path: 'trends', name: 'admin-trends', component: () => import('@/features/trends/TrendsView.vue') },
        { path: 'menu', name: 'admin-menu', component: () => import('@/features/menu/MenuView.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('@/features/settings/SettingsView.vue') },
      ],
    },
    // legacy redirects
    { path: '/login', redirect: '/admin/login' },
    { path: '/register', redirect: '/admin/login' },
    { path: '/commodities', redirect: '/harga' },
    { path: '/commodities/:id', redirect: (to) => `/harga/${to.params.id}` },
    { path: '/competitors', redirect: '/admin/competitors' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title as string
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()

  const supabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  if (!supabaseConfigured) return true

  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'admin-login' }
  if (to.meta.guest && auth.isAuthenticated) return { name: 'admin-dashboard' }
  return true
})

export default router
