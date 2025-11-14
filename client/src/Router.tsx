import { usePage } from "./hooks/useNavigate";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

export default function Router() {
  const page = usePage();

  switch (page) {
    case "landing":
      return <LandingPage />;
    case "login":
      return <LoginPage />;
    case "signup":
      return <SignupPage />;
    case "home":
      return <HomePage />;
    case "profile":
      return <ProfilePage />;
    default:
      return <LandingPage />;
  }
}
