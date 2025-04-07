// src/app/services/file.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { File } from '../models/file.model';
import { MOCK_FILES } from '../data/mock-files';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private filesSubject = new BehaviorSubject<File[]>(MOCK_FILES);
  files$ = this.filesSubject.asObservable();

  addFile(file: File) {
    const currentFiles = this.filesSubject.value;
    this.filesSubject.next([...currentFiles, file]);
  }
}
