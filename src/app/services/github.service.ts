/*
 * @Author: renxia
 * @Date: 2018-11-19 16:00:07
 * @LastEditors: gflizhiwen
 * @LastEditTime: 2018-11-22 17:40:42
 * @Description: github api (https://developer.github.com/v3/repos/)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class GithubService {
  private username: string;
  private client_id = '36be6727c9e3eda9bba1';
  private client_secret = 'e89938e1cc176e0ca06712deadda4b44237308a4';
  private baseUrl = environment.production ? 'https://api.github.com/users/' : '/users/';

  constructor(private _http: HttpClient) {
    this.username = '';
  }

  getUser() {
      return this._http.get(this.baseUrl + this.username, {
        params: {
          client_id: this.client_id,
          client_secret: this.client_secret,
        },
      });
  }

  getRepositories(params: Record<string, string | number>) {
    return this._http.get(this.baseUrl + this.username + '/repos', {
      params: {
        client_id: this.client_id,
        client_secret: this.client_secret,
        sort: 'updated',
        direction: 'desc',
        type: params.type || 'owner',
        per_page: params.pageSize,
        page: params.curPage
      },
    });
  }

  updateUser(username: string) {
     this.username = (username + '').trim();
     return this;
  }

}
