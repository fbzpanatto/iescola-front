import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule} from "@angular/material/icon";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AutoFocusDirective } from "../../directives/auto-focus.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { UserLoginDataService } from "./user-login-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, ReactiveFormsModule, AutoFocusDirective, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../styles/popup.scss']
})
export class LoginComponent implements OnInit {

  form = this.fb.group({
    user: ['', {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }],
    password: ['', {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }]
  })
  private userLoginDataService = inject(UserLoginDataService)
  private router = inject(Router)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
  }

  login() {
    this.userLoginDataService.nextUserLoginData(this.form.value, this.dialogRef)
  }

  close() {
    this.dialogRef.close()
    this.router.navigate(['/'])
  }

  get user() {
    return this.form.get('user')
  }

  get password() {
    return this.form.get('password')
  }
}
