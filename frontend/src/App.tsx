import { useEffect, useState } from 'react';
import type { Trade } from './types/Trade';
import { TradeForm } from './components/TradeForm';
import { TradeList } from './components/TradeList';
import { DashboardChart } from './components/DashboardChart';

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    fetch('/api/trades')
      .then(res => res.json())
      .then(data => setTrades(data))
      .catch(err => console.error('Error fetching trades:', err));
  }, []);

  const handleTradeCreated = (newTrade: Trade) => {
    setTrades([...trades, newTrade]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Trading Journal</h1>
        <DashboardChart trades={trades} />
        <TradeForm onTradeCreated={handleTradeCreated} />
        <TradeList trades={trades} />
      </div>
    </div>
  );
}

export default App;
