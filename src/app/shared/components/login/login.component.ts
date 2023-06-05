import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule} from "@angular/material/icon";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AutoFocusDirective } from "../../directives/auto-focus.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, ReactiveFormsModule, AutoFocusDirective, MatFormFieldModule, MatInputModule],
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
        Validators.minLength(8)
      ]
    }]
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
  }

  close(data: any) {
    this.dialogRef.close('teste')
  }

  get user() {
    return this.form.get('user')
  }

  get password() {
    return this.form.get('password')
  }
}
