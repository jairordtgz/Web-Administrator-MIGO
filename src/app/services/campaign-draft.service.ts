import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CampaignDraftService {
  private draft: any = null;

  saveDraft(data: any) {
    this.draft = data;
  }

  getDraft(): any {
    return this.draft;
  }

  clearDraft() {
    this.draft = null;
  }

  hasDraft(): boolean {
    return this.draft !== null;
  }
}
