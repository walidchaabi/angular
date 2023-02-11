import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { catchError, startWith } from 'rxjs';
import { map } from 'rxjs';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { isLoggedIn as IsLoggedIn } from '../auth.guard';
import { DataState } from '../enum/data-state.enum';
import { Status } from '../enum/status.enum';
import { Server } from '../interface/server';
import { Router } from '@angular/router';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  appState$: Observable<any>;
  isLoggedIn = IsLoggedIn();

  readonly Datastate = DataState;
  private filterSubject = new BehaviorSubject<string>('')
  private dataSubject = new BehaviorSubject<any>(null)
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false)
  isLoading$ = this.isLoading.asObservable();
  // private readonly notifier: NotifierService;

  constructor(private serverService:ServerService,private notifier: NotifierService, private router: Router){}

  ngOnInit(): void {
    console.log("tfo")
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response=>{
        console.log('messages', response)
        this.dataSubject.next(response);
        this.notifier.notify('success', 'You are awesome! I mean it!');
        return {dataState:DataState.LOADED_STATE,appData:{...response,data:{servers: response.data.servers.reverse()}}}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE,error:error})
      })
    );
  }

  pingServer(ipAddress:string): void {
    this.filterSubject.next(ipAddress);

      this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response=>{
          const index = this.dataSubject.value.data.servers?.findIndex(server => server.id === response.data.server.id) ?? -1;
          if (index != -1) {
            console.log(this.dataSubject.value.data.servers[index]);
            this.dataSubject.value.data.servers[index] = response.data.server;
          this.filterSubject.next('');
          return {dataState:DataState.LOADED_STATE,appData:this.dataSubject.value}
          }
          return {dataState:DataState.ERROR_STATE}
        }),
        startWith({dataState:DataState.LOADED_STATE,appData:this.dataSubject.value }),
        catchError((error:string)=>{
          this.filterSubject.next('');          
          return of({dataState:DataState.ERROR_STATE,error:error})
        })
      );
  }

  filterServer(status:any): void {
    console.log(status);
    this.appState$ = this.serverService.filter$(status as Status, this.dataSubject.value)
      .pipe(
        map(response=>{
          return {dataState:DataState.LOADED_STATE,appData: response}
        }),
        startWith({dataState:DataState.LOADED_STATE,appData:this.dataSubject.value }),
        catchError((error:string)=>{      
          return of({dataState:DataState.ERROR_STATE,error:error})
        })
      );
      this.appState$.subscribe(data => {
        console.log('data', data)
      });
  }

  saveServer(serverForm:NgForm): void {
    this.isLoading.next(true);

    console.log(serverForm);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
      .pipe(
        map(response=>{
          this.dataSubject.value.data.servers.push(response.data.server);
          document.getElementById('closeModal').click()
          this.isLoading.next(false);
          serverForm.resetForm({status: 'ALL' } as {status: Status })
          return {dataState:DataState.LOADED_STATE,appData: this.dataSubject.value}
        }),
        startWith({dataState:DataState.LOADED_STATE,appData:this.dataSubject.value }),
        catchError((error:string)=>{      
          this.isLoading.next(false);
          return of({dataState:DataState.ERROR_STATE,error:error})
        })
      );

  }
  
  deleteServer(server:Server): void {
      this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response=>{
          this.dataSubject.next(
            {...response, 
            data:{
              servers:
              this.dataSubject.value.data.servers.filter(s => s.id !==server.id)}
            })
        return {dataState:DataState.LOADED_STATE,appData:this.dataSubject.value}
        }),
        startWith({dataState:DataState.LOADED_STATE,appData:this.dataSubject.value }),
        catchError((error:string)=>{
          this.filterSubject.next('');          
          return of({dataState:DataState.ERROR_STATE,error:error})
        })
      );
  }

  printeReport():void{
    //xls format
    // let dataType = 'application/vnd.ms-excel.sheet.macroEnable.12';
    // let tableSelect = document.getElementById('servers');
    // let tableHtml = tableSelect.outerHTML.replace(/ /g,'%20');
    // let downloadlink = document.createElement('a');
    // document.body.appendChild(downloadlink);
    // downloadlink.download ='server-report.xls'
    // downloadlink.href = 'data:'+dataType + ','+tableHtml;
    // downloadlink.click()
    // document.body.removeChild(downloadlink);
    // Pdf format
    window.print()
  }
  json(data) {
    return JSON.stringify(data);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}
