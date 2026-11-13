// Adapter tren — mudah diganti sumbernya (Google Trends / mock / API lain)
export type TrendPoint = { date: string; score: number }

export interface TrendsAdapter {
  fetchTrends(keyword: string, cityName: string): Promise<TrendPoint[]>
}

export const mockTrendsAdapter: TrendsAdapter = {
  async fetchTrends(keyword: string) {
    const base = Math.floor(Math.random() * 40) + 30
    const points: TrendPoint[] = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const jitter = Math.round((Math.random() - 0.5) * 20)
      points.push({ date: d.toISOString().slice(0, 10), score: Math.max(0, Math.min(100, base + jitter + (keyword.length % 10))) })
    }
    return points
  },
}
