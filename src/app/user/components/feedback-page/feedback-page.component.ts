import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackItem } from '../../../services/store.models';

export interface FeedbackFormValue {
  rating: number;
  category: string;
  text: string;
  contact: boolean;
  email: string;
}

@Component({
  selector: 'app-feedback-page',
  imports: [DatePipe, FormsModule],
  templateUrl: './feedback-page.component.html',
  styleUrl: './feedback-page.component.scss'
})
export class FeedbackPageComponent {
  @Input() feedbackList: FeedbackItem[] = [];
  @Output() submitFeedback = new EventEmitter<FeedbackFormValue>();

  form: FeedbackFormValue = {
    rating: 0,
    category: '',
    text: '',
    contact: false,
    email: ''
  };

  stars = [1, 2, 3, 4, 5];

  setRating(rating: number): void {
    this.form.rating = rating;
  }

  onSubmit(): void {
    this.submitFeedback.emit(this.form);
    this.form = {
      rating: 0,
      category: '',
      text: '',
      contact: false,
      email: ''
    };
  }
}
