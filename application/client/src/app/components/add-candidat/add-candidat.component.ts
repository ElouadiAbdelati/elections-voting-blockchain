import { Regions } from './../../model/voter';
import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/model/candidate';

@Component({
  selector: 'app-add-candidat',
  templateUrl: './add-candidat.component.html',
  styleUrls: ['./add-candidat.component.css']
})
export class AddCandidatComponent implements OnInit {

  regions = Regions;
  constructor() { }

  ngOnInit(): void {
  }
  submitForm(f: any) {
    const candidat: Candidate = f.value;
    console.log(candidat);
  }
  log(email: any) {
    console.log(email)
  }
}
