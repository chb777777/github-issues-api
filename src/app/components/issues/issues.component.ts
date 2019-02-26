import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GithubSearchRequestModel } from 'src/app/models/github-search-request.model';
import { GithubSearchResponseModel } from 'src/app/models/github-search-response.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubSearchService } from 'src/app/services/github-search.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { GithubIssueModel } from 'src/app/models/github-issue.model';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class IssuesComponent implements OnInit {
  form: FormGroup;
  issues: GithubIssueModel[] = [];
  totalCount = 0;
  loading$ = new BehaviorSubject<boolean>(false);
  page = 1;
  constructor(
    private fb: FormBuilder,
    private githubSearchService: GithubSearchService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      searchValue: ['']
    });

    this.load();
  }

  get searchValue() { return this.form.get('searchValue'); }

  search() {
    this.page = 1;
    this.load(true);
  }

  load(fromSearch = false) {
    this.loading$.next(true);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const model = <GithubSearchRequestModel>{
      q: this.searchValue.value,
      page: this.page,
      repo: 'angular/angular',
      updated: oneWeekAgo
    };

    this.githubSearchService.getListOfIssues(model)
      .subscribe(s => {
        this.totalCount = s.total_count;
        if (fromSearch) {
          this.issues = s.items;
        } else {
          this.issues = this.issues.concat(s.items);
        }
        this.loading$.next(false);
      });
  }

  loadMore() {
    this.page++;
    this.load();
  }
}
