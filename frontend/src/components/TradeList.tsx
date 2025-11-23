import React from 'react';
import type { Trade } from '../types/Trade';

interface Props {
    trades: Trade[];
}

export const TradeList: React.FC<Props> = ({ trades }) => {
    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-bold mb-4">Trade List</h2>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Symbol</th>
                        <th className="p-2">Entry Price</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Reason</th>
                        <th className="p-2">P&L</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(trade => (
                        <tr key={trade.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{trade.symbol}</td>
                            <td className="p-2">{trade.entryPrice}</td>
                            <td className="p-2">{trade.quantity}</td>
                            <td className="p-2">{trade.reason}</td>
                            <td className={`p-2 font-bold ${trade.realizedPnl && trade.realizedPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trade.realizedPnl?.toFixed(2) || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
