import { Component, OnInit } from '@angular/core';
import { TagPlace, TagService } from '../../../services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {
  tags: TagPlace[] = [];
  newTag: string = '';
  editTagId: string | null = null;
  editTagLibelle: string = '';

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.loadTags();
  }
  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (response) => {
        console.log('Tags récupérés :', response);
        this.tags = response.data; // Assignez uniquement la propriété `data` qui contient le tableau des tags
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tags :', err);
        this.tags = []; // Assurez-vous que `tags` est un tableau vide en cas d'erreur
      }
    });
  }
  addTag(): void {
    if (!this.newTag.trim()) return;
    const tag: TagPlace = { id: '', libelle: this.newTag };
    this.tagService.createTag(tag).subscribe(() => {
      this.newTag = '';
      this.loadTags();
    });
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