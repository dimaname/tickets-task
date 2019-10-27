export interface ISessionStorage {
    setItem(key: string, value: string): void;

    getItem(key: string): string | null;
}

export class SessionStorage implements ISessionStorage {
    setItem(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    getItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }
}