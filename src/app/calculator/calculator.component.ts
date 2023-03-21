import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  specialKeys = [
    '*',
    '/',
    '+',
    '-',
    'Backspace',
    'c',
    'C',
    '=',
    'Enter',
    '.',
    ',',
  ];
  display: string = '0';
  currentValue: string = '';
  calculationSegmentsInInputOrder: string[] = [];
  result: string = '';

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key)) {
      switch (event.key) {
        case '*':
          this.inputOperator('*');
          break;
        case '/':
          this.inputOperator('/');
          break;
        case '+':
          this.inputOperator('+');
          break;
        case '-':
          this.inputOperator('-');
          break;
        case 'Backspace':
          this.removeDigit();
          break;
        case 'c':
          this.clear();
          break;
        case 'C':
          this.clear();
          break;
        case '=':
          this.equals();
          break;
        case 'Enter':
          this.equals();
          break;
        case '.':
          this.inputDecimal();
          break;
        case ',':
          this.inputDecimal();
          break;

        default:
          break;
      }
    } else if (this.isNumber(event.key)) {
      this.inputDigit(event.key);
    }
  }

  getColor(value: string) {
    const intValue = parseInt(value);
    if (intValue < 0) {
      return '#bc1322';
    } else if (intValue > 0) {
      return '#5dbc6b';
    } else {
      return '#6d6d6d';
    }
  }

  inputOperator(operator: string) {
    if (this.currentValue !== '') {
      this.calculationSegmentsInInputOrder.push(this.currentValue);
      if (operator === '*' || operator === '/') {
        // if the operator clicked was a higher order one
        const previousLastOperator =
          this.calculationSegmentsInInputOrder[
            this.calculationSegmentsInInputOrder.length - 2
          ];
        if (previousLastOperator === '*' || previousLastOperator === '/') {
          // calculate result so far and display it
          this.display = this.calculate(
            this.calculationSegmentsInInputOrder
          ).toString();
          this.result = this.display;
        } else {
          this.display = this.currentValue; // keep the display on current value
        }
      } else {
        // if the operator clicked was a lower order one
        this.display = this.calculate(
          this.calculationSegmentsInInputOrder
        ).toString(); // calculate and display the result so far
        this.result = this.calculationSegmentsInInputOrder.some(
          (calculationSegment) => this.isOperator(calculationSegment)
        )
          ? this.display // if there was at least one operation completed, set result to display value for the coloring to work
          : '';
      }
    }
    const lastCalculationSegment =
      this.calculationSegmentsInInputOrder[
        this.calculationSegmentsInInputOrder.length - 1
      ];

    if (
      operator === '-' &&
      (this.currentValue === '' || this.isOperator(lastCalculationSegment))
    ) {
      this.currentValue = operator;
    } else if (this.calculationSegmentsInInputOrder.length > 0) {
      if (this.isOperator(lastCalculationSegment)) {
        this.calculationSegmentsInInputOrder.pop();
      }
      this.calculationSegmentsInInputOrder.push(operator);
      this.currentValue = '';
    }
  }
  inputDecimal() {
    if (!this.currentValue.includes('.') && this.result === '') {
      this.currentValue = this.currentValue + '.';
      this.display = this.currentValue;
    } else if (this.result !== '') {
      this.currentValue = '.';
      this.display = this.currentValue;
      this.result = '';
    }
  }
  equals() {
    if (this.currentValue !== '') {
      this.calculationSegmentsInInputOrder.push(this.currentValue);
      this.display = this.calculate(
        this.calculationSegmentsInInputOrder
      ).toString();
      this.result = this.display;

      this.calculationSegmentsInInputOrder = [this.currentValue];
      this.currentValue = this.result;
    }
  }

  calculate(calculationSegmentsInInputOrder: string[]): number {
    const numbers: number[] = [];
    const operators: string[] = [];

    calculationSegmentsInInputOrder.forEach((calculationSegment) => {
      if (this.isNumber(calculationSegment)) {
        numbers.push(parseFloat(calculationSegment));
      } else {
        while (
          operators.length > 0 &&
          this.hasHigherPrecedence(
            operators[operators.length - 1],
            calculationSegment
          )
        ) {
          const number2 = numbers.pop()!;
          const number1 = numbers.pop()!;
          const operator = operators.pop()!;
          const result = this.performOperation(number1, number2, operator);
          numbers.push(result);
        }
        operators.push(calculationSegment);
      }
    });

    while (operators.length > 0) {
      const number2 = numbers.pop()!;
      const number1 = numbers.pop()!;
      const operator = operators.pop()!;
      const result = this.performOperation(number1, number2, operator);
      numbers.push(result);
    }

    return numbers.pop()!;
  }

  isNumber(calculationSegment: string): boolean {
    return (
      !isNaN(parseFloat(calculationSegment)) &&
      isFinite(parseFloat(calculationSegment))
    );
  }

  isOperator(calculationSegment: string): boolean {
    return (
      calculationSegment === '+' ||
      calculationSegment === '-' ||
      calculationSegment === '*' ||
      calculationSegment === '/'
    );
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

  performOperation(number1: number, number2: number, operator: string): number {
    switch (operator) {
      case '+':
        return number1 + number2;
      case '-':
        return number1 - number2;
      case '*':
        return number1 * number2;
      case '/':
        return number1 / number2;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }

  inputDigit(digit: string) {
    if (
      this.currentValue === '0' ||
      (this.result !== '' && !this.isOperator(this.currentValue))
    ) {
      this.currentValue = digit;
    } else {
      this.currentValue = this.currentValue + digit;
    }
    this.result = '';
    this.display = this.currentValue;
  }

  removeDigit() {
    if (this.result === '') {
      this.display =
        this.display.slice(0, -1) === '' ? '0' : this.display.slice(0, -1);
      this.currentValue = this.display;
    }
  }

  clear() {
    this.display = '0';
    this.currentValue = '';
    this.result = '';
    this.calculationSegmentsInInputOrder = [];
  }
}
