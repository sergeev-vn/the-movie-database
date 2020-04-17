import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../api.service";
import {log} from "util";

export interface DetailedInfo {
  budget: number;
  homepage: string;
  original_title: string;
  overview: string;
  release_date: string;
  status: string;
  tagline: string;
  poster_path: string;
  title: string;
  original_language: string;
  production_countries: Array<object>;
  vote_average: number;
}

@Component({
  selector: 'app-details-movie',
  templateUrl: './details-movie.component.html',
  styleUrls: ['./details-movie.component.scss']
})
export class DetailsMovieComponent implements OnInit {

  idMovie: string;
  detailsMovie: DetailedInfo;
  recommendedMovies: any = [];


  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private apiService:ApiService
  ) {
    this.route.params.subscribe(params => {
      this.idMovie = params['id'];
      this.ngOnInit()
    });
  }

  goToMovieDetails(movie) {
    this.router.navigate(['/details', movie.id])
  }

  ngOnInit() {

    this.http.get<DetailedInfo>(this.apiService.API_URL + `/movie/${this.idMovie}` + `?api_key=${this.apiService.API_KEY}&language=en-US`)
        .subscribe(response => {
          this.detailsMovie = response
        })

    this.http.get(this.apiService.API_URL + `/movie/${this.idMovie}/recommendations` + `?api_key=${this.apiService.API_KEY}&language=en-US`)
        .subscribe(response => {
          // @ts-ignore
          this.recommendedMovies = response.results;

          if (this.recommendedMovies.length > 10) {
            this.recommendedMovies.length = 10;
          }
        })

}
}
