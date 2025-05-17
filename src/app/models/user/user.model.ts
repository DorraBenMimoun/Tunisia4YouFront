// src/app/models/user.model.ts

export interface User {
    id: string;
    username: string;
    email: string;
    photo?: string; // optional
    isAdmin?: boolean;
    dateFinBannissement?: string | null; // optional
    isBanni?: boolean;  
    signalements?: Signalement[]; // optionnel
}

export interface Signalement {
  commentaire: string;
  raison: string;
}