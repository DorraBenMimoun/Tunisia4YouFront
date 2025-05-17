import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceService } from '../../services/place.service';
import { TagPlace, TagService } from '../../services/tag.service';
import { PreferencesService } from '../../services/preferences.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  @Output() preferencesSaved = new EventEmitter<void>();
  preferencesForm: FormGroup;

  availableCategories: string[] = [
    'Restaurant',
    'Café',
    "Centre d'escape game",
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

  availableTags: TagPlace[] = [];
  cities: string[] = [
    'Tunis', 'Sfax', 'Sousse', 'Ariana', 'Nabeul', 'Bizerte',
    'Kairouan', 'Gabès', 'Monastir', 'Mahdia', 'Kasserine',
    'Tataouine', 'Jendouba', 'Gafsa', 'Medenine',
    'Sidi bou said'
  ];
  priceOptions = [
    { label: 'Peu importe', value: 'any' },
    { label: 'Économique', value: 'low' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Premium', value: 'high' }
  ];
  submitted = false;
  loading = false;
  allowRisk = false;

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private preferencesService: PreferencesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.preferencesForm = this.fb.group({
      preferredTags: [[], [Validators.required, Validators.minLength(1)]],
      preferredCities: [[], [Validators.required, Validators.minLength(1)]],
      preferredCategories: [[], [Validators.required, Validators.minLength(1)]],
      minRating: [3, [Validators.min(0), Validators.max(5)]],
      priceRange: ['any', Validators.required],
      allowRisk: [false],
      userId: "" // Chaine vide car jle remplace dans le service 
    });

    // S'abonner aux changements de allowRisk
    this.preferencesForm.get('allowRisk')?.valueChanges.subscribe(value => {
      if (value) {
        this.preferencesForm.get('minRating')?.setValue(0);
      } else {
        this.preferencesForm.get('minRating')?.setValue(3);
      }
    });
  }

  ngOnInit() {
    this.loadTags();
    // Charger les préférences existantes si l'utilisateur est connecté
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadUserPreferences(userId);
    }
  }

  loadUserPreferences(userId: string) {
    this.loading = true;
    this.preferencesService.getUserPreferences(userId).subscribe({
      next: (preferences) => {
        if (preferences) {
          // Mise à jour du formulaire avec les préférences existantes
          this.preferencesForm.patchValue({
            preferredTags: preferences.preferredTags || [],
            preferredCities: preferences.preferredCities || [],
            preferredCategories: preferences.preferredCategories || [],
            minRating: preferences.minRating || 0,
            priceRange: preferences.priceRange || 'any'
          });

          // Si l'utilisateur a une note minimale de 0, on active le mode "risque"
          if (preferences.minRating === 0) {
            this.allowRisk = true;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des préférences:', error);
        // this.toastr.error('Erreur lors du chargement de vos préférences');
        this.loading = false;
      }
    });
  }

  loadTags() {
    this.tagService.getAllTags().subscribe({
      next: (response) => {
        this.availableTags = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tags:', error);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.allowRisk) {
      this.preferencesForm.patchValue({ minRating: 0 });
    }

    if (this.preferencesForm.valid) {
      this.loading = true;
      this.preferencesService.createOrUpdatePreferences(this.preferencesForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success('Préférences enregistrées avec succès !');
          this.preferencesSaved.emit();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde des préférences:', error);
          this.loading = false;
        }
      });
    }
  }

  get f() {
    return this.preferencesForm.controls;
  }

  onToggle(controlName: 'preferredTags' | 'preferredCategories' | 'preferredCities', value: string, event: Event) {
    const values = [...this.preferencesForm.get(controlName)?.value];
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!values.includes(value)) values.push(value);
    } else {
      const index = values.indexOf(value);
      if (index >= 0) values.splice(index, 1);
    }

    this.preferencesForm.get(controlName)?.setValue(values);
  }
}
