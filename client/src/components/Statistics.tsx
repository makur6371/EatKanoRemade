import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { trpc } from '@/lib/trpc';

interface StatisticsProps {
  selectedYear?: number;
}

export default function Statistics({ selectedYear }: StatisticsProps) {
  const { data: allStats = [] } = trpc.statistics.all.useQuery();

  // Prepare chart data
  const chartData = useMemo(() => {
    return allStats.map((stat) => ({
      year: stat.year,
      distance: Math.round((stat.totalFlightDistance || 0) / 1000), // Convert to thousands
      countries: stat.countriesVisited || 0,
      domestic: stat.domesticVisits || 0,
      international: stat.internationalVisits || 0,
      handshakes: stat.handshakesCount || 0,
      speeches: stat.speechesCount || 0,
    }));
  }, [allStats]);

  // Current year statistics
  const currentYearStat = useMemo(() => {
    return allStats.find((s) => s.year === selectedYear);
  }, [allStats, selectedYear]);

  // Pie chart data for current year
  const pieData = useMemo(() => {
    if (!currentYearStat) return [];
    return [
      { name: 'Domestic', value: currentYearStat.domesticVisits || 0, fill: '#8B0000' },
      { name: 'International', value: currentYearStat.internationalVisits || 0, fill: '#0039A6' },
    ];
  }, [currentYearStat]);

  return (
    <div className="w-full bg-card border border-border rounded-lg p-6 space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Статистика и визуализация</h2>
        <p className="text-muted-foreground">Анализ 25-летней деятельности</p>
      </div>

      {/* Current year summary */}
      {currentYearStat && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-accent">
              {Math.round((currentYearStat.totalFlightDistance || 0) / 1000)}K
            </div>
            <div className="text-xs text-muted-foreground mt-1">км пройдено</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-primary">
              {currentYearStat.countriesVisited || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">стран посещено</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-secondary">
              {currentYearStat.handshakesCount || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">рукопожатий</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-accent">
              {currentYearStat.speechesCount || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">речей</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Distance Chart */}
        <div className="bg-muted/10 rounded-lg p-4 border border-border">
          <h3 className="text-lg font-bold text-primary mb-4">Пройденное расстояние (тыс. км)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.2)" />
              <XAxis dataKey="year" stroke="rgba(212, 175, 55, 0.5)" />
              <YAxis stroke="rgba(212, 175, 55, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 15, 15, 0.9)',
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#D4AF37' }}
              />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: '#8B0000', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Countries Visited Chart */}
        <div className="bg-muted/10 rounded-lg p-4 border border-border">
          <h3 className="text-lg font-bold text-primary mb-4">Посещённые страны</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.2)" />
              <XAxis dataKey="year" stroke="rgba(212, 175, 55, 0.5)" />
              <YAxis stroke="rgba(212, 175, 55, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 15, 15, 0.9)',
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#D4AF37' }}
              />
              <Bar dataKey="countries" fill="#0039A6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Visits Breakdown */}
        <div className="bg-muted/10 rounded-lg p-4 border border-border">
          <h3 className="text-lg font-bold text-primary mb-4">Визиты по типам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.2)" />
              <XAxis dataKey="year" stroke="rgba(212, 175, 55, 0.5)" />
              <YAxis stroke="rgba(212, 175, 55, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 15, 15, 0.9)',
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#D4AF37' }}
              />
              <Legend />
              <Bar dataKey="domestic" fill="#8B0000" name="Внутренние" radius={[8, 8, 0, 0]} />
              <Bar dataKey="international" fill="#0039A6" name="Международные" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Current Year Pie Chart */}
        {currentYearStat && (
          <div className="bg-muted/10 rounded-lg p-4 border border-border">
            <h3 className="text-lg font-bold text-primary mb-4">Распределение визитов {selectedYear}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 15, 15, 0.9)',
                    border: '2px solid #D4AF37',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#D4AF37' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="bg-gradient-kremlin rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">Итого за 1999–2025:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-bold text-lg">
              {Math.round(
                allStats.reduce((sum, s) => sum + (s.totalFlightDistance || 0), 0) / 1000000
              )}M
            </div>
            <div className="opacity-90">км пройдено</div>
          </div>
          <div>
            <div className="font-bold text-lg">
              {allStats.length > 0 ? Math.max(...allStats.map((s) => s.countriesVisited || 0)) : 0}
            </div>
            <div className="opacity-90">макс. стран</div>
          </div>
          <div>
            <div className="font-bold text-lg">
              {allStats.reduce((sum, s) => sum + (s.handshakesCount || 0), 0)}
            </div>
            <div className="opacity-90">рукопожатий</div>
          </div>
          <div>
            <div className="font-bold text-lg">
              {allStats.reduce((sum, s) => sum + (s.speechesCount || 0), 0)}
            </div>
            <div className="opacity-90">речей</div>
          </div>
        </div>
      </div>
    </div>
  );
}
