package com.example.calculadora

class ExpressionEvaluator {

    fun evaluate(expression: String): Double {
        val normalized = expression.replace('×', '*').replace('÷', '/').replace(" ", "")
        require(normalized.isNotBlank()) { "Expressão vazia" }
        val parser = Parser(normalized)
        val result = parser.parseExpression()
        require(parser.isAtEnd()) { "Expressão inválida" }
        return result
    }

    private class Parser(private val input: String) {
        private var pos = 0

        fun parseExpression(): Double {
            var value = parseTerm()
            while (!isAtEnd()) {
                when (peek()) {
                    '+' -> {
                        advance()
                        value += parseTerm()
                    }
                    '-' -> {
                        advance()
                        value -= parseTerm()
                    }
                    else -> return value
                }
            }
            return value
        }

        private fun parseTerm(): Double {
            var value = parseFactor()
            while (!isAtEnd()) {
                when (peek()) {
                    '*' -> {
                        advance()
                        value *= parseFactor()
                    }
                    '/' -> {
                        advance()
                        val divisor = parseFactor()
                        require(divisor != 0.0) { "Divisão por zero" }
                        value /= divisor
                    }
                    else -> return value
                }
            }
            return value
        }

        private fun parseFactor(): Double {
            if (!isAtEnd() && peek() == '+') {
                advance()
                return parseFactor()
            }
            if (!isAtEnd() && peek() == '-') {
                advance()
                return -parseFactor()
            }
            if (!isAtEnd() && peek() == '(') {
                advance()
                val value = parseExpression()
                require(!isAtEnd() && peek() == ')') { "Parênteses inválidos" }
                advance()
                return value
            }
            return parseNumber()
        }

        private fun parseNumber(): Double {
            val start = pos
            var hasDot = false
            while (!isAtEnd()) {
                val ch = peek()
                if (ch.isDigit()) {
                    advance()
                } else if (ch == '.' && !hasDot) {
                    hasDot = true
                    advance()
                } else {
                    break
                }
            }
            require(pos > start) { "Número esperado" }
            return input.substring(start, pos).toDouble()
        }

        fun isAtEnd(): Boolean = pos >= input.length

        private fun peek(): Char = input[pos]

        private fun advance() {
            pos++
        }
    }
}
