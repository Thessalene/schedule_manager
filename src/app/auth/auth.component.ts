import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthentificationService } from '../core/services/auth.service';
import { Authentification } from '../core/models/auth.schema';
import { DatePipe } from '@angular/common';
import { FORMAT_yyyy_MM_dd } from '../core/constants';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  //Form
  authForm: FormGroup;
  showError: boolean;
  masterAddIdentifiant: boolean;

  constructor(private authService: AuthentificationService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initForm();
    this.createIdentifiant()
    this.getAllAUth()
  }

  addAuthentification(identifiant: string, isMaster: boolean, id : number) {
    var newAuth = new Authentification()
    newAuth.id = id
    newAuth.identifiant = identifiant
    newAuth.isMaster = isMaster
    newAuth.creationDate = this.datePipe.transform(new Date(), FORMAT_yyyy_MM_dd)

    this.addIdentifiant(newAuth)
  }

  changeMode(){
    this.masterAddIdentifiant = true
  }

  createIdentifiant(){
    // If there is no identifiant in DB 
    this.addAuthentification("admin972", true, 1)
    this.addAuthentification("normal972", false, 2)
  }

  checkAsMaster() {
    console.log("[INFO] Check master user")
    var auth = this.checkAuth()

    if (auth == undefined) {
      this.showError = true
    } else {
      if (auth.isMaster) {
        this.showError = false
        this.displayAddIdentifiantForm()
      } else {
        this.showError = true
      }
    }

  }
  showAuthError() {
    // TODO
    throw new Error('Method not implemented.');
  }

  getAllAUth() {
    this.authService.getAllAuth().subscribe((authRetrieved) => {
      console.log("[INFO] All authentifications in database : ", authRetrieved)
    });
  }

  checkAuth(): Authentification {
    var authRetrieve: Authentification
    this.authService.getAuthByIdentifiant(this.authForm.get('identifiant').value).subscribe((authRetrieved) => {
      authRetrieve = authRetrieved
    });
    return authRetrieve
  }

  //Forms
  initForm() {
    this.authForm = new FormGroup({
      id: new FormControl(),
      identifiant: new FormControl(null, Validators.required)
    })
  }

  displayAddIdentifiantForm() {
    console.log("[INFO] Is a master password")
    this.authForm.reset()
    this.masterAddIdentifiant = true
  }

  goToHomePage() {
    this.router.navigateByUrl('/bottom-nav/home');
  }

  onSubmit() {
    console.log("[INFO] Adding identifiant " + this.authForm.get('identifiant').value + " ...");

    if(this.masterAddIdentifiant){
      if(this.authForm.get('identifiant').value != ""){
        this.addAuthentification(this.authForm.get('identifiant').value, false, null)
        this.displaySuccessAlert("Le nouvel identifiant a bien été créé.")
        this.masterAddIdentifiant = false
        this.showError = false
        this.authForm.reset()
      }else {
        this.showError = true
      }
    } else {
      console.log(this.authForm);
      var auth = this.checkAuth()
      console.log("[INFO] Authentification retrieved : ", JSON.stringify(auth))
  
      if (auth === undefined) {
        console.log("[ERROR] Authentification is undefined.")
        this.showError = true
      } else {
        this.showError = false
        this.goToHomePage()
      }
    } 
  }

  resetAuthentification(){
    this.masterAddIdentifiant = false
    this.authForm.reset()
  }

  displaySuccessAlert(message) {
    Swal.fire('Ajout d\'un nouvel identifiant', message, 'success')
  }

  addIdentifiant(authToAdd: Authentification) {
    this.authService.addAuthentification(authToAdd).subscribe(
      (auth) => {
        console.log("[INFO] Authentification added : ", JSON.stringify(auth))
      },
      (error) => this.displayErrorAlert(error)
    );
  }


  displayErrorAlert(error) {
    console.log("[ERROR]", error)
    Swal.fire({
      icon: 'error',
      title: 'Echec de l\'ajout d\'identifiant',
      text: 'Quelque chose s\'est mal passé!',
      footer: '<a href>Contacter le service</a>'
    })
  }
}
