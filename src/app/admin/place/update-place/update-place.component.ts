import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceService, Place } from '../../../services/place.service';
import { TagPlace, TagService } from '../../../services/tag.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-place',
  templateUrl: './update-place.component.html',
  styleUrls: ['./update-place.component.css']
})
export class UpdatePlaceComponent implements OnInit {
  updateForm!: FormGroup;
  placeId!: string;
  place!: Place;

  isLoaded = false;

  selectedDay: string = 'Lundi';
  openingHourStart: string = '08:00';
  openingHourEnd: string = '17:00';
  addHourForm!: FormGroup;
  hours: string[] = [];
  days: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  filteredTags: TagPlace[] = [];
  selectedTags: string[] = [];
  tags: TagPlace[] = [];
  tagForm!: FormGroup;

  mapInputTemp: string = '';
  private readonly BACKEND_URL = 'http://localhost:5066'; // ou l'URL de ton API


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private placeService: PlaceService,
    private router: Router,
    private tagService: TagService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
    
  ) { }

  ngOnInit(): void {
    this.placeId = this.route.snapshot.params['id'];
    console.log('Place ID:', this.placeId);

    this.addHourForm = this.fb.group({
      day: ['Lundi', Validators.required],
      start: ['08:00', Validators.required],
      end: ['17:00', Validators.required]
    });
    this.loadTags();
    this.tagForm = this.fb.group({
      tagSearch: ['']
    });


    this.generateHours(); // Génère les horaires de 00:00 à 23:30 par pas de 30 min
    this.placeService.getPlaceById(this.placeId).subscribe(place => {
      this.place = place.data;
      this.selectedTags = this.place.tags || [];
      this.buildForm();
      this.isLoaded = true;
    });
  }

  private convertImagesToBase64(): Promise<string[]> {
    const promises = this.images.controls.map(imageGroup => {
      const file = imageGroup.get('file')?.value;
      const preview = imageGroup.get('preview')?.value;
  
      // Si l’image est déjà un lien (et pas modifiée), on l’exclut totalement
      if (!file && preview && preview.startsWith(this.BACKEND_URL)) {
        return Promise.resolve(null); // <- on renverra null pour cette image à exclure
      }
  
      // Sinon, c’est une nouvelle image : on convertit
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
  
    return Promise.all(promises).then(results => {
      // Filtrer les nulls et forcer le typage
      return results.filter((img): img is string => img !== null);
    });
      }
  
  
  buildForm(): void {
    this.updateForm = this.fb.group({
      name: [this.place.name, Validators.required],
      category: [this.place.category, Validators.required],
      description: [this.place.description, Validators.required],
      address: [this.place.address, Validators.required],
      mapUrl: [this.place.mapUrl, Validators.required],
      mapInput: [this.place.mapUrl], // <- AJOUT ICI
      city: [this.place.city, Validators.required],
      phoneNumber: [this.place.phoneNumber, Validators.required],
      tags: [this.place.tags || []],
      images: this.fb.array(
        (this.place.images || []).map(imgPath => {
          const fullUrl = imgPath.startsWith('http') ? imgPath : this.BACKEND_URL + imgPath;
          return this.fb.group({
            file: [null],
            preview: [fullUrl]
          });
        })
      ),
      
      
            openingHours: this.fb.group(
        Object.fromEntries(
          Object.entries(this.place.openingHours || {}).map(([day, hours]) => [
            day,
            this.fb.control(hours || '')
          ])
        )
      ),
    });

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
    const day = this.addHourForm.value.day;
    const start = this.addHourForm.value.start;
    const end = this.addHourForm.value.end;

    if (day && start && end) {
      const hourRange = `${start} - ${end}`;
      const openingHours = this.updateForm.get('openingHours') as FormGroup;

      if (!openingHours.contains(day)) {
        openingHours.addControl(day, this.fb.control(hourRange));
      }
      this.place = this.updateForm.value;

      // Réinitialiser le mini-formulaire (optionnel)
      this.addHourForm.reset({
        day: 'Lundi',
        start: '08:00',
        end: '17:00'
      });
    }
  }


  // Supprimer un jour des horaires
  removeOpeningHour(day: string): void {
    const openingHours = this.updateForm.get('openingHours') as FormGroup;
    openingHours.removeControl(day);
  }

  // Liste des jours définis
  getOpeningDays(): string[] {
    const opening = this.updateForm.get('openingHours') as FormGroup;
    return Object.keys(opening.value);
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
  filterTags(): void {
    const tagSearchControl = this.tagForm.get('tagSearch');
    const query = tagSearchControl ? tagSearchControl.value.toLowerCase() : '';
    console.log('liste des tag', this.tags);
    this.filteredTags = this.tags.filter(
      tag => 
        tag.libelle.toLowerCase().includes(query) &&
             !this.selectedTags.includes(tag.libelle)
    );
    console.log('filteredTags', this.filteredTags);
  }
    
  addTag(tagLibelle: string): void {
    if (!this.selectedTags.includes(tagLibelle)) {
      this.selectedTags.push(tagLibelle);
      this.updateForm.get('tags')?.setValue(this.selectedTags);
      this.tagForm.get('tagSearch')?.setValue('');

      this.filteredTags = [];
    }
  }
  removeTag(tagLibelle: string): void {
    this.selectedTags = this.selectedTags.filter(tag => tag !== tagLibelle);
    this.updateForm.get('tags')?.setValue(this.selectedTags);
  }

  get images(): FormArray {
    return this.updateForm.get('images') as FormArray;
  }
  addImage(): void {
    this.images.push(this.fb.group({
      file: [null],
      preview: [null]
    }));
  }
  
  removeImage(index: number): void {
    this.images.removeAt(index);
  }
  onFileSelected(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageGroup = this.images.at(index);
        imageGroup.get('file')?.setValue(file);               // Le fichier original
        imageGroup.get('preview')?.setValue(reader.result);   // URL temporaire
      };
      reader.readAsDataURL(file);
    }
  }
  
  onMapInputBlur(): void {
    const input = this.updateForm.get('mapInput')?.value || '';
    this.extractMapUrlFromIframe(input);
  }

  extractMapUrlFromIframe(input: string): void {
    const iframeMatch = input.match(/src="([^"]+)"/);
    if (iframeMatch && iframeMatch[1]) {
      this.updateForm.get('mapUrl')?.setValue(iframeMatch[1]);
      this.toastr.success('Lien extrait depuis iframe.', 'Succès');
      this.updateForm.get('mapInput')?.setValue(iframeMatch[1]); // Met à jour le champ mapInput avec l'URL extraite
      return;
    }
  
    const urlMatch = input.match(/https:\/\/www\.google\.com\/maps[^"]*/);
    if (urlMatch && urlMatch[0]) {
      this.updateForm.get('mapUrl')?.setValue(urlMatch[0]);
      this.toastr.success('Lien Google Maps enregistré !', 'Succès');
      return;
    }
  
    this.updateForm.get('mapUrl')?.setValue('');
    this.toastr.error('Aucun lien Google Maps valide détecté.', 'Erreur');
  }
  
  

  onSubmit(): void {
    console.log('Formulaire de mise à jour envoyé:', this.updateForm.value);
    const updatedPlace = this.updateForm.value;
  
    this.convertImagesToBase64().then(base64Images => {
      updatedPlace.images = base64Images;
  
      this.placeService.updatePlace(this.placeId, updatedPlace).subscribe({
        next: () => {
          this.toastr.success('Lieu mis à jour avec succès !', 'Succès');
          this.router.navigate(['/admin/places']);
        },
        error: (error: HttpErrorResponse) => {
          const msg = error.error?.message || 'Une erreur est survenue.';
          this.toastr.error(msg, 'Erreur');
        }
      });
    });
  }
  
  
}
