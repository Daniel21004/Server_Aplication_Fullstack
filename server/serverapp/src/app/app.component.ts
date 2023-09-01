import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interfaces/appState';
import { CustomResponse } from './interfaces/custom-response';
import { Server } from './interfaces/server';
import { NotificationService } from './service/notification.service';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  //? The variables of type 'BehaviorSubject', I think, Can save values of type 'Observable' for use elsewhere?
  private filterSubject = new BehaviorSubject<string>(''); //* It need an initial value and allow to get the current value
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private server: ServerService, private notifier: NotificationService) { }

  ngOnInit(): void {
    this.appState$ = this.server.servers$
      .pipe(
        map(response => { //* The AppState is filled with the rest of the data
          this.notifier.onDefault(response.message);
          this.dataSubject.next(response) //* Save the response in dataSubject for use it in pingServer
          return {
            dataState: DataState.LOADED,
            appData: { ...response, data: { servers: response.data.servers.reverse() } }
          }
        }),
        startWith({ dataState: DataState.LOADING }),  //* The AppState start with a 'Loading value'
        catchError((error: string) => { //* Because0 the error thrown by the service is a string
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR, error }) //* We cannot return an object with brackects, we must return the object using the 'off' alias
        })
      );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.server.ping$(ipAddress)
      .pipe(
        map(response => {
          const index = this.dataSubject.value.data.servers.findIndex(server => server.ipAddress === ipAddress);
          // const index = this.dataSubject.getValue().data.servers.findIndex(server => server.id === response.data.server.id);

          this.dataSubject.value.data.servers[index] = response.data.server;  //* Here we get the index of the server with the same ipAddress that we pass as parameter
          this.notifier.onDefault(response.message);
          this.filterSubject.next(''); //* For active the load spinner 
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),  //* The AppState start with a 'Loaded value' and 'response' because the initial values were loaded in OnInit already
        catchError((error: string) => {
          this.filterSubject.next(''); //* For active the load spinner
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR, error })
        })
      );
  }

  filterServers(status: Status): void {
    this.appState$ = this.server.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          // this.dataSubject.next(response);
          this.notifier.onDefault(response.message);
          return {
            dataState: DataState.LOADED,
            // appData: this.dataSubject.getValue()
            appData: response
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),  //* The AppState start with a 'Loaded value' and 'response' because the initial values were loaded in OnInit already
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR, error })
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.server.save$(serverForm.value as Server)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {
              ...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] } //* Here, just add the new server as index 0, and the others server don't change 
            }
          );
          document.getElementById('closeModal').click(); //* Closed the modal
          this.isLoading.next(false);
          serverForm.resetForm({ status: this.Status.SERVER_DOWN }) //* Reset the form with the parameter status as Server Down value
          this.notifier.onDefault(response.message);
          return {
            dataState: DataState.LOADED,
            appData: response
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),  //* The AppState start with a 'Loaded value' and 'response' because the initial values were loaded in OnInit already
        catchError((error: string) => {
          this.isLoading.next(false);
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR, error })
        })
      );
  }

  deleteServer(server: Server): void {
    this.isLoading.next(true);
    this.appState$ = this.server.delete$(server.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {
              ...response, data: { servers: this.dataSubject.value.data.servers.filter(s => s.id != server.id) } //* Here, just add the new server as index 0, and the others server don't change 
            }
          );
          this.notifier.onDefault(response.message);
          return {
            dataState: DataState.LOADED,
            appData: response
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),  //* The AppState start with a 'Loaded value' and 'response' because the initial values were loaded in OnInit already
        catchError((error: string) => {
          this.isLoading.next(false);
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR, error })
        })
      );
  }

  printReport(): void {
    this.notifier.onDefault("Report downloaded")
    // window.print(); //* If you want to use the below way, then comment this line
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12'; //* Render the table
    let tableSelect = document.getElementById("servers"); //* Retrieved the table of servers
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20'); //* Delete the spaces
    let downloadLink = document.createElement('a'); //* Create a link element
    document.body.appendChild(downloadLink); //* Insert the link element in the body
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml; //* Construct the link
    downloadLink.download = 'server-report.xls'; //* File's name
    downloadLink.click(); //* Auto-click
    document.body.removeChild(downloadLink); //* Delete the link element of the body
  }
}
