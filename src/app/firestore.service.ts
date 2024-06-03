// firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HousingLocation } from './housinglocation';
import { query, where, getDocs, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  getHousingLocations() {
    return this.firestore
      .collection<HousingLocation>('house_locations')
      .valueChanges();
  }

  async getHousingLocationById(
    documentIndex: number
  ): Promise<HousingLocation | null> {
    const q = query(
      collection(this.firestore.firestore, 'house_locations'),
      where('id', '==', documentIndex)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { ...doc.data() } as HousingLocation;
    } else {
      return null;
    }
  }
}
