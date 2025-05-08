import { Component, OnInit } from '@angular/core';
import { TagPlace, TagService } from '../../../services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {
  tags: any[] = []; // Tous les tags
  filteredTags: any[] = []; // Liste à afficher dynamiquement
  newTag: string = '';
  editTagId: string | null = null;
  editTagLibelle: string = '';
  tagExists: boolean = false;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.loadTags();
  }
  checkSimilarTags(): void {
    const input = this.newTag.trim().toLowerCase();
    this.tagExists = this.tags.some(tag => tag.libelle.toLowerCase() === input);
  }
  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (response) => {
        console.log('Tags récupérés :', response);

        this.tags = response.data; // Assignez uniquement la propriété `data` qui contient le tableau des tags
        this.filteredTags = response.data; // Affiche tout au début

      },
      error: (err) => {
        console.error('Erreur lors du chargement des tags :', err);
        this.tags = []; // Assurez-vous que `tags` est un tableau vide en cas d'erreur
      }
    });
  }

  filterTags(): void {
    console.log('Filtrage des tags avec :', this.newTag);
    const input = this.newTag.trim().toLowerCase();
  
    this.filteredTags = this.tags.filter(tag =>
      tag.libelle.toLowerCase().includes(input)
    );
  
    this.tagExists = this.tags.some(tag =>
      tag.libelle.toLowerCase() === input
    );
  }

  addTag(): void {
    const trimmed = this.newTag.trim();
    if (!this.tagExists && trimmed) {
      const newTagObj =  { id: '', libelle: this.newTag };
      this.tagService.createTag(newTagObj).subscribe(created => {
        this.tags.push(created);
        this.filteredTags = this.tags;
        this.newTag = '';
        this.tagExists = false;
      });
    }
  }

  editTag(tag: TagPlace): void {
    this.editTagId = tag.id;
    this.editTagLibelle = tag.libelle;
  }
  updateTag(): void {
    if (!this.editTagId || !this.editTagLibelle.trim()) return;
    const updatedTag: TagPlace = { id: this.editTagId, libelle: this.editTagLibelle };
    this.tagService.updateTag(this.editTagId, updatedTag).subscribe(() => {
      this.editTagId = null;
      this.editTagLibelle = '';
      this.loadTags();
    });
  }

  deleteTag(id: string): void {
    this.tagService.deleteTag(id).subscribe(() => {
      this.loadTags();
    });
  }
}