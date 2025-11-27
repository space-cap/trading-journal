import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';
import { CloseTradeModal } from './CloseTradeModal';
import { EditTradeModal } from './EditTradeModal';
import { TradeDetailModal } from './TradeDetailModal';
import { formatRelativeTime, formatDateTime } from '../utils/dateUtils';
import { exportToExcel } from '../utils/exportUtils';

interface Props {
    trades: Trade[];
    onRefresh: () => void;
}

type SortField = 'symbol' | 'entryDate' | 'pnl' | null;
type SortDirection = 'asc' | 'desc';
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

export const TradeList: React.FC<Props> = ({ trades, onRefresh }) => {
    const { t } = useTranslation();
    const [closeModalTrade, setCloseModalTrade] = useState<Trade | null>(null);
    const [editModalTrade, setEditModalTrade] = useState<Trade | null>(null);
    const [detailModalTrade, setDetailModalTrade] = useState<Trade | null>(null);

    // 정렬 상태
    const [sortField, setSortField] = useState<SortField>('entryDate');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // 필터 상태
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

    // 정렬 핸들러
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // 날짜 범위 계산
    const getDateRange = (filter: DateFilter) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case 'today':
                return { start: today, end: new Date() };
            case 'week':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                return { start: weekStart, end: new Date() };
            case 'month':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                return { start: monthStart, end: new Date() };
            case 'custom':
                if (customDateRange.start && customDateRange.end) {
                    return {
                        start: new Date(customDateRange.start),
                        end: new Date(customDateRange.end)
                    };
                }
                return null;
            default:
                return null;
        }
    };

    // 필터링 및 정렬된 매매 목록
    const processedTrades = useMemo(() => {
        // 1. 날짜 필터링
        let filtered = [...trades];
        const range = getDateRange(dateFilter);

        if (range) {
            filtered = filtered.filter(trade => {
                if (!trade.entryDate) return false;
                const entryDate = new Date(trade.entryDate);
                return entryDate >= range.start && entryDate <= range.end;
            });
        }

        // 2. 정렬
        if (sortField) {
            filtered.sort((a, b) => {
                let aValue: any, bValue: any;

                if (sortField === 'entryDate') {
                    aValue = a.entryDate ? new Date(a.entryDate).getTime() : 0;
                    bValue = b.entryDate ? new Date(b.entryDate).getTime() : 0;
                } else if (sortField === 'pnl') {
                    aValue = a.realizedPnl || 0;
                    bValue = b.realizedPnl || 0;
                } else if (sortField === 'symbol') {
                    aValue = a.symbol.toLowerCase();
                    bValue = b.symbol.toLowerCase();
                }

                if (sortDirection === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        return filtered;
    }, [trades, dateFilter, customDateRange, sortField, sortDirection]);

    // 통계 계산
    const stats = useMemo(() => {
        const total = processedTrades.length;
        const profit = processedTrades.filter(t => t.realizedPnl && t.realizedPnl > 0).length;
        const loss = processedTrades.filter(t => t.realizedPnl && t.realizedPnl < 0).length;
        const totalPnl = processedTrades.reduce((sum, t) => sum + (t.realizedPnl || 0), 0);
        const winRate = total > 0 ? ((profit / total) * 100).toFixed(1) : '0.0';

        return { total, profit, loss, totalPnl, winRate };
    }, [processedTrades]);

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('tradeList.actions.confirmDelete'))) {
            return;
        }

        try {
            const response = await fetch(`/api/trades/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                onRefresh();
            } else {
                alert(t('common.error'));
            }
        } catch (error) {
            console.error('Error deleting trade:', error);
            alert(t('common.error'));
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '↕';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-bold mb-4">{t('tradeList.title')}</h2>

            {/* 필터 영역 */}
            <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                    <button
                        onClick={() => setDateFilter('all')}
                        className={`px-3 py-2 md:py-1 rounded text-sm ${dateFilter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {t('tradeList.filters.all')}
                    </button>
                    <button
                        onClick={() => setDateFilter('today')}
                        className={`px-3 py-2 md:py-1 rounded text-sm ${dateFilter === 'today'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {t('tradeList.filters.today')}
                    </button>
                    <button
                        onClick={() => setDateFilter('week')}
                        className={`px-3 py-2 md:py-1 rounded text-sm ${dateFilter === 'week'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {t('tradeList.filters.thisWeek')}
                    </button>
                    <button
                        onClick={() => setDateFilter('month')}
                        className={`px-3 py-2 md:py-1 rounded text-sm ${dateFilter === 'month'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {t('tradeList.filters.thisMonth')}
                    </button>

                    <div className="flex gap-2 items-center w-full md:w-auto mt-2 md:mt-0">
                        <input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => {
                                setCustomDateRange({ ...customDateRange, start: e.target.value });
                                setDateFilter('custom');
                            }}
                            className="flex-1 md:flex-none px-2 py-2 md:py-1 border rounded text-sm"
                            placeholder={t('tradeList.filters.startDate')}
                        />
                        <span className="text-gray-500">~</span>
                        <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => {
                                setCustomDateRange({ ...customDateRange, end: e.target.value });
                                setDateFilter('custom');
                            }}
                            className="flex-1 md:flex-none px-2 py-2 md:py-1 border rounded text-sm"
                            placeholder={t('tradeList.filters.endDate')}
                        />
                    </div>
                </div>

                {/* 내보내기 버튼 */}
                <button
                    onClick={() => exportToExcel(processedTrades, t)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-2"
                    title={t('tradeList.export')}
                >
                    <span>📊</span>
                    <span className="hidden md:inline">{t('tradeList.export')}</span>
                </button>
            </div>

            {/* 통계 요약 */}
            <div className="mb-4 p-3 bg-gray-50 rounded flex flex-wrap gap-4 text-sm">
                <span className="font-medium">
                    {t('tradeList.stats.total', { count: stats.total })}
                </span>
                <span className="text-green-600">
                    {t('tradeList.stats.profit', { count: stats.profit })}
                </span>
                <span className="text-red-600">
                    {t('tradeList.stats.loss', { count: stats.loss })}
                </span>
                <span className={`font-bold ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t('tradeList.stats.totalPnl')}: {stats.totalPnl.toFixed(2)}
                </span>
                <span className="text-gray-600">
                    {t('tradeList.stats.winRate')}: {stats.winRate}%
                </span>
            </div>

            {/* 모바일 카드 뷰 (lg 미만에서 표시) */}
            <div className="lg:hidden space-y-3">
                {processedTrades.map(trade => (
                    <div key={trade.id} className="bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3
                                    className="font-bold text-lg cursor-pointer hover:text-blue-600"
                                    onClick={() => setDetailModalTrade(trade)}
                                >
                                    {trade.symbol}
                                </h3>
                                <div className="text-sm text-gray-500">
                                    {trade.entryDate && formatRelativeTime(trade.entryDate, t)}
                                    {trade.entryDate && ` (${formatDateTime(trade.entryDate)})`}
                                </div>
                            </div>
                            <div className={`text-lg font-bold ${trade.realizedPnl && trade.realizedPnl > 0 ? 'text-green-600' : trade.realizedPnl && trade.realizedPnl < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {trade.realizedPnl ? trade.realizedPnl.toFixed(2) : '-'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3 text-gray-700">
                            <div>
                                <span className="text-gray-500 mr-1">{t('tradeList.columns.entryPrice')}:</span>
                                {trade.entryPrice}
                            </div>
                            <div>
                                <span className="text-gray-500 mr-1">{t('tradeList.columns.quantity')}:</span>
                                {trade.quantity}
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500 mr-1">{t('tradeList.columns.reason')}:</span>
                                {trade.reason}
                            </div>
                            {/* 태그 미리보기 */}
                            {trade.tags && trade.tags.length > 0 && (
                                <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                                    {trade.tags.map((tag, idx) => (
                                        <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => setDetailModalTrade(trade)}
                                className="flex-1 py-2 border-2 border-gray-400 text-gray-600 text-sm rounded font-medium hover:bg-gray-400 hover:text-white transition-all"
                            >
                                {t('common.view')}
                            </button>
                            {!trade.exitPrice && (
                                <button
                                    onClick={() => setCloseModalTrade(trade)}
                                    className="flex-1 py-2 border-2 border-emerald-600 text-emerald-600 text-sm rounded font-medium hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    {t('tradeList.actions.close')}
                                </button>
                            )}
                            <button
                                onClick={() => setEditModalTrade(trade)}
                                className="flex-1 py-2 border-2 border-slate-600 text-slate-600 text-sm rounded font-medium hover:bg-slate-600 hover:text-white transition-all"
                            >
                                {t('tradeList.actions.edit')}
                            </button>
                            <button
                                onClick={() => handleDelete(trade.id!)}
                                className="flex-1 py-2 border-2 border-rose-600 text-rose-600 text-sm rounded font-medium hover:bg-rose-600 hover:text-white transition-all"
                            >
                                {t('tradeList.actions.delete')}
                            </button>
                        </div>
                    </div>
                ))}
                {processedTrades.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        {t('tradeList.noTrades')}
                    </div>
                )}
            </div>

            {/* 데스크톱 테이블 뷰 (lg 이상에서 표시) */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th
                                className="p-2 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('symbol')}
                            >
                                {t('tradeList.columns.symbol')} {getSortIcon('symbol')}
                            </th>
                            <th
                                className="p-2 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('entryDate')}
                            >
                                {t('tradeList.columns.entryDate')} {getSortIcon('entryDate')}
                            </th>
                            <th className="p-2">{t('tradeList.columns.exitDate')}</th>
                            <th className="p-2">{t('tradeList.columns.entryPrice')}</th>
                            <th className="p-2">{t('tradeList.columns.quantity')}</th>
                            <th className="p-2">{t('tradeList.columns.reason')}</th>
                            <th
                                className="p-2 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('pnl')}
                            >
                                {t('tradeList.columns.pnl')} {getSortIcon('pnl')}
                            </th>
                            <th className="p-2">{t('tradeList.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedTrades.map(trade => (
                            <tr key={trade.id} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-medium cursor-pointer hover:text-blue-600" onClick={() => setDetailModalTrade(trade)}>
                                    {trade.symbol}
                                    {trade.tags && trade.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {trade.tags.slice(0, 2).map((tag, idx) => (
                                                <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                            {trade.tags.length > 2 && <span className="text-xs text-gray-400">+{trade.tags.length - 2}</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="p-2">
                                    {trade.entryDate ? (
                                        <div className="text-sm">
                                            <div className="font-medium">{formatRelativeTime(trade.entryDate, t)}</div>
                                            <div className="text-xs text-gray-500">({formatDateTime(trade.entryDate)})</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="p-2">
                                    {trade.exitDate ? (
                                        <div className="text-sm">
                                            <div className="font-medium">{formatRelativeTime(trade.exitDate, t)}</div>
                                            <div className="text-xs text-gray-500">({formatDateTime(trade.exitDate)})</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="p-2">{trade.entryPrice}</td>
                                <td className="p-2">{trade.quantity}</td>
                                <td className="p-2 max-w-xs truncate">{trade.reason}</td>
                                <td className={`p-2 font-bold ${trade.realizedPnl && trade.realizedPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {trade.realizedPnl?.toFixed(2) || '-'}
                                </td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setDetailModalTrade(trade)}
                                            className="px-3 py-1 border-2 border-gray-400 text-gray-600 text-sm rounded hover:bg-gray-400 hover:text-white transition-all"
                                        >
                                            {t('common.view')}
                                        </button>
                                        {!trade.exitPrice && (
                                            <button
                                                onClick={() => setCloseModalTrade(trade)}
                                                className="px-3 py-1 border-2 border-emerald-600 text-emerald-600 text-sm rounded hover:bg-emerald-600 hover:text-white transition-all"
                                            >
                                                {t('tradeList.actions.close')}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setEditModalTrade(trade)}
                                            className="px-3 py-1 border-2 border-slate-600 text-slate-600 text-sm rounded hover:bg-slate-600 hover:text-white transition-all"
                                        >
                                            {t('tradeList.actions.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trade.id!)}
                                            className="px-3 py-1 border-2 border-rose-600 text-rose-600 text-sm rounded hover:bg-rose-600 hover:text-white transition-all"
                                        >
                                            {t('tradeList.actions.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {processedTrades.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    {t('tradeList.noTrades')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 모달 컴포넌트들 */}
            {closeModalTrade && (
                <CloseTradeModal
                    trade={closeModalTrade}
                    onClose={() => setCloseModalTrade(null)}
                    onSuccess={() => {
                        setCloseModalTrade(null);
                        onRefresh();
                    }}
                />
            )}

            {editModalTrade && (
                <EditTradeModal
                    trade={editModalTrade}
                    onClose={() => setEditModalTrade(null)}
                    onSuccess={() => {
                        setEditModalTrade(null);
                        onRefresh();
                    }}
                />
            )}

            {detailModalTrade && (
                <TradeDetailModal
                    trade={detailModalTrade}
                    onClose={() => setDetailModalTrade(null)}
                />
            )}
        </div>
    );
};
