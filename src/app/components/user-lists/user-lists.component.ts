import { Component, ViewChild } from '@angular/core';
import { List, ListServices } from '../../services/list.service';
import { CreateListComponent } from '../create-list/create-list.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.css']
})
export class UserListsComponent {
  lists : List[] = [];
  @ViewChild(CreateListComponent) createListModal!: CreateListComponent;


  constructor(private listService: ListServices, 
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.listService.getUserLists().subscribe(
      (response) => {
        this.lists = response.data;
        console.log(this.lists);
      },
      (error) => {
        console.error('Error fetching lists:', error);
      }
    );
  }


  openCreateListModal() {
    this.createListModal.openModal();
  }

  handleListCreated(list: any) {
    console.log('Nouvelle liste créée :', list);
    this.lists.unshift(list); // ajoute la nouvelle liste en haut de la liste
  }

  deleteList(listId: string) {
    this.listService.deleteList(listId).subscribe(
      (response) => {
        console.log('Liste supprimée avec succès:', response);
        this.toastr.success('Liste supprimée avec succès');
        this.lists = this.lists.filter(list => list.id !== listId); // Met à jour la liste locale
      },
      (error) => {
        console.error('Erreur lors de la suppression de la liste:', error);
        let errormsg = error.error.message || 'Erreur lors de la suppression de la liste';
        this.toastr.error(errormsg);
      }
    );
  };
  
}

