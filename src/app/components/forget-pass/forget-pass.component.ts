import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.css'
})
export class ForgetPassComponent {
  forgotPasswordForm: FormGroup;
  email: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form with validation
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Method to handle forgot password submission
  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      console.log('Sending reset link to:', email);
      // Call the service to send the reset password link
      // this.authService.sendResetPasswordLink(email).subscribe(response => {
      //   alert('Reset password link sent!');
      //   this.router.navigate(['/login']);
      // });
    }
  }
}


