import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Trade } from '../types/Trade';

interface Props {
    trades: Trade[];
}

export const DashboardChart: React.FC<Props> = ({ trades }) => {
    const data = trades.map((t, index) => ({
        name: `Trade ${index + 1}`,
        pnl: t.realizedPnl || 0,
        cumulativePnl: 0
    }));

    let cumulative = 0;
    data.forEach(d => {
        cumulative += d.pnl;
        d.cumulativePnl = cumulative;
    });

    return (
        <div className="bg-white shadow rounded p-4 mb-4 h-96">
            <h2 className="text-xl font-bold mb-4">Performance Chart</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cumulativePnl" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
