import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { List, ListServices } from '../../services/list.service';
import { ToastrService } from 'ngx-toastr';
import { CreateListComponent } from '../create-list/create-list.component';

@Component({
  selector: 'app-add-to-lists',
  templateUrl: './add-to-lists.component.html',
  styleUrl: './add-to-lists.component.css'
})
export class AddToListsComponent {
  @ViewChild('createListModal') createListComponent!: CreateListComponent;

  @Output() placeRemoved = new EventEmitter<string>();

  lists: List[] = [];

  showModal = false;
  placeId: string = '';

  selectedLists: string[] = [];
  initialSelectedLists: string[] = [];

  constructor(
    private listService: ListServices,
    private toastr: ToastrService
  ) {}

  ngOnInit() {

    // Get user lists
    this.listService.getUserLists().subscribe(
      (response) => {
        this.lists = response.data;
      },
      (error) => {
        console.error('Error fetching lists:', error);
      }
    );

  }

  fetchListsContainingPlace() {
    // Get lists containing the place
    this.listService.getListContainingPlace(this.placeId).subscribe(
      (response) => {
        console.log('Ids of the lists containing the place:', response.data);
  
        this.initialSelectedLists = [...response.data];  
        this.selectedLists = [...response.data];         
      },
      (error) => {
        console.error('Error fetching lists containing the place:', error);
      }
    );
  }
  

  openModal(placeId: string) {
    this.showModal = true;
    this.placeId = placeId;

    this.selectedLists = []; // Reset selected lists
    this.initialSelectedLists = []; // Reset initial selected lists

    
    // Get lists containing the place
    this.fetchListsContainingPlace();
  }

  closeModal() {
    this.showModal = false;
  }

  toggleSelection(listId: string) {
    const index = this.selectedLists.indexOf(listId);
    if (index > -1) {
      this.selectedLists.splice(index, 1);
    } else {
      this.selectedLists.push(listId);
    }
  }

  onSubmit() {

    const toAdd = this.selectedLists.filter(id => !this.initialSelectedLists.includes(id));
    const toRemove = this.initialSelectedLists.filter(id => !this.selectedLists.includes(id));

    const addRequests = toAdd.map(id => this.listService.addPlaceToList(id, this.placeId));
    const removeRequests = toRemove.map(id => this.listService.removePlaceFromList(id, this.placeId));
    const allRequests = [...addRequests, ...removeRequests];

    if (allRequests.length === 0) {
      this.toastr.info('Aucune modification à enregistrer.');
      this.closeModal();
      return;
    }

    Promise.all(allRequests.map(req => req.toPromise()))
      .then(() => {
        this.toastr.success('Modifications enregistrées.');
        if(toRemove.length > 0) {
          for (const id of toRemove) {
            this.placeRemoved.emit(id); // Emit the event for each removed place
          }
        }
        this.closeModal();
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
        this.toastr.error('Erreur lors de l\'enregistrement des modifications.');
      });
  }

  onListCreated(newList: any) {
    this.lists.push(newList); // Ajoute la liste à ton tableau
    this.selectedLists.push(newList.id); // Sélectionne la nouvelle liste directement
    this.toastr.success('Nouvelle liste ajoutée et sélectionnée.');
  }
  

}
