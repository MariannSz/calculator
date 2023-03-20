import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate mixed precedent operations correctly', () => {
    const calculationsInInputOrder = ['7', '+', '3', '*', '10', '/', '2'];
    component.inputDigit('7');
    component.inputOperator('+');
    component.inputDigit('3');
    component.inputOperator('*');
    component.inputDigit('1');
    component.inputDigit('0');
    component.inputOperator('/');
    component.inputDigit('2');
    component.equals();
    const result = component.calculate(calculationsInInputOrder);

    expect(component.calculationSegmentsInInputOrder).toEqual([
      calculationsInInputOrder[calculationsInInputOrder.length - 1],
    ]);
    expect(component.display).toBe('22');
    expect(result).toEqual(22);
  });

  it('should handle negative input', () => {
    component.inputOperator('-');
    component.inputDigit('8');

    expect(component.currentValue).toBe('-8');
  });

  it('should handle decimal input correctly', () => {
    component.inputDigit('6');
    component.inputDecimal();
    component.inputDecimal();
    component.inputDigit('4');

    expect(component.display).toBe('6.4');
  });

  it('should calculate correctly with negative numbers', () => {
    const calculationsInInputOrder = ['-7', '+', '3', '*', '-10', '/', '2'];
    component.inputOperator('-');
    component.inputDigit('7');
    component.inputOperator('+');
    component.inputDigit('3');
    component.inputOperator('*');
    component.inputOperator('-');
    component.inputDigit('1');
    component.inputDigit('0');
    component.inputOperator('/');
    component.inputDigit('2');
    component.equals();
    const result = component.calculate(calculationsInInputOrder);

    expect(component.calculationSegmentsInInputOrder).toEqual([
      calculationsInInputOrder[calculationsInInputOrder.length - 1],
    ]);
    expect(component.display).toBe('-22');
    expect(result).toEqual(-22);
  });

  it('should calculate correctly with negative numbers (version 2)', () => {
    const calculationsInInputOrder = ['5', '+', '5', '*', '2', '-', '-8'];
    component.inputDigit('5');
    component.inputOperator('+');
    component.inputDigit('5');
    component.inputOperator('*');
    component.inputDigit('2');
    component.inputOperator('-');
    component.inputOperator('-');
    component.inputDigit('8');
    component.equals();
    const result = component.calculate(calculationsInInputOrder);

    expect(component.calculationSegmentsInInputOrder).toEqual([
      calculationsInInputOrder[calculationsInInputOrder.length - 1],
    ]);
    expect(component.display).toBe('23');
    expect(result).toEqual(23);
  });

  it('should calculate correctly with negative numbers (version 3)', () => {
    const calculationsInInputOrder = ['5', '+', '5', '*', '2', '-', '8'];
    component.inputDigit('5');
    component.inputOperator('+');
    component.inputDigit('5');
    component.inputOperator('*');
    component.inputDigit('2');
    component.inputOperator('-');
    component.inputDigit('8');
    component.equals();
    const result = component.calculate(calculationsInInputOrder);

    expect(component.calculationSegmentsInInputOrder).toEqual([
      calculationsInInputOrder[calculationsInInputOrder.length - 1],
    ]);
    expect(component.display).toBe('7');
    expect(result).toEqual(7);
  });

  it('should continue calculation with result from previous', () => {
    component.inputDigit('2');
    component.inputDigit('9');
    component.inputOperator('-');
    component.inputDigit('5');
    component.equals();

    component.inputOperator('/');
    component.inputDigit('6');
    component.equals();

    expect(component.display).toBe('4');
  });

  it('should reset when new value is input after a calculation finished', () => {
    component.inputDigit('2');
    component.inputOperator('*');
    component.inputDigit('1');
    component.inputDigit('3');
    component.equals();
    component.inputDigit('8');
    component.inputDigit('5');

    expect(component.result).toEqual('');
    expect(component.display).toBe('85');
  });

  it('should show negative result in red', () => {
    const color = component.getColor('-10');

    expect(color).toBe('#bc1322');
  });

  it('should show positive result in green', () => {
    const color = component.getColor('10');

    expect(color).toBe('#5dbc6b');
  });

  it('should show 0 result in dark grey', () => {
    const color = component.getColor('0');

    expect(color).toBe('#6d6d6d');
  });

  it('should clear on `c`', () => {
    component.inputDigit('8');
    component.inputDigit('5');

    expect(component.display).toBe('85');
    expect(component.currentValue).toBe('85');
    expect(component.result).toBe('');
    expect(component.calculationSegmentsInInputOrder).toEqual([]);

    const event = new KeyboardEvent('keydown', {
      key: 'c',
    });
    window.dispatchEvent(event);

    expect(component.display).toBe('0');
    expect(component.currentValue).toBe('');
    expect(component.result).toBe('');
    expect(component.calculationSegmentsInInputOrder).toEqual([]);
  });

  it('should clear on `C`', () => {
    component.inputDigit('8');
    component.inputDigit('5');

    expect(component.display).toBe('85');
    expect(component.currentValue).toBe('85');
    expect(component.result).toBe('');
    expect(component.calculationSegmentsInInputOrder).toEqual([]);

    const event = new KeyboardEvent('keydown', {
      key: 'C',
    });
    window.dispatchEvent(event);

    expect(component.display).toBe('0');
    expect(component.currentValue).toBe('');
    expect(component.result).toBe('');
    expect(component.calculationSegmentsInInputOrder).toEqual([]);
  });

  it('should clear on `C` button click', () => {
    component.inputDigit('8');
    component.inputDigit('5');

    expect(component.display).toBe('85');
    expect(component.currentValue).toBe('85');
    expect(component.result).toBe('');
    expect(component.calculationSegmentsInInputOrder).toEqual([]);

    const button = fixture.nativeElement.querySelector('#clear');
    button.click();

    expect(component.display).toBe('0');
    expect(component.currentValue).toBe('');
    expect(component.result).toBe('');
    expect(component.calculationSegmentsInInputOrder).toEqual([]);
  });

  it('should update display when higher order operations are chained', () => {
    component.inputDigit('2');
    component.inputOperator('*');

    expect(component.display).toBe('2');

    component.inputDigit('1');
    component.inputDigit('0');

    expect(component.display).toBe('10');

    component.inputOperator('*');

    expect(component.display).toBe('20');

    component.inputDigit('3');
    component.inputOperator('*');

    expect(component.display).toBe('60');
  });

  it('should work with keyboard inputs', () => {
    // 5+5.5*2+-8
    const event1 = new KeyboardEvent('keydown', {
      key: '5',
    });
    window.dispatchEvent(event1);
    const event2 = new KeyboardEvent('keydown', {
      key: '+',
    });
    window.dispatchEvent(event2);
    const event3 = new KeyboardEvent('keydown', {
      key: '5',
    });
    window.dispatchEvent(event3);
    const event4 = new KeyboardEvent('keydown', {
      key: ',',
    });
    window.dispatchEvent(event4);
    const event5 = new KeyboardEvent('keydown', {
      key: '5',
    });
    window.dispatchEvent(event5);
    const event6 = new KeyboardEvent('keydown', {
      key: '*',
    });
    window.dispatchEvent(event6);
    const event7 = new KeyboardEvent('keydown', {
      key: '2',
    });
    window.dispatchEvent(event7);
    const event8 = new KeyboardEvent('keydown', {
      key: '+',
    });
    window.dispatchEvent(event8);
    const event9 = new KeyboardEvent('keydown', {
      key: '-',
    });
    window.dispatchEvent(event9);
    const event10 = new KeyboardEvent('keydown', {
      key: '8',
    });
    window.dispatchEvent(event10);
    const event11 = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    window.dispatchEvent(event11);

    expect(component.display).toBe('8');
    expect(component.result).toBe('8');
  });

  it('should allow digit by digit deletion using `Backspace`', () => {
    component.inputDigit('2');
    component.inputDigit('1');
    component.inputDigit('0');
    component.inputDigit('0');
    component.inputDigit('8');

    expect(component.display).toBe('21008');

    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
    });
    window.dispatchEvent(event);

    expect(component.display).toBe('2100');

    window.dispatchEvent(event);

    expect(component.display).toBe('210');

    window.dispatchEvent(event);

    expect(component.display).toBe('21');

    window.dispatchEvent(event);

    expect(component.display).toBe('2');

    window.dispatchEvent(event);

    expect(component.display).toBe('0');
  });
  it('should allow digit by digit deletion when last input was an operator', () => {
    component.inputDigit('2');
    component.inputDigit('1');
    component.inputDigit('0');
    component.inputDigit('0');
    component.inputDigit('8');
    component.inputOperator('+');
    component.inputOperator('*');

    expect(component.display).toBe('21008');

    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
    });
    window.dispatchEvent(event);

    expect(component.display).toBe('2100');

    window.dispatchEvent(event);

    expect(component.display).toBe('210');

    window.dispatchEvent(event);

    expect(component.display).toBe('21');

    window.dispatchEvent(event);

    expect(component.display).toBe('2');

    window.dispatchEvent(event);

    expect(component.display).toBe('0');
  });
});
