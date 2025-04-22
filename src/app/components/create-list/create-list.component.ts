import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List, ListServices } from '../../services/list.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css']
})
export class CreateListComponent {
  @Output() listCreated = new EventEmitter<any>();
  listForm: FormGroup;
  showModal = false;

  constructor(private fb: FormBuilder, private listService: ListServices,     private toastr: ToastrService
  ) {
    this.listForm = this.fb.group({
      nom: ['Mes lieux preferés', Validators.required],
      description: ['Jadore tous les lieux ici'],
      isPrivate : [false],
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitForm() {
    if (this.listForm.valid) {
      const now = new Date();
      const newList  : List = {
        id: Date.now().toString(),
        nom: this.listForm.value.nom,
        description: this.listForm.value.description,
        createdAt: now,
        updatedAt: now,
        isPrivate: this.listForm.value.isPrivate,
      };

      this.listService.createList(newList).subscribe(
        response => {
          console.log('List created successfully:', response);
          this.listCreated.emit(newList); // Emit the new list to the parent component
          this.listForm.reset(); // Reset the form after submission
          this.closeModal(); // Close the modal after creation
          this.toastr.success('Liste créée avec succès !');
        },
        error => {
          console.error('Error creating list:', error);
          const errorMsg = error.error?.message || 'Erreur inconnue.';
          this.toastr.error(errorMsg, 'Erreur');        }
      );

     
    }
  }

  togglePrivacy() {
    const current = this.listForm.get('isPrivate')?.value;
    this.listForm.get('isPrivate')?.setValue(!current);
  }
  
}

