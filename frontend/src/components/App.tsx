import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Trade } from './types/Trade';
import { TradeForm } from './components/TradeForm';
import { TradeList } from './components/TradeList';
import { DashboardChart } from './components/DashboardChart';
import { LanguageToggle } from './components/LanguageToggle';

function App() {
    const { t } = useTranslation();
    const [trades, setTrades] = useState<Trade[]>([]);

    const fetchTrades = () => {
        fetch('/api/trades')
            .then(res => res.json())
            .then(data => setTrades(data))
            .catch(err => console.error('Error fetching trades:', err));
    };

    useEffect(() => {
        fetchTrades();
    }, []);

    const handleTradeCreated = (newTrade: Trade) => {
        setTrades([...trades, newTrade]);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('app.title')}</h1>
                    <LanguageToggle />
                </div>
                <DashboardChart trades={trades} />
                <TradeForm onTradeCreated={handleTradeCreated} />
                <TradeList trades={trades} onRefresh={fetchTrades} />
            </div>
        </div>
    );
}

export default App;
