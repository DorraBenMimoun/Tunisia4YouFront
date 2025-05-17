import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { PlaceService, Place } from '../../services/place.service';
import { AddToListsComponent } from '../add-to-lists/add-to-lists.component';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    isLoggedIn: boolean = false;
    isLoggedInSubscription !: Subscription;
    recommendations: Place[] = [];
    loading: boolean = false;
    error: string | null = null;
    showPreferences: boolean = false;
    
    @ViewChild(AddToListsComponent) addToListModal!: AddToListsComponent;

    constructor(
      private authService: AuthService,
      private placeService: PlaceService
    ) {}

    ngOnInit() {
      this.isLoggedInSubscription = this.authService.isLoggedInSubject.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          this.loadRecommendations();
        }
      });
    }

    loadRecommendations() {
      this.loading = true;
      this.error = null;
      this.showPreferences = false;
      
      this.placeService.getRecommandations().subscribe({
        next: (data) => {
          this.recommendations = data;
          this.loading = false;
        },
        error: (err) => {
          console.log("Message erreur : ", err.error?.message)
          if (err.error?.message == "Veuillez d'abord configurer vos préférences pour recevoir des recommandations personnalisées.") {
            this.showPreferences = true;
            this.error = null;
            console.log("Pas assez d'historique")
          } else {

            this.error = "Impossible de charger les recommandations. Veuillez réessayer plus tard.";
          }
          this.loading = false;
        }
      });
    }

    onPreferencesSaved() {
      this.showPreferences = false;
      this.loadRecommendations();
    }
  
    ngAfterViewInit(): void {
      setTimeout(() => {
        $('.slider_active').owlCarousel({
          items: 1,
          loop: true,
          autoplay: true,
          nav: true,
          dots: true,
          autoplayTimeout: 5000,
          navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
        });
      }, 0);
    }

    ngOnDestroy() {
      if (this.isLoggedInSubscription) {
        this.isLoggedInSubscription.unsubscribe();
      }
    }

    openAddToListModal(placeId: string) {
      this.addToListModal.openModal(placeId);
    }
}
