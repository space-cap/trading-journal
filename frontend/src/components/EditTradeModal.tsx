import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';

interface Props {
    trade: Trade;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditTradeModal: React.FC<Props> = ({ trade, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        symbol: trade.symbol,
        entryPrice: trade.entryPrice.toString(),
        quantity: trade.quantity.toString(),
        fee: trade.fee?.toString() || '0',
        reason: trade.reason,
        exitPrice: trade.exitPrice?.toString() || '',
        exitDate: trade.exitDate || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/trades/${trade.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: formData.symbol,
                    entryPrice: parseFloat(formData.entryPrice),
                    quantity: parseInt(formData.quantity),
                    fee: parseFloat(formData.fee),
                    reason: formData.reason,
                    exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
                    exitDate: formData.exitDate || null
                })
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                alert(t('common.error'));
            }
        } catch (error) {
            console.error('Error updating trade:', error);
            alert(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{t('editModal.title')}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('tradeForm.symbol')}</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('tradeForm.entryPrice')}</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border p-2 rounded"
                            value={formData.entryPrice}
                            onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('tradeForm.quantity')}</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('tradeForm.fee')}</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border p-2 rounded"
                            value={formData.fee}
                            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('tradeForm.reason')}</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('closeModal.exitPrice')} ({t('tradeForm.exitPricePlaceholder')})</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border p-2 rounded"
                            value={formData.exitPrice}
                            onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('closeModal.exitDate')} ({t('tradeForm.exitPricePlaceholder')})</label>
                        <input
                            type="datetime-local"
                            className="w-full border p-2 rounded"
                            value={formData.exitDate}
                            onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={loading}
                        >
                            {t('editModal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? t('common.loading') : t('editModal.submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
