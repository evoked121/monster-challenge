import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <main style="display:grid;place-items:center;min-height:100vh;">
      <button (click)="loginWithGoogle()" style="padding:10px 16px;cursor:pointer;">
        Sign in with Google
      </button>
    </main>
  `
})
export class LoginComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(auth, googleProvider);
    await this.router.navigateByUrl('/home');
  }
}
