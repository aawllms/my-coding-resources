

  getProfile() {
    return jwtDecode<ExtendedJwt>(this.getToken());
  }


  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }


  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

main
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }


  getToken(): string {
    return localStorage.getItem("id_token") || "";
  }


  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }


  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.loggedIn()
  );

  useEffect(() => {

    const handleStorageChange = () => {
      setIsAuthenticated(authService.loggedIn());
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  return {
    isAuthenticated,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    getToken: authService.getToken.bind(authService),
  };
}
