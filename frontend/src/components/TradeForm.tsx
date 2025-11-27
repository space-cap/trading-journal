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
        reason: '',
        notes: '',
        tags: '',
        imageUrls: [] as string[]
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/images', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    imageUrls: [...prev.imageUrls, data.url]
                }));
            } else {
                alert('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trade: Trade = {
            symbol: formData.symbol,
            entryPrice: parseFloat(formData.entryPrice),
            quantity: parseInt(formData.quantity),
            fee: parseFloat(formData.fee),
            reason: formData.reason,
            notes: formData.notes,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
            imageUrls: formData.imageUrls
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
                setFormData({
                    symbol: '',
                    entryPrice: '',
                    quantity: '',
                    fee: '0',
                    reason: '',
                    notes: '',
                    tags: '',
                    imageUrls: []
                });
            }
        } catch (error) {
            console.error('Error creating trade:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-xl font-bold mb-4">{t('tradeForm.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder={t('tradeForm.symbolPlaceholder')}
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full"
                    value={formData.symbol}
                    onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder={t('tradeForm.entryPricePlaceholder')}
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full"
                    value={formData.entryPrice}
                    onChange={e => setFormData({ ...formData, entryPrice: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder={t('tradeForm.quantityPlaceholder')}
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder={t('tradeForm.feePlaceholder')}
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full"
                    value={formData.fee}
                    onChange={e => setFormData({ ...formData, fee: e.target.value })}
                />
                <input
                    type="text"
                    placeholder={t('tradeForm.reasonPlaceholder')}
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full md:col-span-2"
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    required
                />

                {/* 상세 노트 (마크다운) */}
                <textarea
                    placeholder="Notes (Markdown supported)"
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full md:col-span-2 h-24"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />

                {/* 태그 입력 */}
                <input
                    type="text"
                    placeholder="Tags (comma separated, e.g. #fomo, #trend)"
                    className="border p-3 md:p-2 rounded text-base md:text-sm w-full md:col-span-2"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />

                {/* 이미지 업로드 */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                    {isUploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}

                    {/* 업로드된 이미지 미리보기 */}
                    {formData.imageUrls.length > 0 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto">
                            {formData.imageUrls.map((url, index) => (
                                <div key={index} className="relative w-20 h-20 flex-shrink-0">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover rounded border" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                                        }))}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="mt-4 w-full md:w-auto bg-blue-500 text-white px-6 py-3 md:py-2 rounded hover:bg-blue-600 font-medium text-base md:text-sm transition-colors"
            >
                {t('tradeForm.submitButton')}
            </button>
        </form>
    );
};
