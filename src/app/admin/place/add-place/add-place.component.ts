import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Place, PlaceService } from '../../../services/place.service';
import { TagPlace, TagService } from '../../../services/tag.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrl: './add-place.component.css'
})
export class AddPlaceComponent implements OnInit {
  tagSearch: string = '';
  filteredTags: TagPlace[] = [];
  categories: string[] = [
    'Restaurant',
    'Café',
    'Supermarché',
    'Pharmacie',
    'École',
    'Université',
    'Hôpital',
    'Banque',
    'Salle de sport',
    'Hôtel',
    'Parc',
    'Cinéma',
    'Boulangerie',
    'Station-service',
    'Coiffeur',
    'Bureau de poste',
    'Musée',
    'Centre commercial',
    'Mosquée',
    'Église'
  ];
  
  filteredCategories: string[] = [];
  showCategoryDropdown: boolean = false;
  
  filterCategories(): void {
    const input = this.newPlace.category.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.toLowerCase().includes(input)
    );
  }
  
  selectCategory(category: string): void {
    this.newPlace.category = category;
    this.filteredCategories = [];
    this.showCategoryDropdown = false;
  }
  
  hideDropdownWithDelay(): void {
    setTimeout(() => {
      this.showCategoryDropdown = false;
    }, 200); // pour laisser le temps au clic
  }
  
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

  constructor(
    private placeService: PlaceService,
    private tagService: TagService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.generateHours();
    this.loadPlaces();
    this.loadTags();
  }

  loadPlaces(): void {
    this.placeService.getAllPlaces().subscribe({
      next: (response) => {
        console.log('Places récupérées :', response);
        this.places = response.data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des places :', err);
        this.toastr.error("Impossible de charger les lieux.", "Erreur");
        this.places = [];
      }
    });
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (response) => {
        console.log('Tags récupérés :', response);
        this.tags = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tags :', err);
        this.toastr.error("Impossible de charger les tags.", "Erreur");
        this.tags = [];
      }
    });
  }

  addPlace(): void {
    console.log('Nouvelle place à ajouter :', this.newPlace);
    this.placeService.createPlace(this.newPlace).subscribe({
      next: () => {
        this.toastr.success('Lieu ajouté avec succès !', 'Succès');
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
        this.selectedTags = [];
        this.loadPlaces();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout :', err);
        const msg = err.error?.message || 'Une erreur est survenue.';
        this.toastr.error(msg, 'Erreur');
      }
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
      this.newPlace.tags = this.selectedTags;
      this.tagSearch = '';
      this.filteredTags = [];
    }
  }

  removeTag(tagLibelle: string): void {
    this.selectedTags = this.selectedTags.filter(tag => tag !== tagLibelle);
    this.newPlace.tags = this.selectedTags;
  }

  generateHours(): void {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        this.hours.push(formatted);
      }
    }
  }

  addOpeningHour(): void {
    if (this.selectedDay && this.openingHourStart && this.openingHourEnd) {
      const hourRange = `${this.openingHourStart} - ${this.openingHourEnd}`;
      const current = this.newPlace.openingHours || {};
      current[this.selectedDay] = hourRange;
      this.newPlace.openingHours = current;
    }
  }

  removeOpeningHour(day: string): void {
    const current = this.newPlace.openingHours || {};
    delete current[day];
    this.newPlace.openingHours = current;
  }

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
        this.newPlace.images = currentImages;
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeImage(index: number): void {
    const currentImages = this.newPlace.images || [];
    currentImages.splice(index, 1);
    this.newPlace.images = currentImages;
  }
}

