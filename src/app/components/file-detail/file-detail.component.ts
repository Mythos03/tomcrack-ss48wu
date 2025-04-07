// src/app/components/file-detail/file-detail.component.ts
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { File } from '../../models/file.model';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { User } from '../../models/user.model';
import { MOCK_USERS } from '../../data/mock-users';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  standalone: true,
  styleUrls: ['./file-detail.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatListItem,
    MatList
  ]
})
export class FileDetailComponent implements OnInit, OnChanges {
  @Input() file!: File;
  @Input() currentUser?: User;

  comments: Comment[] = [];
  commentForm!: FormGroup;

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.initForm();
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && !changes['file'].firstChange) {
      this.loadComments();
    }
  }

  private initUser(): void {
    if (!this.currentUser) {
      this.currentUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    }
  }

  private initForm(): void {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private loadComments(): void {
    if (this.file) {
      this.comments = this.commentService.getCommentsForFile(this.file);
    }
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.file && this.currentUser) {
      const content = this.commentForm.get('content')?.value;
      this.commentService.addComment(content, this.currentUser, this.file);
      this.loadComments();
      this.commentForm.reset();
    }
  }
}
