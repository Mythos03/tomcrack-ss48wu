import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';
import {FileService} from '../../services/file.service';
import {File} from '../../models/file.model';
import {FileSizePipe} from '../../pipes/file-size.pipe';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    FileSizePipe
  ],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  files: File[] = [];
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (files) => {
          this.files = files;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading files:', error);
          this.loading = false;
          this.showError('Hiba történt a fájlok betöltése közben');
        }
      });
  }

  downloadFile(file: File): void {
    if (file?.path) {
      const link = document.createElement('a');
      link.href = file.path;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.showError('Fájl elérési út hiányzik');
    }
  }

  editFile(file: File): void {
    if (!file.id) return;

    const updatedFile = {
      name: prompt('Új fájlnév:', file.name) || file.name,
      description: prompt('Új leírás:', file.description) || file.description
    };

    this.fileService.updateFile(file.id, updatedFile).subscribe({
      next: () => {
        Object.assign(file, updatedFile);
        this.showSuccess('Fájl sikeresen módosítva');
      },
      error: (error) => {
        console.error('Error updating file:', error);
        this.showError('Hiba történt a fájl módosítása közben');
      }
    });
  }

  deleteFile(file: File): void {
    if (confirm('Biztosan törölni szeretnéd ezt a fájlt?') && file.id) {
      this.fileService.deleteFile(file.id).subscribe({
        next: () => {
          this.files = this.files.filter(f => f.id !== file.id);
          this.showSuccess('Fájl sikeresen törölve');
        },
        error: (error) => {
          console.error('Error deleting file:', error);
          this.showError('Hiba történt a fájl törlése közben');
        }
      });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
