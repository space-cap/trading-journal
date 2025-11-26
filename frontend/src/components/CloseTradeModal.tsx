import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';

interface Props {
    trade: Trade;
    onClose: () => void;
    onSuccess: () => void;
}

export const CloseTradeModal: React.FC<Props> = ({ trade, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [exitPrice, setExitPrice] = useState('');
    const [exitDate, setExitDate] = useState(new Date().toISOString().slice(0, 16));
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/trades/${trade.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...trade,
                    exitPrice: parseFloat(exitPrice),
                    exitDate: exitDate
                })
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                alert(t('common.error'));
            }
        } catch (error) {
            console.error('Error closing trade:', error);
            alert(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{t('closeModal.title')}</h2>

                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">{t('tradeList.columns.symbol')}: <span className="font-bold">{trade.symbol}</span></p>
                    <p className="text-sm text-gray-600">{t('tradeList.columns.entryPrice')}: <span className="font-bold">{trade.entryPrice}</span></p>
                    <p className="text-sm text-gray-600">{t('tradeList.columns.quantity')}: <span className="font-bold">{trade.quantity}</span></p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('closeModal.exitPrice')}</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border p-2 rounded"
                            value={exitPrice}
                            onChange={(e) => setExitPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">{t('closeModal.exitDate')}</label>
                        <input
                            type="datetime-local"
                            className="w-full border p-2 rounded"
                            value={exitDate}
                            onChange={(e) => setExitDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={loading}
                        >
                            {t('closeModal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? t('common.loading') : t('closeModal.submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
