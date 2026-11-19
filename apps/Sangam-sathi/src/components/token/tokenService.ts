import { jwtDecode } from "jwt-decode";

export interface CustomJwtPayload {
  promoter_id?: string;
  username?: string;
  user_role?: string;
  ref_no?: string;
  user_id?: string | number;
  first_name?: string;
  last_name?: string;
  status?: string;
  user_status?: string;
  otherInfo?: string;
  [key: string]: any;
}

class TokenService {
  static setToken(token: string) {
    localStorage.setItem("token", token);
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static decodeToken<T = CustomJwtPayload>(): T | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<T>(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  static getRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.user_role || null;
  }

  static getRegistrationNo(): string | null {
    const decoded = this.decodeToken();
    return decoded?.ref_no || null;
  }

  static getUserId(): string | number | null {
    const decoded = this.decodeToken();
    return decoded?.user_id || null;
  }

  static getUser(): CustomJwtPayload | null {
    const decoded = this.decodeToken();
    return decoded || null;
  }

  static removeToken() {
    localStorage.removeItem("token");
  }
}

export default TokenService;
