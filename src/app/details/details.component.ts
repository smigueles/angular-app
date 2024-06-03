import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { SpinnerComponent } from '../components/spinner.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>
    <article *ngIf="!isLoading">
      <img
        class="listing-photo"
        [src]="housingLocation?.photo"
        alt="Exterior photo of {{ housingLocation?.name }}"
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">
          {{ housingLocation?.city }}, {{ housingLocation?.state }}
        </p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
          <li>
            Does this location have laundry: {{ housingLocation?.laundry }}
          </li>
        </ul>
      </section>
      <ng-container *ngIf="showForm; else showNoAvailableUnitsDialog">
        <section class="listing-apply">
          <h2 class="section-heading">Apply now to live here</h2>
          <form [formGroup]="applyForm" (submit)="submitApplication()">
            <label for="first-name">First Name</label>
            <input id="first-name" type="text" formControlName="firstName" />
            <label for="last-name">Last Name</label>
            <input id="last-name" type="text" formControlName="lastName" />
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" />
            <button type="submit" class="primary">Apply now</button>
          </form>
        </section>
      </ng-container>
      <ng-template #showNoAvailableUnitsDialog>
        <div>
          <h1>No available units!</h1>
        </div>
      </ng-template>
    </article>
  `,
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | null = null;
  isLoading: boolean = true;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );
  }
  showForm: boolean = false;

  constructor(private firestoreService: FirestoreService) {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.firestoreService
      .getHousingLocationById(housingLocationId)
      .then((data) => {
        this.housingLocation = data;
        this.showForm =
          !!this.housingLocation && this.housingLocation?.availableUnits >= 1;
        this.isLoading = false;
      });
  }
}
