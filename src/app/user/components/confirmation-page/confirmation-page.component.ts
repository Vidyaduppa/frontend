import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-page',
  imports: [],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss'
})
export class ConfirmationPageComponent {
  @Input() lastOrderId = '';
  @Output() viewOrders = new EventEmitter<void>();
}
