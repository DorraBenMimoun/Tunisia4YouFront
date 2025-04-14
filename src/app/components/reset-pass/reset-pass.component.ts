import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css'
})
export class ResetPassComponent {
    resetPasswordForm: FormGroup;
    newPassword: string = '';
    confirmPassword: string = '';
  
    constructor(private fb: FormBuilder, private router: Router) {
      // Initialize the form with validation
      this.resetPasswordForm = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, {
        validator: this.passwordMatchValidator
      });
    }
  
    // Custom validator to check if the passwords match
    passwordMatchValidator(group: FormGroup) {
      const password = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    }
  
    // Method to handle reset password submission
    resetPassword() {
      if (this.resetPasswordForm.valid) {
        const { newPassword } = this.resetPasswordForm.value;
        console.log('Resetting password to:', newPassword);
        // Call the service to reset the password
        // this.authService.resetPassword(newPassword).subscribe(response => {
        //   alert('Password reset successful!');
        //   this.router.navigate(['/login']);
        // });
      }
    }
}
