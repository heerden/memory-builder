import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true
        }
    ]
})
export class SliderComponent implements ControlValueAccessor {
    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() step: number = 1;
    @Input() style: any = {};
    @Output() onChange = new EventEmitter<any>();

    value: number = 0;
    isDisabled: boolean = false;

    onChangeCallback = (_: any) => { };
    onTouchedCallback = () => { };

    onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        this.value = Number(target.value);
        this.onChangeCallback(this.value);
        this.onChange.emit({ value: this.value });
    }

    writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.value = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
}
