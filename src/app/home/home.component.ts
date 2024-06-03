import { Component, inject } from '@angular/core';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';
import { FirestoreService } from '../firestore.service';
import { SpinnerComponent } from '../components/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter />
        <button
          class="primary"
          type="button"
          (click)="filterResults(filter.value)"
        >
          Search
        </button>
      </form>
    </section>
    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
      >
      </app-housing-location>
    </section>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  isLoading: boolean = true;
  filteredLocationList: HousingLocation[] = [];
  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }

    this.filteredLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );
  }

  constructor(private firestoreService: FirestoreService) {
    this.firestoreService
      .getHousingLocations()
      .subscribe((data: HousingLocation[]) => {
        this.housingLocationList = data;
        this.filteredLocationList = data;
        this.isLoading = false;
      });
  }
}
