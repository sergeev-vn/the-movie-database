import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_KEY = 'a68f522de42b8bb0d191fb569f5a57ac';
  API_URL = 'https://api.themoviedb.org/3';
  POSTER_URL = 'https://image.tmdb.org/t/p/w220_and_h330_face';

  constructor() { }
}
