import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api.service';
import { forkJoin } from 'rxjs';


export interface PopularMovies {
    page: number;
    total_results: number;
    total_pages: number;
    results: PopularMoviesResult[];
}

export interface PopularMoviesResult {
    title: string;
    overview: string;
    poster_path: string;
    genre_ids: Array<number>;
}

@Component({
    selector: 'app-popular-movies',
    templateUrl: './popular-movies.component.html',
    styleUrls: ['./popular-movies.component.scss']
})
export class PopularMoviesComponent implements OnInit {

    searchField = '';
    popularMoviesResults = [];
    searchResults: any = [];
    searchResultsJoint = [];
    totalNumberSearchPages: number;
    popularMoviesSeparateResults: any = [];
    popularMoviesJointResults: any = [];
    totalNumberPopularMoviesPages: number;
    genresList: any = []
    currentPage = 1;
    itemsPerPage = 20;
    loading = false

    constructor(private http: HttpClient, private apiService: ApiService) {
    }

    ngOnInit(): void {
        this.loading = true
            this.http.get(this.apiService.API_URL + '/genre/movie/list' + `?api_key=${this.apiService.API_KEY}&language=en-US`)
                .subscribe(response => {

                    // @ts-ignore
                    this.genresList = response.genres;
                })

            this.http.get<PopularMovies>(this.apiService.API_URL + '/movie/popular' + `?api_key=${this.apiService.API_KEY}&language=en-US&page=1`)
                .subscribe(response => {
                    this.totalNumberPopularMoviesPages = response.total_pages;

                    for (let i = 1; i <= this.totalNumberPopularMoviesPages; ++i) {
                        this.popularMoviesSeparateResults.push(this.http.get<PopularMovies>(this.apiService.API_URL + '/movie/popular' + `?api_key=${this.apiService.API_KEY}&language=en-US&page=` + i));
                    }

                    forkJoin(this.popularMoviesSeparateResults)
                        .subscribe(response => {

                            response.forEach(el => {
                                // @ts-ignore
                                el.results.forEach(el2 => {
                                    this.popularMoviesJointResults.push(el2);
                                });

                            });

                            this.popularMoviesJointResults.forEach(el => {
                                el.translatedGenres = []
                                for (let i = 0; i < el.genre_ids.length; i++) {
                                    for (let j = 0; j < this.genresList.length; j++) {
                                        if (el.genre_ids[i] === this.genresList[j].id) {
                                            el.translatedGenres.push( this.genresList[j].name)
                                        }
                                    }
                                }

                            })
                            this.loading = false
                        })

                    this.popularMoviesResults = this.popularMoviesJointResults;


                    this.popularMoviesResults.forEach(el => {
                        el.translatedGenres = []
                        for (let i = 0; i < el.genre_ids.length; i++) {
                            for (let j = 0; j < this.genresList.length; j++) {
                                if (el.genre_ids[i] === this.genresList[j].id) {
                                    el.translatedGenres.push( this.genresList[j].name)
                                }
                            }
                        }

                    })
                })

            }

    searchMovies() {
        if ( this.searchField.length === 0 ) {
            return this.ngOnInit()
        } else if ( (this.searchField.length > 0) && (this.searchField.length < 2 )) {
            return;
        } else {
            this.searchResults = []
            this.searchResultsJoint = []

            this.http.get<PopularMovies>(this.apiService.API_URL + '/search/movie' + `?api_key=${this.apiService.API_KEY}&language=en-US&query=${this.searchField}`)
                .subscribe(response => {
                    this.totalNumberSearchPages = response.total_pages;

                    for (let i = 1; i <= this.totalNumberSearchPages; ++i) {
                        this.searchResults.push(this.http.get<PopularMovies>(this.apiService.API_URL + '/search/movie' + `?api_key=${this.apiService.API_KEY}&language=en-US&query=${this.searchField}&page=` + i));
                    }

                    forkJoin(this.searchResults)
                        .subscribe(response => {
                            response.forEach(el => {
                                // @ts-ignore
                                el.results.forEach(el2 => {
                                    this.searchResultsJoint.push(el2);
                                });
                            });

                            this.searchResultsJoint.forEach(el => {
                                el.translatedGenres = []
                                for (let i = 0; i < el.genre_ids.length; i++) {
                                    for (let j = 0; j < this.genresList.length; j++) {
                                        if (el.genre_ids[i] === this.genresList[j].id) {
                                            el.translatedGenres.push( this.genresList[j].name)
                                        }
                                    }
                                }

                            })
                        })

                    this.popularMoviesResults = this.searchResultsJoint;

                })
        }
    }

    showMovieId() {

    }
}
