import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GithubSearchRequestModel } from '../models/github-search-request.model';
import { environment } from 'src/environments/environment';
import { GithubSearchResponseModel } from '../models/github-search-response.model';

@Injectable({
    providedIn: 'root'
})
export class GithubSearchService {
    constructor(
        private http: HttpClient
    ) { }

    getListOfIssues(model: GithubSearchRequestModel) {
        const url = environment.apiDomain + '/search/issues?' + this.getQuery(model);
        const headers = new HttpHeaders({
            'Accept': 'application/vnd.github.VERSION.html+json'
        });
        return this.http.get<GithubSearchResponseModel>(url, {
            headers: headers
        });
    }

    private getQuery(model: GithubSearchRequestModel): string {
        return `page=${model.page || 1}&q=${model.q}+repo:${model.repo}+updated:>${this.getDate(model.updated)}`;
    }

    private getDate(d: Date) {
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return [year, month, day].join('-');
    }
}
