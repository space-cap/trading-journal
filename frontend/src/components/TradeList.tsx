import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';
import { CloseTradeModal } from './CloseTradeModal';
import { EditTradeModal } from './EditTradeModal';

interface Props {
    trades: Trade[];
    onRefresh: () => void;
}

export const TradeList: React.FC<Props> = ({ trades, onRefresh }) => {
    const { t } = useTranslation();
    const [closeModalTrade, setCloseModalTrade] = useState<Trade | null>(null);
    const [editModalTrade, setEditModalTrade] = useState<Trade | null>(null);

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

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-bold mb-4">{t('tradeList.title')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">{t('tradeList.columns.symbol')}</th>
                            <th className="p-2">{t('tradeList.columns.entryPrice')}</th>
                            <th className="p-2">{t('tradeList.columns.quantity')}</th>
                            <th className="p-2">{t('tradeList.columns.reason')}</th>
                            <th className="p-2">{t('tradeList.columns.pnl')}</th>
                            <th className="p-2">{t('tradeList.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map(trade => (
                            <tr key={trade.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{trade.symbol}</td>
                                <td className="p-2">{trade.entryPrice}</td>
                                <td className="p-2">{trade.quantity}</td>
                                <td className="p-2 max-w-xs truncate">{trade.reason}</td>
                                <td className={`p-2 font-bold ${trade.realizedPnl && trade.realizedPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {trade.realizedPnl?.toFixed(2) || '-'}
                                </td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        {!trade.exitPrice && (
                                            <button
                                                onClick={() => setCloseModalTrade(trade)}
                                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                            >
                                                {t('tradeList.actions.close')}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setEditModalTrade(trade)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            {t('tradeList.actions.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trade.id!)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            {t('tradeList.actions.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {closeModalTrade && (
                <CloseTradeModal
                    trade={closeModalTrade}
                    onClose={() => setCloseModalTrade(null)}
                    onSuccess={onRefresh}
                />
            )}

            {editModalTrade && (
                <EditTradeModal
                    trade={editModalTrade}
                    onClose={() => setEditModalTrade(null)}
                    onSuccess={onRefresh}
                />
            )}
        </div>
    );
};
