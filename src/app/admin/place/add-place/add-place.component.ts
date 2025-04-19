import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Place, PlaceService } from '../../../services/place.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagPlace, TagService } from '../../../services/tag.service';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrl: './add-place.component.css'
})
export class AddPlaceComponent implements OnInit {
  tagSearch: string = '';
filteredTags: TagPlace[] = [];
selectedTags: string[] = [];
days: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
hours: string[] = [];

selectedDay: string = 'Lundi';
openingHourStart: string = '08:00';
openingHourEnd: string = '17:00';

 places: Place[] = [];
   tags: TagPlace[] = []; 
   newPlace: Place = {
     id: '',
     name: '',
     category: '',
     description: '',
     address: '',
     city: '',
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
    this.generateHours();

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
    console.log('Nouvelle place à ajouter :', this.newPlace);
     this.placeService.createPlace(this.newPlace).subscribe(() => {
       this.newPlace = {
         id: '',
         name: '',
         category: '',
         description: '',
         address: '',
         city: '',
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
  
   filterTags(): void {
    const query = this.tagSearch.toLowerCase();
    this.filteredTags = this.tags.filter(
      tag => tag.libelle.toLowerCase().includes(query) &&
             !this.selectedTags.includes(tag.libelle)
    );
  }
  
  addTag(tagLibelle: string): void {
    if (!this.selectedTags.includes(tagLibelle)) {
      this.selectedTags.push(tagLibelle);
      this.newPlace.tags=this.selectedTags;
      this.tagSearch = '';
      this.filteredTags = [];
    }
  }
  
  removeTag(tagLibelle: string): void {
    this.selectedTags = this.selectedTags.filter(tag => tag !== tagLibelle);
    this.newPlace.tags=this.selectedTags;
  }

  // Génère les horaires de 00:00 à 23:30 par pas de 30 min
generateHours(): void {
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      this.hours.push(formatted);
    }
  }
}

// Ajouter une paire d'heures pour un jour donné
addOpeningHour(): void {
  if (this.selectedDay && this.openingHourStart && this.openingHourEnd) {
    const hourRange = `${this.openingHourStart} - ${this.openingHourEnd}`;
    const current = this.newPlace.openingHours || {};
    current[this.selectedDay] = hourRange;
    this.newPlace.openingHours=current;
  }
}

// Supprimer un jour des horaires
removeOpeningHour(day: string): void {
  const current = this.newPlace.openingHours || {};
  delete current[day];
  this.newPlace.openingHours=current;
}

// Liste des jours définis
getOpeningDays(): string[] {
  const opening = this.newPlace.openingHours;
  return opening ? Object.keys(opening) : [];
}
onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files);

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      const currentImages = this.newPlace.images || [];
      currentImages.push(imageUrl);
      this.newPlace.images=currentImages;
    };
    reader.readAsDataURL(file);
  });

  // Réinitialise l'input file
  input.value = '';
}

removeImage(index: number): void {
  const currentImages = this.newPlace.images || [];
  currentImages.splice(index, 1);
  this.newPlace.images=currentImages;
}

  }

