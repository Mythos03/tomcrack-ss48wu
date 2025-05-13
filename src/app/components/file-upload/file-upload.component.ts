import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {FileService} from '../../services/file.service';
import {createFile} from '../../models/file.model';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  fileInput: HTMLInputElement | null = null;

  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileInput = input;

    if (input?.files?.length) {
      const file = input.files[0];
      if (file) {
        this.selectedFile = file;
      }
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.showError('Nincs kiválasztott fájl');
      return;
    }

    this.isUploading = true;

    const fileData = createFile(
      this.selectedFile.name,
      this.selectedFile.size,
      this.selectedFile.name,
      null,
      '',
      undefined
    );

    this.fileService.addFile(fileData)
      .pipe(
        catchError(error => {
          console.error('Error saving file metadata:', error);
          this.showError('Hiba történt a fájl mentése közben');
          return of(null);
        }),
        finalize(() => {
          this.isUploading = false;
        })
      )
      .subscribe(result => {
        if (result) {
          this.showSuccess('A fájl sikeresen mentve');
          this.resetForm();
        }
      });
  }

  private resetForm(): void {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
