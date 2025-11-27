import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../types/Trade';
import { formatDateTime } from '../utils/dateUtils';

interface Props {
    trade: Trade;
    onClose: () => void;
}

export const TradeDetailModal: React.FC<Props> = ({ trade, onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* 헤더 */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {trade.symbol}
                                <span className={`text-lg px-3 py-1 rounded-full ${trade.realizedPnl && trade.realizedPnl > 0
                                    ? 'bg-green-100 text-green-800'
                                    : trade.realizedPnl && trade.realizedPnl < 0
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {trade.realizedPnl ? trade.realizedPnl.toFixed(2) : 'Open'}
                                </span>
                            </h2>
                            <div className="text-gray-500 mt-1">
                                {formatDateTime(trade.entryDate || '')}
                                {trade.exitDate && ` - ${formatDateTime(trade.exitDate)}`}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                            &times;
                        </button>
                    </div>

                    {/* 기본 정보 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <span className="text-gray-500 text-sm block">{t('tradeList.columns.entryPrice')}</span>
                            <span className="font-medium">{trade.entryPrice}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm block">{t('tradeList.columns.quantity')}</span>
                            <span className="font-medium">{trade.quantity}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm block">{t('tradeList.columns.fee')}</span>
                            <span className="font-medium">{trade.fee}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm block">{t('tradeList.columns.reason')}</span>
                            <span className="font-medium">{trade.reason}</span>
                        </div>
                    </div>

                    {/* 태그 */}
                    {trade.tags && trade.tags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {trade.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 이미지 갤러리 */}
                    {trade.imageUrls && trade.imageUrls.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2">Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {trade.imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Trade chart ${index + 1}`}
                                        className="w-full h-auto rounded border hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => window.open(url, '_blank')}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 상세 노트 (마크다운) */}
                    <div className="mt-6">
                        <h3 className="text-lg font-bold mb-2">Notes</h3>
                        {trade.notes ? (
                            <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border">
                                <ReactMarkdown>{trade.notes}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                {t('tradeList.noNotes', 'No notes recorded.')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
