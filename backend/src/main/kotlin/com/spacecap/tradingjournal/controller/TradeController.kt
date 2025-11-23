package com.spacecap.tradingjournal.controller

import com.spacecap.tradingjournal.domain.Trade
import com.spacecap.tradingjournal.service.TradeService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/trades")
class TradeController(
    private val tradeService: TradeService
) {
    @GetMapping
    fun getAllTrades(): List<Trade> = tradeService.getAllTrades()

    @GetMapping("/{id}")
    fun getTradeById(@PathVariable id: Long): Trade = tradeService.getTradeById(id)

    @PostMapping
    fun createTrade(@RequestBody trade: Trade): Trade = tradeService.createTrade(trade)

    @PutMapping("/{id}")
    fun updateTrade(@PathVariable id: Long, @RequestBody trade: Trade): Trade =
        tradeService.updateTrade(id, trade)

    @DeleteMapping("/{id}")
    fun deleteTrade(@PathVariable id: Long) {
        tradeService.deleteTrade(id)
    }
}
