import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {File} from '../../models/file.model';
import {Comment} from '../../models/comment.model';
import {FileSizePipe} from '../../pipes/file-size.pipe';
import {CommentService} from '../../services/comment.service';
import {FileService} from '../../services/file.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-file-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FileSizePipe
  ],
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnChanges {
  @Input() file!: File;
  @Output() fileDeleted = new EventEmitter<void>();
  comments$: Observable<Comment[]> | undefined;

  constructor(
    private commentService: CommentService,
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && this.file?.id) {
      this.comments$ = this.commentService.getCommentsForFile(this.file.id);
    }
  }

  downloadFile(): void {
    if (this.file?.path) {
      const link = document.createElement('a');
      link.href = this.file.path;
      link.download = this.file.name ?? 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.showError('Fájl elérési út hiányzik');
    }
  }

  deleteFile(): void {
    if (confirm('Biztosan törölni szeretnéd ezt a fájlt?') && this.file.id) {
      this.fileService.deleteFile(this.file.id).subscribe({
        next: () => {
          this.showSuccess('Fájl sikeresen törölve');
          this.fileDeleted.emit();
        },
        error: (error) => {
          console.error('Error deleting file:', error);
          this.showError('Hiba történt a fájl törlése közben');
        }
      });
    }
  }

  editFile(): void {
    if (!this.file.id) return;

    const updatedFile = {
      name: prompt('Új fájlnév:', this.file.name) || this.file.name,
      description: prompt('Új leírás:', this.file.description) || this.file.description
    };

    this.fileService.updateFile(this.file.id, updatedFile).subscribe({
      next: () => {
        Object.assign(this.file, updatedFile);
        this.showSuccess('Fájl sikeresen módosítva');
      },
      error: (error) => {
        console.error('Error updating file:', error);
        this.showError('Hiba történt a fájl módosítása közben');
      }
    });
  }

  getFajlAriaLabel(fajlNev: string): string {
    return `Fájl letöltése: ${fajlNev}`;
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
