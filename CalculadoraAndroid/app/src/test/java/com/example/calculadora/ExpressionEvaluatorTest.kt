package com.example.calculadora

import org.junit.Assert.assertEquals
import org.junit.Test

class ExpressionEvaluatorTest {

    private val evaluator = ExpressionEvaluator()

    @Test
    fun `resolve precedencia de operadores`() {
        assertEquals(14.0, evaluator.evaluate("2+3*4"), 0.0001)
    }

    @Test
    fun `resolve parenteses`() {
        assertEquals(36.0, evaluator.evaluate("(10+2)*3"), 0.0001)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `falha em divisao por zero`() {
        evaluator.evaluate("7/0")
    }
}
