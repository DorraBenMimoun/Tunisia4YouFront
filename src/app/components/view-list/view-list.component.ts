import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List, ListServices } from '../../services/list.service';
import { AddToListsComponent } from '../add-to-lists/add-to-lists.component';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.css'
})
export class ViewListComponent {

    list!: List;
    id = "";
    places: any[] = [];

      @ViewChild(AddToListsComponent) addToListModal!: AddToListsComponent;
    
  
    constructor(private route: ActivatedRoute,
      private listService: ListServices,
    ) {
    }

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id') ?? '';
        if (this.id) {
          this.loadList();
        }
      });
    }
    

    loadList(): void {
      this.listService.getListById(this.id).subscribe({
        next: (res) => {
          this.list = res;
          console.log(res);
          this.loadPlaces();

        },
        error: (err) => {
          console.error('Erreur de chargement de la liste', err);
        }
      });
  }

  loadPlaces (): void {
    this.listService.getPlacesInList(this.id).subscribe({
      next: (res) => {
        this.places = res;
        console.log(res);
      },
      error: (err) => {
        console.error('Erreur de chargement des lieux', err);
      }
    });
  }

  removePlaceFromList(placeId: string): void {
    console.log('Removing place with ID:', placeId);
     this.loadPlaces();
  };

  openAddToListModal(placeId : string) {
    this.addToListModal.openModal(placeId);
  }


}
