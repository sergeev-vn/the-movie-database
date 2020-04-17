import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PopularMoviesComponent} from "./popular-movies/popular-movies.component";
import {DetailsMovieComponent} from "./details-movie/details-movie.component";

const routes: Routes = [
    { path: '', redirectTo: 'page', pathMatch: 'full' },
    {
        path: '',
        component: PopularMoviesComponent
    },
    {
        path: 'details/:id',
        component: DetailsMovieComponent
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}
