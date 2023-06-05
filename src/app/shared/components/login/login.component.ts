import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule} from "@angular/material/icon";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AutoFocusDirective } from "../../directives/auto-focus.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FetchDataService } from "../../services/fetch-data.service";

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private fetchData: FetchDataService
  ) {}

  ngOnInit() {
  }

  login() {

    const data = {
      user: this.form.controls.user.value,
      password: this.form.controls.user.value
    }

    this.fetchData.loginPost('login', data)
      .subscribe((response: any) => {
        if(!response.error) {
          this.close(response)
        }
      })
  }

  close(data: any) {
    this.dialogRef.close(data)
  }

  get user() {
    return this.form.get('user')
  }

  get password() {
    return this.form.get('password')
  }
}
