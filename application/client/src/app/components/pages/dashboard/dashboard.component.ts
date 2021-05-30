import { Component, OnInit, ViewEncapsulation } from '@angular/core';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  regions: Region[] = [
    { value: 'region-0', viewValue: 'region 1' },
    { value: 'region-1', viewValue: 'region 2' },
    { value: 'region-2', viewValue: 'region 3' }
  ];

  data: any[];
  regionData: any[];
  regionsData: any[];
  regionSelected: boolean = false;
  width: number = 700;
  height: number = 300;

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme: string = 'forest';

  constructor() {
    this.regionData = [];

    this.data = [
      {
        "name": "Justice and Development Party",
        "value": 1571659
      },
      {
        "name": "Authenticity and Modernity Party",
        "value": 1205444
      },
      {
        "name": "Istiqlal Party",
        "value": 621280
      },
      {
        "name": "National Rally of Independents",
        "value": 558875
      }
    ];

    this.regionsData = [
      {
        "region": "region-0",
        "data": [
          {
            "name": "Justice and Development Party R1",
            "value": 1571622
          },
          {
            "name": "Authenticity and Modernity Party R1",
            "value": 120577
          },
          {
            "name": "Istiqlal Party R1",
            "value": 621244
          },
          {
            "name": "National Rally of Independents R1",
            "value": 55881
          }
        ]
      },
      {
        "region": "region-1",
        "data": [
          {
            "name": "Justice and Development Party R2",
            "value": 1571
          },
          {
            "name": "Authenticity and Modernity Party R2",
            "value": 1205
          },
          {
            "name": "Istiqlal Party R2",
            "value": 6212
          },
          {
            "name": "National Rally of Independents R2",
            "value": 5588
          }
        ]
      },
      {
        "region": "region-2",
        "data": [
          {
            "name": "Justice and Development Party R3",
            "value": 157165
          },
          {
            "name": "Authenticity and Modernity Party R3",
            "value": 120544
          },
          {
            "name": "Istiqlal Party R3",
            "value": 62128
          },
          {
            "name": "National Rally of Independents R3",
            "value": 55887
          }
        ]
      },
    ];
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onChange(selectedItem: any): void {
    let myData;
    this.regionSelected = true;
    this.regionsData.forEach(function (element) {
      if (element.region == selectedItem.value) {
        myData = element.data;
      }
    });
    if (myData != undefined) { this.regionData = myData; }

    console.log(selectedItem.value);
    console.log(myData);
  }
}
