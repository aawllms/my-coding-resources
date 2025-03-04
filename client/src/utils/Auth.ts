// import { type JwtPayload, jwtDecode } from "jwt-decode";

// // Extending the JwtPayload interface to include additional data fields specific to the application.
// interface ExtendedJwt extends JwtPayload {
//   data: {
//     username: string;
//     email: string;
//     id: string;
//   };
// }

// class AuthService {
//   isAuthenticated() {
//     throw new Error("Method not implemented.");
//   }
//   // This method decodes the JWT token to get the user's profile information.
//   getProfile() {
//     // jwtDecode is used to decode the JWT token and return its payload.
//     return jwtDecode<ExtendedJwt>(this.getToken());
//   }

//   // This method checks if the user is logged in by verifying the presence and validity of the token.
//   loggedIn() {
//     const token = this.getToken();
//     // Returns true if the token exists and is not expired.
//     return !!token && !this.isTokenExpired(token);
//   }

//   // This method checks if the provided token is expired.
//   isTokenExpired(token: string) {
//     try {
//       // jwtDecode decodes the token to check its expiration date.
//       const decoded = jwtDecode<JwtPayload>(token);

//       // Returns true if the token has expired, false otherwise.
//       if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
//         return true;
//       }
//     } catch (err) {
//       // If decoding fails, assume the token is not expired.
//       return false;
//     }
//   }

//   // This method retrieves the token from localStorage.
//   getToken(): string {
//     const loggedUser = localStorage.getItem("id_token") || "";
//     // Returns the token stored in localStorage.
//     return loggedUser;
//   }

//   // This method logs in the user by storing the token in localStorage and redirecting to the home page.
//   login(idToken: string) {
//     localStorage.setItem("id_token", idToken);
//     window.location.assign("/");
//   }

//   // This method logs out the user by removing the token from localStorage and redirecting to the home page.
//   logout() {
//     localStorage.removeItem("id_token");
//     window.location.assign("/");
//   }
// }

// export default new AuthService();

import { useEffect, useState } from "react";
import { type JwtPayload, jwtDecode } from "jwt-decode";

/** Extend JwtPayload to include user data if needed */
interface ExtendedJwt extends JwtPayload {
  data: {
    username: string;
    email: string;
    id: string;
  };
}

/** This class handles raw JWT logic (token store, decode, etc.) */
class AuthService {
  // Decodes the JWT token to get the user's profile information.
  getProfile() {
    return jwtDecode<ExtendedJwt>(this.getToken());
  }

  // Checks if the user is logged in (token present & not expired).
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Checks if the token is expired based on its 'exp' property.
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Return true if the current time is past the token’s exp time.
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }

  // Retrieves the token from localStorage.
  getToken(): string {
    return localStorage.getItem("id_token") || "";
  }

  // Logs in the user by storing the token and reloading the page.
  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  // Logs out the user by removing the token and forcing reload.
  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

// Export a **single** instance of AuthService
const authService = new AuthService();
export default authService;

/**
 * React Hook that returns a reactive view of authentication state.
 * (You can expand this hook with more features as needed.)
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.loggedIn()
  );

  useEffect(() => {
    // Whenever the component mounts, verify login status
    setIsAuthenticated(authService.loggedIn());

    // Optional: Listen for localStorage changes to handle logins/logouts from other browser tabs
    const handleStorageChange = () => {
      setIsAuthenticated(authService.loggedIn());
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Return whatever auth info or actions you want
  return {
    isAuthenticated,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    getToken: authService.getToken.bind(authService),
  };
}
