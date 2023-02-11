import { Component } from '@angular/core';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public loginForm!: FormGroup
  
    constructor(private formbuilder: FormBuilder,private http: HttpClient, private router: Router, private notifier: NotifierService) { }
  
    ngOnInit(): void {
      this.loginForm = this.formbuilder.group({
        email: ['', [Validators.required, Validators.email], []],
        password: ['', Validators.required]
      })
    }
    
    login(){
      this.http.post<any>("http://192.168.100.87:5000/api/login", this.loginForm.value)
        .subscribe(res=>{
          if(res) {
            localStorage.setItem('token', res.token)
            this.notifier.notify('success', 'You are Logged In');
            this.router.navigate([""])
          } else {
            alert("user not found")
          }
        },err=>{
          alert("Something went wrong")
        })
    }
}
