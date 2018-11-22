import { Component, OnInit } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  user: any;
  repos: any[];
  username = 'lzwme';
  isLoading = false;
  timeout = 10000;
  userList = [
    'lzwme', 'renxia', 'fex-team',
    'vuejs', 'angular', 'reactjs',
    'facebook', 'microsoft', 'google',
    'tencent', 'alibaba', 'baidu'
  ];

  get pageList() {
    const page = [];

    if (!this.user) {
      return page;
    }

    const totalPage = Math.ceil(this.user.public_repos / this.pager.pageSize);

    for (let i = 0; i < totalPage; i++) {
      page.push(i);
    }

    return page;
  }

  pager = {
    curPage: 0,
    pageSize: 50,
  };

  tipTimer;
  tipType;
  msgTip = '';

  constructor(private _githubService: GithubService) {
    this.user = false;
    this.searchUser();
    window['profileComp'] = this;
  }

  searchUserTimer;
  searchUser() {
    if (this.isLoading) {
      return;
    }

    const username = this.username;

    clearTimeout(this.searchUserTimer);
    this.searchUserTimer = setTimeout(() => {
      this._githubService
        .updateUser(this.username)
        .getUser()
        .subscribe(user => {
          this.user = user;
        }, error => {
          console.log(error);
          this.showTips(`[getUser][${username}][${error.status}] ` + error.statusText, 'danger');
        });

        this.getReoByPage(1);
    }, 300);
  }

  setUserName(name) {
    this.username = name;
    this.searchUser();
  }

  getReoByPage(page) {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.pager.curPage = page;

    // 最长多少 s 取消 loading
    setTimeout(() => this.isLoading = false, this.timeout);

    const username = this.username;
    this._githubService.getRepositories(this.pager)
    .subscribe(repos => {
      this.isLoading = false;
      this.repos = <any[]>repos;
      this.showTips('done!');
    }, error => {
      console.log(error);
      this.isLoading = false;
      this.showTips(`[getRepositories][${username}][${error.status}] ` + error.statusText, 'danger');
    });
  }

  showTips(err, type: 'success' | 'warning' | 'danger' | 'info' = 'success') {
    this.msgTip = err || '';
    this.tipType = type;

    clearTimeout(this.tipTimer);
    this.tipTimer = setTimeout(() => this.msgTip = '', 4500);
  }

  ngOnInit() {}
}
