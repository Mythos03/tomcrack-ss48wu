import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
      <mat-form-field appearance="outline">
        <mat-label>Felhasználónév</mat-label>
        <input matInput formControlName="username" required>
        <mat-error *ngIf="userForm.get('username')?.errors?.['required'] && userForm.get('username')?.touched">
          A felhasználónév megadása kötelező
        </mat-error>
        <mat-error *ngIf="userForm.get('username')?.errors?.['minlength']">
          A felhasználónévnek legalább 3 karakter hosszúnak kell lennie
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email cím</mat-label>
        <input matInput formControlName="email" type="email" required>
        <mat-error *ngIf="userForm.get('email')?.errors?.['required'] && userForm.get('email')?.touched">
          Az email cím megadása kötelező
        </mat-error>
        <mat-error *ngIf="userForm.get('email')?.errors?.['email'] && userForm.get('email')?.touched">
          Kérjük, adjon meg egy érvényes email címet
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ isEditMode ? 'Új jelszó (opcionális)' : 'Jelszó' }}</mat-label>
        <input matInput
               formControlName="password"
               [type]="hidePassword ? 'password' : 'text'"
               [placeholder]="isEditMode ? 'Hagyja üresen, ha nem változik' : ''"
               [required]="!isEditMode">
        <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
          <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
        </button>
        <mat-error *ngIf="userForm.get('password')?.errors?.['required'] && userForm.get('password')?.touched">
          A jelszó megadása kötelező új felhasználó esetén
        </mat-error>
        <mat-error *ngIf="userForm.get('password')?.errors?.['pattern'] && userForm.get('password')?.value">
          A jelszónak tartalmaznia kell nagybetűt, kisbetűt és számot
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Jogosultság</mat-label>
        <mat-select formControlName="role" required>
          <mat-option value="user">Felhasználó</mat-option>
          <mat-option value="moderator">Moderátor</mat-option>
          <mat-option value="admin">Admin</mat-option>
        </mat-select>
        <mat-error *ngIf="userForm.get('role')?.errors?.['required'] && userForm.get('role')?.touched">
          A jogosultság kiválasztása kötelező
        </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit"
              [disabled]="userForm.invalid || userForm.pristine">
        {{ isEditMode ? 'Módosítás' : 'Létrehozás' }}
      </button>
    </form>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      padding: 1rem;
    }
  `]
})
export class UserFormComponent implements OnChanges {
  @Input() user?: User;
  @Output() save = new EventEmitter<User>();

  userForm: FormGroup;
  isEditMode = false;
  hidePassword = true;

  private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['user', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.isEditMode = !!this.user;
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.userForm.reset();

    if (this.isEditMode && this.user) {
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        role: this.user.role
      });
      this.userForm.get('password')?.setValidators([
        Validators.pattern(this.passwordPattern)
      ]);
    } else {
      this.userForm.get('password')?.setValidators([
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      let userData: Partial<User> = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role as "admin" | "moderator" | "user"
      };

      if (this.isEditMode) {
        if (formData.password) {
          userData.password = formData.password;
        }
        if (this.user) {
          userData.id = this.user.id;
        }
      } else {
        userData = {
          ...userData,
          id: '',
          password: formData.password
        } as User;
      }

      this.save.emit(userData as User);

      if (!this.isEditMode) {
        this.resetForm();
      }
    }
  }
}
