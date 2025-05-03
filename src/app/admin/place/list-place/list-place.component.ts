import { Component, OnInit } from '@angular/core';
import { Place, PlaceService } from '../../../services/place.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-place',
  templateUrl: './list-place.component.html',
  styleUrl: './list-place.component.css'
})
export class ListPlaceComponent implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  searchTerm: string = '';

  constructor(
    private placeService: PlaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.placeService.getAllPlaces().subscribe({
      next: (res) => {
        this.places = res.data;
        this.filteredPlaces = [...this.places];
      },
      error: (err) => {
        console.error('Erreur de chargement des lieux', err);
      }
    });
  }

  searchPlaces(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      this.filteredPlaces = this.places.filter(place =>
        place.name.toLowerCase().includes(term)
      );
    } else {
      this.filteredPlaces = [...this.places];
    }
  }

  getDays(openingHours: { [key: string]: string }): string[] {
    return Object.keys(openingHours);
  }

  goToAddPlace(): void {
    this.router.navigate(['/admin/places/add']);
  }

  editPlace(id: string): void {
    this.router.navigate(['/admin/places/edit', id]);
  }

  deletePlace(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce lieu ?')) {
      this.placeService.deletePlace(id).subscribe(() => {
        this.loadPlaces();
      });
    }
  }
}
