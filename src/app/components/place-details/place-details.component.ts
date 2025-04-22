import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place, PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.css']
})
export class PlaceDetailsComponent {
    place!: Place;
  currentImageIndex = 0;
  id = "";
  constructor(private route: ActivatedRoute,
        private placeService: PlaceService,
    
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadPlace();
  }

  loadPlace(): void {
    this.placeService.getPlaceById(this.id).subscribe({
      next: (res) => {
        this.place = res.data;
      },
      error: (err) => {
        console.error('Erreur de chargement du lieu', err);
      }
    });
  }


  getCurrentImage(): string {
    if (!this.place?.images?.length) {
      return 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg';
    }
    return 'http://localhost:5066' + this.place.images[this.currentImageIndex];
  }

  nextImage(): void {
    if (this.place?.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.place.images.length;
    }
  }

  previousImage(): void {
    if (this.place?.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.place.images.length) % this.place.images.length;
    }
  }

  getFormattedHours(): string {
    if (!this.place?.openingHours) return 'Non disponible';
    return Object.entries(this.place.openingHours)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join('\n');
  }
  
} 