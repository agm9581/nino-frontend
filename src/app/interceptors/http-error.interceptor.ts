import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function httpErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 400) {
        // Extract error message from response body if available
        const errorMessage = error.error?.response?.message || error.error?.message || error.message;
        console.error('HTTP Error:', error.status, errorMessage);
        // You can add more logic here, e.g., logging or showing a user notification
      }
      return throwError(() => error); // Re-throw the error to keep propagation
    })
  );
}
