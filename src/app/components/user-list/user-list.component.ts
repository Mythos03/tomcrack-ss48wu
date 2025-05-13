import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {UserFormComponent} from '../user-detail/user-form.component';
import {UserDetailComponent} from '../user-detail/user-detail.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, UserFormComponent, UserDetailComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  // In user-list.component.ts
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];
  expandedDetail: string | null = null;

  isExpandedRow = (index: number, row: any) => row.id === this.selectedUserId;
  selectedUserId: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  onSaveUser(user: User): void {
    this.userService.addUser(user).subscribe(() => {
      this.loadUsers();
    });
  }

  onDeleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers();
      if (this.selectedUserId === userId) {
        this.selectedUserId = null;
      }
    });
  }

  toggleUserDetails(userId: string): void {
    this.selectedUserId = this.selectedUserId === userId ? null : userId;
  }

  isDetailRow(index: number, row: any): boolean {
    return this.selectedUserId === row.id;
  }
}
