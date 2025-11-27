import type { Trade } from '../types/Trade';

/**
 * 월별 데이터 집계
 */
export function aggregateByMonth(trades: Trade[]) {
    const monthlyData = new Map<string, { profit: number; loss: number; count: number }>();

    trades.forEach((trade) => {
        if (!trade.exitDate || !trade.realizedPnl) return;

        const month = new Date(trade.exitDate).toISOString().slice(0, 7); // "2025-11"
        const existing = monthlyData.get(month) || { profit: 0, loss: 0, count: 0 };

        if (trade.realizedPnl > 0) {
            existing.profit += trade.realizedPnl;
        } else {
            existing.loss += Math.abs(trade.realizedPnl);
        }
        existing.count++;

        monthlyData.set(month, existing);
    });

    return Array.from(monthlyData.entries())
        .map(([month, data]) => ({
            month,
            profit: Number(data.profit.toFixed(2)),
            loss: Number(data.loss.toFixed(2)),
            net: Number((data.profit - data.loss).toFixed(2)),
            count: data.count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * 종목별 데이터 집계 (상위 5개 + 기타)
 */
export function aggregateBySymbol(trades: Trade[]) {
    const symbolData = new Map<string, number>();

    trades.forEach((trade) => {
        if (!trade.realizedPnl) return;
        const existing = symbolData.get(trade.symbol) || 0;
        symbolData.set(trade.symbol, existing + trade.realizedPnl);
    });

    // 상위 5개 + 기타
    const sorted = Array.from(symbolData.entries()).sort(
        (a, b) => Math.abs(b[1]) - Math.abs(a[1])
    );

    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5).reduce((sum, [, pnl]) => sum + pnl, 0);

    const result = top5.map(([symbol, pnl]) => ({
        symbol,
        pnl: Number(pnl.toFixed(2)),
    }));

    if (others !== 0) {
        result.push({ symbol: '기타', pnl: Number(others.toFixed(2)) });
    }

    return result;
}

/**
 * 누적 손익 데이터 생성
 */
export function getCumulativeData(trades: Trade[]) {
    const closedTrades = trades
        .filter((t) => t.exitDate && t.realizedPnl !== null)
        .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());

    let cumulative = 0;
    return closedTrades.map((trade) => {
        cumulative += trade.realizedPnl || 0;
        return {
            date: new Date(trade.exitDate!).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
            }),
            cumulative: Number(cumulative.toFixed(2)),
            symbol: trade.symbol,
        };
    });
}

/**
 * 날짜별 손익 집계 (캘린더용)
 */
export function aggregateByDate(trades: Trade[]): Map<string, number> {
    const dateMap = new Map<string, number>();

    trades.forEach((trade) => {
        if (!trade.exitDate || trade.realizedPnl === null) return;

        // YYYY-MM-DD 형식으로 날짜 추출
        const dateStr = new Date(trade.exitDate).toISOString().split('T')[0];
        const existing = dateMap.get(dateStr) || 0;
        dateMap.set(dateStr, existing + trade.realizedPnl);
    });

    return dateMap;
}

/**
 * 통계 계산
 */
export function calculateStats(trades: Trade[]) {
    const closedTrades = trades.filter((t) => t.realizedPnl !== null);
    const total = closedTrades.length;
    const profit = closedTrades.filter((t) => t.realizedPnl! > 0).length;
    const loss = closedTrades.filter((t) => t.realizedPnl! < 0).length;
    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.realizedPnl || 0), 0);
    const avgPnl = total > 0 ? totalPnl / total : 0;
    const winRate = total > 0 ? (profit / total) * 100 : 0;
    const maxProfit = Math.max(...closedTrades.map((t) => t.realizedPnl || 0), 0);
    const maxLoss = Math.min(...closedTrades.map((t) => t.realizedPnl || 0), 0);

    return {
        total,
        profit,
        loss,
        totalPnl: Number(totalPnl.toFixed(2)),
        avgPnl: Number(avgPnl.toFixed(2)),
        winRate: Number(winRate.toFixed(1)),
        maxProfit: Number(maxProfit.toFixed(2)),
        maxLoss: Number(maxLoss.toFixed(2)),
    };
}
