import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userStats: any;
  placeStats: any;
  reviewStats: any;
  listStats: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getUserStats();
    this.getPlaceStats();
    this.getReviewStats();
    this.getListStats();
  }

  getUserStats() {
    this.dashboardService.getUserStats().subscribe(
      (res: any) => this.userStats = res,
      err => console.error('Error fetching user stats:', err)
    );
  }

  getPlaceStats() {
    this.dashboardService.getPlaceStats().subscribe(
      (res: any) => this.placeStats = res,
      err => console.error('Error fetching place stats:', err)
    );
  }

  getReviewStats() {
    this.dashboardService.getReviewStats().subscribe(
      (res: any) => this.reviewStats = res,
      err => console.error('Error fetching review stats:', err)
    );
  }

  getListStats() {
    this.dashboardService.getListStats().subscribe(
      (res: any) => this.listStats = res,
      err => console.error('Error fetching list stats:', err)
    );
  }
}
