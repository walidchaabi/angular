import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  servers$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/server/list`)
      .pipe(catchError(this.handleError))
  );
  save$ = (server: Server) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.apiUrl}/server/save`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  ping$ = (ipAdrress: string) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAdrress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((suscriber) => {
      const servers= response.data.server as any;

      console.log('response', response);
      const _ =
        status == 'ALL'
          ? { ...response, message: `Servers filtered by ${status} status` }
          : {
              ...response,
              message:
                servers?.filter((server) => server.status === status).length > 0
                  ? `Servers filtered by ${
                      status === 'SERVER_UP' ? 'SERVER_UP' : 'SERVER_DOWN'
                    } status`
                  : `No server of ${status} found`,
              data: {
                server: servers?.filter((server) => server.status === status),
              },
            };

            console.log('messages ok', _);

      suscriber.next(_);
      suscriber.complete();
    }).pipe(catchError(this.handleError));

  delete$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - error code :${error.status}`);
  }
}
