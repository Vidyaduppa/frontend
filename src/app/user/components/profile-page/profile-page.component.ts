import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ProfileValue {
  name: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-profile-page',
  imports: [FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnChanges {
  @Input() profile: ProfileValue = { name: '', email: '', address: '' };
  @Output() saveProfile = new EventEmitter<ProfileValue>();

  form: ProfileValue = { name: '', email: '', address: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile']) {
      this.form = { ...this.profile };
    }
  }
}
