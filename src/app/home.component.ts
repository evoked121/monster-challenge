import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { auth } from './firebase';
import { runtimeEnv } from './runtime-env';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzResultModule,
    NzTimePickerModule,
  ],
  template: `
    <main class="page">
      <button nz-button nzType="default" class="logout" (click)="logout()">Logout</button>

      <nz-card class="form-card">
        <h2 class="title">Flight Info Submission</h2>
        <p class="subtitle">
          Hi {{ user?.displayName || user?.email }}, fill in details and submit.
        </p>

        @if (result === 'success') {
          <nz-result
            nzStatus="success"
            nzTitle="Request submitted successfully"
            nzSubTitle="Done. Your flight information has been sent."
          ></nz-result>
        } @else {
          <form nz-form [formGroup]="form" (ngSubmit)="submit()">
            <nz-form-item>
              <nz-form-label [nzRequired]="true">Airline</nz-form-label>
              <nz-form-control nzErrorTip="Please enter airline">
                <input nz-input formControlName="airline" placeholder="e.g. Delta" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzRequired]="true">Flight Number</nz-form-label>
              <nz-form-control nzErrorTip="Please enter flight number">
                <input nz-input formControlName="flightNumber" placeholder="e.g. DL123" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzRequired]="true">Arrival Date</nz-form-label>
              <nz-form-control nzErrorTip="Please pick arrival date">
                <nz-date-picker
                  formControlName="arrivalDate"
                  nzPlaceHolder="Select date"
                ></nz-date-picker>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzRequired]="true">Arrival Time</nz-form-label>
              <nz-form-control nzErrorTip="Please pick arrival time">
                <nz-time-picker
                  formControlName="arrivalTime"
                  nzFormat="HH:mm"
                  nzPlaceHolder="Select time"
                ></nz-time-picker>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzRequired]="true">Number of Guests</nz-form-label>
              <nz-form-control nzErrorTip="Guests must be at least 1">
                <nz-input-number formControlName="numOfGuests" [nzMin]="1"></nz-input-number>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label>Comments</nz-form-label>
              <nz-form-control>
                <textarea
                  nz-input
                  formControlName="comments"
                  rows="3"
                  placeholder="Optional"
                ></textarea>
              </nz-form-control>
            </nz-form-item>

            @if (result === 'error') {
              <nz-alert
                nzType="error"
                [nzMessage]="errorMessage"
                nzShowIcon
                style="margin-bottom: 16px;"
              ></nz-alert>
            }

            <button nz-button nzType="primary" [disabled]="submitting">
              {{ submitting ? 'Submitting...' : 'Submit Flight Info' }}
            </button>
          </form>
        }
      </nz-card>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: linear-gradient(160deg, #f8fbff 0%, #eef3ff 100%);
      }

      .logout {
        position: fixed;
        top: 20px;
        right: 20px;
      }

      .form-card {
        width: min(640px, 100%);
        border-radius: 14px;
        box-shadow: 0 10px 40px rgba(58, 86, 212, 0.12);
      }

      .title {
        margin-bottom: 4px;
      }

      .subtitle {
        margin-bottom: 20px;
        color: #6b7280;
      }

      nz-date-picker,
      nz-time-picker,
      nz-input-number {
        width: 100%;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  submitting = false;
  result: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = 'Submission failed. Please check your input and try again.';
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    airline: ['', Validators.required],
    arrivalDate: [null as Date | null, Validators.required],
    arrivalTime: [null as Date | null, Validators.required],
    flightNumber: ['', Validators.required],
    numOfGuests: [1, [Validators.required, Validators.min(1)]],
    comments: [''],
  });

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      if (!user) {
        this.router.navigateByUrl('/');
      }
    });
  }

  async logout(): Promise<void> {
    await signOut(auth);
    await this.router.navigateByUrl('/');
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { airline, arrivalDate, arrivalTime, flightNumber, numOfGuests, comments } =
      this.form.getRawValue();
    if (!arrivalDate || !arrivalTime) {
      return;
    }

    const payload: {
      airline: string;
      arrivalDate: string;
      arrivalTime: string;
      flightNumber: string;
      numOfGuests: number;
      comments?: string;
    } = {
      airline: airline!.trim(),
      arrivalDate: arrivalDate.toISOString(),
      arrivalTime: this.toHHmm(arrivalTime),
      flightNumber: flightNumber!.trim(),
      numOfGuests: Number(numOfGuests),
    };

    const safeComments = comments?.trim();
    if (safeComments) {
      payload.comments = safeComments;
    }

    this.submitting = true;
    this.result = 'idle';

    try {
      const response = await fetch(
        'https://us-central1-crm-sdk.cloudfunctions.net/flightInfoChallenge',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: runtimeEnv.CHALLENGE_TOKEN,
            candidate: 'Haoran Wang',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const responseText = await response.text();
        this.errorMessage = responseText || this.errorMessage;
        this.result = 'error';
        return;
      }

      this.result = 'success';
      this.form.disable();
    } catch {
      this.result = 'error';
      this.errorMessage = 'Network error. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  private toHHmm(value: Date): string {
    const hours = `${value.getHours()}`.padStart(2, '0');
    const minutes = `${value.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
