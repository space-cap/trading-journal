export interface Trade {
    id?: number;
    symbol: string;
    entryPrice: number;
    quantity: number;
    fee: number;
    reason: string;
    entryDate?: string;
    exitPrice?: number;
    exitDate?: string;
    realizedPnl?: number;
}
