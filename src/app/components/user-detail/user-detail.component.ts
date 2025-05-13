// src/app/components/user-detail/user-detail.component.ts
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="user-card">
      <mat-card-header>
        <mat-card-title>{{ user.username }}</mat-card-title>
        <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="user-info">
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
        </div>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-raised-button color="warn" (click)="onDelete()">Delete</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .user-card {
      max-width: 400px;
      margin: 16px;
    }
    .user-info {
      padding: 16px 0;
    }
    .user-info p {
      margin: 8px 0;
    }
  `]
})
export class UserDetailComponent {
  @Input() user!: User;
  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.user.id);
  }
}
