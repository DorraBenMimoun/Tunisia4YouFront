import { Component, OnInit, ViewChild } from '@angular/core';
import { Place, PlaceService } from '../../services/place.service';
import { Router } from '@angular/router';
import { AddToListsComponent } from '../add-to-lists/add-to-lists.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  searchTerm: string = '';

        @ViewChild(AddToListsComponent) addToListModal!: AddToListsComponent;
  

  categories: string[] = ["test", "Restaurant", "string"];
  cities: string[] = [];
  popularTags: string[] = [];

  selectedCategory: string = '';
  selectedCity: string = '';
  selectedTags: string[] = [];

  constructor(
    private placeService: PlaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialPlaces();
  }

  loadInitialPlaces(): void {
    this.placeService.searchPlaces('', [], '', undefined, '').subscribe({
      next: (res) => {
        this.places = res.data;
        this.filteredPlaces = [...this.places];

        this.extractCitiesAndCategories();
        this.extractPopularTags();
      },
      error: (err) => {
        console.error('Erreur de chargement des lieux', err);
      }
    });
  }

  extractCitiesAndCategories(): void {
    const citiesSet = new Set<string>();
    const categoriesSet = new Set<string>();

    this.places.forEach(place => {
      if (place.city) citiesSet.add(place.city);
      if (place.category) categoriesSet.add(place.category);
    });

    this.cities = Array.from(citiesSet).sort();
    this.categories = Array.from(categoriesSet).sort();
  }

  extractPopularTags(): void {
    const tagMap = new Map<string, number>();

    this.places.forEach(place => {
      place.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    this.popularTags = Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }

  
  openAddToListModal(placeId : string) {
    this.addToListModal.openModal(placeId);
  }


  applyFilters(): void {
    this.placeService.searchPlaces(
      this.searchTerm,
      this.selectedTags,
      this.selectedCategory,
      undefined,
      this.selectedCity
    ).subscribe({
      next: (res) => {
        this.filteredPlaces = res.data;
      },
      error: (err) => {
        console.error('Erreur de recherche avec filtres', err);
        this.filteredPlaces = [];
      }
    });
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.applyFilters();
  }

  searchPlaces(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedCity = '';
    this.selectedTags = [];
    this.applyFilters();
  }

  getTodaysHours(place: Place): string {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date().getDay();
    const todayName = days[today];
    return place.openingHours[todayName] || 'Fermé aujourd\'hui';
  }

  viewDetails(id: string): void {
    this.router.navigate(['/place', id]);
  }
}
