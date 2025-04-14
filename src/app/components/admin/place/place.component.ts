import { Component, OnInit } from '@angular/core';
import { Place, PlaceService } from '../../../services/place.service';
import { TagPlace, TagService } from '../../../services/tag.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export class PlaceComponent  implements OnInit {
  places: Place[] = [];
  tags: TagPlace[] = []; 
  newPlace: Place = {
    id: '',
    name: '',
    category: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    openingHours: {},
    averageRating: 0,
    reviewCount: 0,
    tags: [],
            images: [],
  };
  editPlaceId: string | null = null;
  editPlace: Place | null = null;
  constructor(private placeService: PlaceService, private tagService: TagService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.loadPlaces();
    this.loadTags();
  }
  loadPlaces(): void {
    this.placeService.getAllPlaces().subscribe({
      next: (response) => {
        console.log('Places récupérées :', response);
        this.places = response.data; // Assignez uniquement la propriété `data` qui contient le tableau des places
      },
      error: (err) => {
        console.error('Erreur lors du chargement des places :', err);
        this.places = []; // Assurez-vous que `places` est un tableau vide en cas d'erreur
      }
    });
  }
  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (response) => {
        console.log('Tags récupérés :', response);
        this.tags = response.data; // Assignez uniquement la propriété `data` qui contient le tableau des tags
              this.cdr.detectChanges(); // Force la détection des changements

      },
      error: (err) => {
        console.error('Erreur lors du chargement des tags :', err);
        this.tags = []; // Assurez-vous que `tags` est un tableau vide en cas d'erreur
      }
    });
  }
  addPlace(): void {
    this.placeService.createPlace(this.newPlace).subscribe(() => {
      this.newPlace = {
        id: '',
        name: '',
        category: '',
        description: '',
        address: '',
        latitude: 0,
        longitude: 0,
        phoneNumber: '',
        openingHours: {},
        averageRating: 0,
        reviewCount: 0,
        tags: [],
               images: [],
      };
      this.loadPlaces(); // Recharge la liste des places
    });
  }
  editPlaceDetails(place: Place): void {
    this.editPlaceId = place.id;
    this.editPlace = { ...place }; 
  }

  updatePlace(): void {
    if (!this.editPlaceId || !this.editPlace) return;
    this.placeService.updatePlace(this.editPlaceId, this.editPlace).subscribe(() => {
      this.editPlaceId = null;
      this.editPlace = null;
      this.loadPlaces();
    });
  }

  deletePlace(id: string): void {
    this.placeService.deletePlace(id).subscribe(() => {
      this.loadPlaces();
    });
  }

  
  
}