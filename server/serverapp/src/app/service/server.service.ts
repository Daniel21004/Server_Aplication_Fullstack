import { HttpClient, HttpErrorResponse } from '@angular/common/http'; //* Necessary imports
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';  //* Necessary imports
import { catchError, tap } from 'rxjs/operators'; //* Necessary imports
import { CustomResponse } from '../interfaces/custom-response';
import { Server } from '../interfaces/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiURL = "http://localhost:8080"; 

  constructor(private http: HttpClient) { } 

  

  //! This is way to make a valid get request, but is a old way of doing it 
  // getServers() : Observable<CustomResponse>{
  //   return this.http.get<CustomResponse>("http://localhost:8080/server/list");
  // }

  //* One most modern way to make a get request
  servers$ = <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiURL}/server/list`)
    .pipe( //* Method for manipulate the Observable's content before the data passes through it
      tap(console.log), //* You can inspect the data without modifying it
      catchError(this.handleError) //* Method used to catch errors
    )

  save$ = (server: Server) => {
    return <Observable<CustomResponse>>this.http.post<CustomResponse>(`${this.apiURL}/server/save`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )
  }

  ping$ = (ipAddress: string) => {
    return <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiURL}/server/ping/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )
  }

  filter$ = (status: Status, response: CustomResponse) => {
    return <Observable<CustomResponse>>new Observable<CustomResponse>(
      subscriber => { //* This method defines the behavior of the Observable, inside you can manipulate the response
        subscriber.next( //* This method sends a new value to observable
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status` } :
            {
              ...response, //* Clone of response's properties to new object
              message: response.data.servers?.filter(server => server?.status === status).length > 0 ? `Servers filtered by 
                ${status === Status.SERVER_UP ? "SERVER UP" : "SERVER DOWN"} status`
                : `No servers of ${status} found`,
              data: { servers: response.data.servers?.filter(server => server.status === status) } //* Overwrites the 'servers' property with the filtered servers
            }
        );
        subscriber.complete(); //* Indicates that the observable has finished emitting values
      }
    )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  }

  delete$ = (serverId: number) => {
    return <Observable<CustomResponse>>this.http.delete(`${this.apiURL}/server/delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(`Error: ${error}`); //* Show the error
    return throwError(() => new Error(`An error occurred - Error code: ${error.status}`)); //* Throw error
  }
}

