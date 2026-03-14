import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { AuthResponse } from './api.service';

const STORAGE_KEY = 'gh_auth';

type StoredAuth = {
  accessToken: string;
  refreshToken?: string;
  user: AuthResponse['user'];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthResponse['user'] | null>(null);
  readonly user$ = this.userSubject.asObservable();

  get user(): AuthResponse['user'] | null {
    return this.userSubject.value;
  }

  get accessToken(): string | null {
    const stored = this.read();
    return stored?.accessToken ?? null;
  }

  restore(): void {
    const stored = this.read();
    this.userSubject.next(stored?.user ?? null);
  }

  setAuth(response: AuthResponse): void {
    const stored: StoredAuth = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.user
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    this.userSubject.next(response.user);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(null);
  }

  private read(): StoredAuth | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredAuth;
    } catch {
      return null;
    }
  }
}

