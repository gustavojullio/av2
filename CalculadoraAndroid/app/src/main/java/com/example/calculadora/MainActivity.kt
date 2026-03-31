package com.example.calculadora

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class MainActivity : AppCompatActivity() {

    private lateinit var tvExpression: TextView
    private lateinit var tvResult: TextView
    private val evaluator = ExpressionEvaluator()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvExpression = findViewById(R.id.tvExpression)
        tvResult = findViewById(R.id.tvResult)

        setupNumberButtons()
        setupActionButtons()
    }

    private fun setupNumberButtons() {
        val numbers = listOf(
            R.id.btn0 to "0",
            R.id.btn1 to "1",
            R.id.btn2 to "2",
            R.id.btn3 to "3",
            R.id.btn4 to "4",
            R.id.btn5 to "5",
            R.id.btn6 to "6",
            R.id.btn7 to "7",
            R.id.btn8 to "8",
            R.id.btn9 to "9",
            R.id.btnDot to "."
        )

        numbers.forEach { (id, symbol) ->
            findViewById<MaterialButton>(id).setOnClickListener { appendSymbol(symbol) }
        }
    }

    private fun setupActionButtons() {
        val operators = listOf(
            R.id.btnPlus to "+",
            R.id.btnMinus to "-",
            R.id.btnMultiply to "×",
            R.id.btnDivide to "÷",
            R.id.btnOpenParen to "(",
            R.id.btnCloseParen to ")"
        )

        operators.forEach { (id, symbol) ->
            findViewById<MaterialButton>(id).setOnClickListener { appendSymbol(symbol) }
        }

        findViewById<MaterialButton>(R.id.btnClear).setOnClickListener {
            tvExpression.text = ""
            tvResult.text = "0"
        }

        findViewById<MaterialButton>(R.id.btnDelete).setOnClickListener {
            val current = tvExpression.text.toString()
            if (current.isNotEmpty()) {
                tvExpression.text = current.dropLast(1)
            }
        }

        findViewById<MaterialButton>(R.id.btnEquals).setOnClickListener {
            calculateExpression()
        }
    }

    private fun appendSymbol(symbol: String) {
        tvExpression.append(symbol)
    }

    private fun calculateExpression() {
        val expression = tvExpression.text.toString()
        if (expression.isBlank()) {
            tvResult.text = "0"
            return
        }

        try {
            val result = evaluator.evaluate(expression)
            tvResult.text = formatResult(result)
        } catch (_: IllegalArgumentException) {
            tvResult.text = getString(R.string.invalid_expression)
        }
    }

    private fun formatResult(value: Double): String {
        return if (value % 1.0 == 0.0) value.toLong().toString() else value.toString()
    }
}
