import {Component} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import {DashboardStats} from '../../../core/models/dashboard.model';
import {DashboardService} from '../../../core/services/dashboard';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard {
  stats$: Observable<DashboardStats>;

  constructor(private dashboardService: DashboardService) {
    this.stats$ = this.dashboardService.getStats();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
