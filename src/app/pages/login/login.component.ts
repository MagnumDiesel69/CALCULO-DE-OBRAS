// ✅ login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      recordarme: [false]
    });
  }

  submit() {
    console.log('Se ejecutó submit()');

    if (this.form.valid) {
      console.log(this.form.value);
      this.router.navigate(['/dashboard']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}