import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent implements OnInit {



  constructor() {}

  ngOnInit(): void {
  }
}
