package com.spacecap.tradingjournal.service

import com.spacecap.tradingjournal.domain.Trade
import com.spacecap.tradingjournal.repository.TradeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.time.LocalDateTime

@Service
@Transactional
class TradeService(
    private val tradeRepository: TradeRepository
) {
    @Transactional(readOnly = true)
    fun getAllTrades(): List<Trade> = tradeRepository.findByDeletedAtIsNull()

    @Transactional(readOnly = true)
    fun getTradeById(id: Long): Trade {
        return tradeRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Trade not found with id: $id") }
    }

    fun createTrade(trade: Trade): Trade = tradeRepository.save(trade)

    fun updateTrade(id: Long, updatedTrade: Trade): Trade {
        if (!tradeRepository.existsById(id)) {
            throw IllegalArgumentException("Trade not found")
        }
        return tradeRepository.save(updatedTrade.copy(id = id))
    }

    fun deleteTrade(id: Long) {
        val trade = tradeRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Trade not found with id: $id") }
        trade.deletedAt = LocalDateTime.now()
        tradeRepository.save(trade)
    }
}
