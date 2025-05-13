import {Routes} from '@angular/router';
import {FileListComponent} from './components/file-list/file-list.component';
import {FileDetailComponent} from './components/file-detail/file-detail.component';

export const routes: Routes = [
  { path: 'files', component: FileListComponent },
  { path: 'files/:id', component: FileDetailComponent },
  { path: '', redirectTo: '/files', pathMatch: 'full' }
];
