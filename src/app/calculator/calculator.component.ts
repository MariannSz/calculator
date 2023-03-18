import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  operators: string[] = ['+', '-', '*', '/'];
  display: string = '0';
  isPositive: boolean = true;
  currentValue: string = '';
  calculationInInputOrder: string[] = [];

  inputOperator(operator: string) {
    if (this.currentValue !== '') {
      this.calculationInInputOrder.push(this.currentValue);
    }
    this.calculationInInputOrder.push(operator);
    const lastInputValue =
      this.calculationInInputOrder[this.calculationInInputOrder.length - 1];
    const previousLastInputValue =
      this.calculationInInputOrder[this.calculationInInputOrder.length - 2];
    if (
      this.operators.includes(lastInputValue) &&
      operator === '-' &&
      this.operators.includes(previousLastInputValue)
    ) {
      this.currentValue = '-';
      this.calculationInInputOrder = this.calculationInInputOrder.slice(0, -1);
    } else {
      this.currentValue = '';
    }
  }
  inputDecimal() {
    if (!this.currentValue.includes('.')) {
      this.currentValue = this.currentValue + '.';
      this.display = this.currentValue;
      this.isPositive = parseFloat(this.display) >= 0;
    }
  }
  equals() {
    if (this.currentValue !== '') {
      this.calculationInInputOrder.push(this.currentValue);
    }
    const lastInputValue =
      this.calculationInInputOrder[this.calculationInInputOrder.length - 1];
    if (this.operators.includes(lastInputValue)) {
      this.calculationInInputOrder = this.calculationInInputOrder.slice(
        0,
        this.calculationInInputOrder.length - 1
      );
    }
    this.currentValue = '';
    this.display = this.calculate(this.calculationInInputOrder).toString();
    this.isPositive = parseFloat(this.display) >= 0;
    this.calculationInInputOrder = [];
  }

  calculate(arr: string[]): number {
    const numbers: number[] = [];
    const operators: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      const token = arr[i];
      if (this.isNumber(token)) {
        numbers.push(parseFloat(token));
      } else if (this.isOperator(token)) {
        while (
          operators.length > 0 &&
          this.hasHigherPrecedence(operators[operators.length - 1], token)
        ) {
          const b = numbers.pop()!;
          const a = numbers.pop()!;
          const operator = operators.pop()!;
          const result = this.performOperation(a, b, operator);
          numbers.push(result);
        }
        operators.push(token);
      }
    }

    while (operators.length > 0) {
      const b = numbers.pop()!;
      const a = numbers.pop()!;
      const operator = operators.pop()!;
      const result = this.performOperation(a, b, operator);
      numbers.push(result);
    }

    return numbers.pop()!;
  }

  isNumber(token: string): boolean {
    return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
  }

  isOperator(token: string): boolean {
    return token === '+' || token === '-' || token === '*' || token === '/';
  }

  hasHigherPrecedence(operator1: string, operator2: string): boolean {
    const precedence: { [key: string]: number } = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };
    return precedence[operator1] >= precedence[operator2];
  }

  performOperation(a: number, b: number, operator: string): number {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }

  inputDigit(digit: string) {
    if (this.currentValue === '0') {
      this.currentValue = digit;
    } else {
      this.currentValue = this.currentValue + digit;
    }
    this.display = this.currentValue;
    this.isPositive = parseFloat(this.display) >= 0;
  }

  clear() {
    this.display = '0';
    this.isPositive = parseFloat(this.display) >= 0;
  }
}
