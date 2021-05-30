import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Voter, Regions } from '../../model/voter';
@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  voter: Voter | undefined;
  regions = Regions;
  isValidVoter=true;
  carteIdRecto: File[] = [];
  carteIdVerso: File[] = [];
  voterId:string   ='';
  
  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      CIN: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required]
    });
    console.log(this.registerForm.value);
  }

  ngOnInit() {
    this.createFrom();
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // display form values on success
    console.log(this.registerForm.value);
    console.log(this.carteIdVerso);
    console.log(this.carteIdRecto);
    this.registerForm.reset();
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.carteIdRecto = [];
    this.carteIdVerso = [];
  }

  onSelectCarteIdRecto(event: any) {
    if (this.carteIdRecto.length < 1) {
      this.carteIdRecto.push(...event.addedFiles);
    }
  }

  onRemoveCarteIdRecto(event: any) {
    console.log(event);
    this.carteIdRecto.splice(this.carteIdRecto.indexOf(event), 1);
  }

  onSelectCarteIdVerso(event: any) {
    if (this.carteIdVerso.length < 1) {
      this.carteIdVerso.push(...event.addedFiles);
    }
  }

  onRemoveCarteIdVerso(event: any) {
    console.log(event);
    this.carteIdVerso.splice(this.carteIdVerso.indexOf(event), 1);
  }
  createFrom() {
    this.registerForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      CIN: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required]
    });
  }
}
