import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { CommentService } from '../../services/comment.service';
import { File } from '../../models/file.model';
import { User } from '../../models/user.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { Subject, takeUntil } from 'rxjs';
import { createComment } from '../../models/comment.model';

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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FileSizePipe
  ],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  files: File[] = [];
  newComments: { [fileId: string]: string } = {};
  currentUser: User = {
    id: '1',
    username: 'Current User',
    email: 'current.user@example.com',
    password: 'securepassword',
    role: 'user'
  };
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fileService: FileService,
    private commentService: CommentService,
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
          this.files = files.map(file => ({ ...file, comments: [] }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading files:', error);
          this.loading = false;
          this.showError('Error loading files');
        }
      });
  }

  publishComment(file: File): void {
    if (!file.id) return;
    const content = this.newComments[file.id];
    if (!content) return;

    const newComment = createComment(content, this.currentUser, file);
    this.commentService.addComment(newComment).subscribe(() => {
      file.comments = file.comments || [];
      file.comments.push(newComment);
      this.newComments[file.id] = '';
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
      this.showError('File path is missing');
    }
  }

  editFile(file: File): void {
    if (!file.id) return;

    const updatedFile = {
      name: prompt('New file name:', file.name) || file.name,
      description: prompt('New description:', file.description) || file.description
    };

    this.fileService.updateFile(file.id, updatedFile).subscribe({
      next: () => {
        Object.assign(file, updatedFile);
        this.showSuccess('File successfully updated');
      },
      error: (error) => {
        console.error('Error updating file:', error);
        this.showError('Error updating file');
      }
    });
  }

  deleteFile(file: File): void {
    if (confirm('Are you sure you want to delete this file?') && file.id) {
      this.fileService.deleteFile(file.id).subscribe({
        next: () => {
          this.files = this.files.filter(f => f.id !== file.id);
          this.showSuccess('File successfully deleted');
        },
        error: (error) => {
          console.error('Error deleting file:', error);
          this.showError('Error deleting file');
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
