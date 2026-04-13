import { HttpInterceptorFn } from '@angular/common/http';

export const HeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenKey = 'kulonut:auth_token';
  const token = localStorage.getItem(tokenKey) ?? sessionStorage.getItem(tokenKey);

  const setHeaders: Record<string, string> = {};

  if (!req.headers.has('Accept')) {
    setHeaders['Accept'] = 'application/json';
  }

  if (token && !req.headers.has('Authorization')) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (Object.keys(setHeaders).length === 0) {
    return next(req);
  }

  return next(req.clone({ setHeaders }));
};
