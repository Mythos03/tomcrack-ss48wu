// src/app/components/file-list/file-list.component.ts
import { Component, OnInit } from '@angular/core';
import { File } from '../../models/file.model';
import { FileService } from '../../services/file.service';
import { FileDetailComponent } from '../file-detail/file-detail.component';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { MatListModule } from '@angular/material/list';
import {MatCard, MatCardSubtitle, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, FileDetailComponent, FileSizePipe, MatListModule, MatCard, MatCardTitle, MatCardSubtitle],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: File[] = [];
  selectedFile: File | null = null;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.files$.subscribe(files => {
      this.files = files;
    });
  }

  selectFile(file: File) {
    this.selectedFile = file;
  }
}
