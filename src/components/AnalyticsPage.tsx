import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { QuotationService } from '@/services/quotationService';
import { type QuotationRecord } from '@/types/quotation';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#3b82f6',
  rejected: '#ef4444',
  completed: '#22c55e',
  exported: '#6366f1',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  completed: 'Completada',
  exported: 'Exportada',
};

const statusChartConfig: ChartConfig = {
  pending: { label: 'Pendiente', color: '#f59e0b' },
  approved: { label: 'Aprobada', color: '#3b82f6' },
  rejected: { label: 'Rechazada', color: '#ef4444' },
  completed: { label: 'Completada', color: '#22c55e' },
  exported: { label: 'Exportada', color: '#6366f1' },
};

const monthlyChartConfig: ChartConfig = {
  count: { label: 'Cotizaciones', color: 'hsl(var(--primary))' },
};

const procedureChartConfig: ChartConfig = {
  count: { label: 'Frecuencia', color: 'hsl(var(--primary))' },
};

const hospitalChartConfig: ChartConfig = {
  count: { label: 'Cotizaciones', color: '#6366f1' },
};

const costRangeChartConfig: ChartConfig = {
  count: { label: 'Cotizaciones', color: '#22c55e' },
};

function getAvgCost(q: QuotationRecord) {
  return (q.estimated_cost_min + q.estimated_cost_max) / 2;
}

const AnalyticsPage = () => {
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    totalValue: 0,
    avgValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [quotationsRes, statsRes] = await Promise.all([
          QuotationService.getQuotations(1000, 0),
          QuotationService.getQuotationStats(),
        ]);
        setQuotations(quotationsRes.quotations);
        setStats(statsRes);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // -- Computed data --

  const approvalRate = stats.total > 0
    ? (((stats.approved + stats.completed) / stats.total) * 100).toFixed(1)
    : '0';

  // Status distribution for pie chart
  const statusData = Object.entries(
    quotations.reduce<Record<string, number>>((acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    status,
    fill: STATUS_COLORS[status] || '#94a3b8',
  }));

  // Monthly bar chart
  const monthlyData = (() => {
    const grouped: Record<string, number> = {};
    quotations.forEach(q => {
      const d = new Date(q.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => {
        const [y, m] = month.split('-');
        const date = new Date(parseInt(y), parseInt(m) - 1);
        return {
          month: date.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }),
          count,
        };
      });
  })();

  // Top 5 procedures
  const procedureData = (() => {
    const grouped: Record<string, number> = {};
    quotations.forEach(q => {
      grouped[q.procedure_name] = (grouped[q.procedure_name] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name: name.length > 25 ? name.slice(0, 25) + '…' : name, count, fullName: name }));
  })();

  // Hospital distribution
  const hospitalData = (() => {
    const grouped: Record<string, number> = {};
    quotations.forEach(q => {
      const short = q.hospital.replace(/^Hospital Ángeles\s*/, 'H.A. ');
      grouped[short] = (grouped[short] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name: name.length > 30 ? name.slice(0, 30) + '…' : name, count }));
  })();

  // Cost ranges
  const costRangeData = (() => {
    const ranges = [
      { label: '$0 - 50k', min: 0, max: 50000 },
      { label: '$50k - 100k', min: 50000, max: 100000 },
      { label: '$100k - 200k', min: 100000, max: 200000 },
      { label: '$200k+', min: 200000, max: Infinity },
    ];
    return ranges.map(r => ({
      name: r.label,
      count: quotations.filter(q => {
        const avg = getAvgCost(q);
        return avg >= r.min && avg < r.max;
      }).length,
    }));
  })();

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-3">Cargando analítica...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-bold text-primary-500">
              Analítica
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Resumen y métricas de cotizaciones
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total cotizaciones</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <p className="text-lg sm:text-2xl font-bold truncate">${stats.totalValue.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Valor acumulado</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <p className="text-lg sm:text-2xl font-bold truncate">${Math.round(stats.avgValue).toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Ticket promedio</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold">{approvalRate}%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Tasa de aprobación</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Status distribution pie */}
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-2">
              <CardTitle className="text-base sm:text-lg">Distribución por estado</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {statusData.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <ChartContainer config={statusChartConfig} className="mx-auto aspect-square max-h-[240px] flex-1">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                        {statusData.map((entry) => (
                          <Cell key={entry.status} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="flex flex-row flex-wrap sm:flex-col gap-2 sm:gap-3 justify-center">
                    {statusData.map((entry) => (
                      <div key={entry.status} className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                        <span className="text-sm text-muted-foreground">{entry.name}</span>
                        <span className="text-sm font-bold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Sin datos</p>
              )}
            </CardContent>
          </Card>

          {/* Monthly bar chart */}
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-2">
              <CardTitle className="text-base sm:text-lg">Cotizaciones por mes</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {monthlyData.length > 0 ? (
                <ChartContainer config={monthlyChartConfig} className="aspect-video max-h-[280px]">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">Sin datos</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Top 5 procedures */}
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-2">
              <CardTitle className="text-base sm:text-lg">Top 5 procedimientos</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {procedureData.length > 0 ? (
                <ChartContainer config={procedureChartConfig} className="aspect-video max-h-[280px]">
                  <BarChart data={procedureData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={11} width={130} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">Sin datos</p>
              )}
            </CardContent>
          </Card>

          {/* Hospital distribution */}
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-2">
              <CardTitle className="text-base sm:text-lg">Distribución por hospital</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {hospitalData.length > 0 ? (
                <ChartContainer config={hospitalChartConfig} className="aspect-video max-h-[280px]">
                  <BarChart data={hospitalData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={11} width={140} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">Sin datos</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cost range chart */}
        <Card>
          <CardHeader className="p-3 sm:p-6 pb-2">
            <CardTitle className="text-base sm:text-lg">Distribución por rango de costos</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            {costRangeData.length > 0 ? (
              <ChartContainer config={costRangeChartConfig} className="aspect-[2/1] max-h-[260px]">
                <BarChart data={costRangeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
