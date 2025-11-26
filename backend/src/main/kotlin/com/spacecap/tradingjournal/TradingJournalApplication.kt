package com.spacecap.tradingjournal

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@SpringBootApplication
@EnableJpaAuditing
class TradingJournalApplication

fun main(args: Array<String>) {
    runApplication<TradingJournalApplication>(*args)
}
