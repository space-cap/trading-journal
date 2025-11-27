import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';
import { StatsCard } from './charts/StatsCard';
import { CumulativePnlChart } from './charts/CumulativePnlChart';
import { MonthlyPnlChart } from './charts/MonthlyPnlChart';
import { SymbolDistributionChart } from './charts/SymbolDistributionChart';
import { ProfitCalendar } from './charts/ProfitCalendar';
import {
    aggregateByMonth,
    aggregateBySymbol,
    getCumulativeData,
    calculateStats,
} from '../utils/chartUtils';

interface Props {
    trades: Trade[];
}

export const DashboardChart: React.FC<Props> = ({ trades }) => {
    const { t } = useTranslation();

    // 데이터 처리
    const cumulativeData = useMemo(() => getCumulativeData(trades), [trades]);
    const monthlyData = useMemo(() => aggregateByMonth(trades), [trades]);
    const symbolData = useMemo(() => aggregateBySymbol(trades), [trades]);
    const stats = useMemo(() => calculateStats(trades), [trades]);

    return (
        <div className="mb-4">
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                <StatsCard
                    title={t('dashboard.totalPnl')}
                    value={stats.totalPnl}
                    color={stats.totalPnl >= 0 ? 'green' : 'red'}
                    icon="💰"
                />
                <StatsCard
                    title={t('dashboard.winRate')}
                    value={`${stats.winRate}%`}
                    color="blue"
                    icon="📊"
                />
                <StatsCard
                    title={t('dashboard.avgPnl')}
                    value={stats.avgPnl}
                    color={stats.avgPnl >= 0 ? 'green' : 'red'}
                    icon="📈"
                />
                <StatsCard
                    title={t('dashboard.maxProfit')}
                    value={stats.maxProfit}
                    color="purple"
                    icon="🎯"
                />
            </div>

            {/* 차트 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CumulativePnlChart data={cumulativeData} />
                <MonthlyPnlChart data={monthlyData} />
            </div>

            {/* 종목별 분포 */}
            {symbolData.length > 0 && (
                <div className="grid grid-cols-1 mb-4">
                    <SymbolDistributionChart data={symbolData} />
                </div>
            )}

            {/* 수익 캘린더 */}
            <div className="grid grid-cols-1">
                <ProfitCalendar trades={trades} />
            </div>
        </div>
    );
};
