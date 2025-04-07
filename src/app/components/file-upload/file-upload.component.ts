// src/app/components/file-upload/file-upload.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FileService } from '../../services/file.service';
import { File as CustomFile, createFile } from '../../models/file.model';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  fileForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private fileService: FileService) {
    this.fileForm = this.fb.group({
      fileName: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileForm.patchValue({ fileName: file.name, file: file });
    }
  }

  onSubmit() {
    if (this.fileForm.valid && this.selectedFile) {
      const category: Category = { id: '1', name: 'default' }; // Example category
      const uploader: User = { id: '1', username: 'admin', email: 'admin@example.com', password: 'encrypted', role: 'admin' }; // Example uploader

      const customFile: CustomFile = createFile(
        this.selectedFile.name,
        this.selectedFile.size,
        '', // Set the download URL if available
        category,
        'Description of the file', // Example description
        uploader
      );

      this.fileService.addFile(customFile);
      alert('Fájl feltöltése sikeres!');
      this.fileForm.reset();
      this.selectedFile = null;
    } else {
      alert('Kérlek válassz egy fájlt!');
    }
  }
}
