import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';

interface Props {
    onTradeCreated: (trade: Trade) => void;
}

export const TradeForm: React.FC<Props> = ({ onTradeCreated }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        symbol: '',
        entryPrice: '',
        quantity: '',
        fee: '0',
        reason: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trade: Trade = {
            symbol: formData.symbol,
            entryPrice: parseFloat(formData.entryPrice),
            quantity: parseInt(formData.quantity),
            fee: parseFloat(formData.fee),
            reason: formData.reason
        };

        try {
            const response = await fetch('/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trade)
            });
            if (response.ok) {
                const newTrade = await response.json();
                onTradeCreated(newTrade);
                setFormData({ symbol: '', entryPrice: '', quantity: '', fee: '0', reason: '' });
            }
        } catch (error) {
            console.error('Error creating trade:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-xl font-bold mb-4">{t('tradeForm.title')}</h2>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder={t('tradeForm.symbolPlaceholder')}
                    className="border p-2 rounded"
                    value={formData.symbol}
                    onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder={t('tradeForm.entryPricePlaceholder')}
                    className="border p-2 rounded"
                    value={formData.entryPrice}
                    onChange={e => setFormData({ ...formData, entryPrice: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder={t('tradeForm.quantityPlaceholder')}
                    className="border p-2 rounded"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder={t('tradeForm.feePlaceholder')}
                    className="border p-2 rounded"
                    value={formData.fee}
                    onChange={e => setFormData({ ...formData, fee: e.target.value })}
                />
                <input
                    type="text"
                    placeholder={t('tradeForm.reasonPlaceholder')}
                    className="border p-2 rounded col-span-2"
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    required
                />
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {t('tradeForm.submitButton')}
            </button>
        </form>
    );
};
