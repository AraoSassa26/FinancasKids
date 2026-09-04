
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/child/Dashboard";
import Lessons from "./pages/child/Lessons";
import Lesson from "./pages/child/Lesson";
import Game from "./pages/child/Game";
import Rewards from "./pages/child/Rewards";
import Profile from "./pages/child/Profile";
import Settings from "./pages/child/Settings";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

         <Route
          path="/institution/dashboard"
          element={<InstitutionDashboard />}
        />

        <Route
          path="/child/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/child/lessons"
          element={<Lessons />}
        />

        <Route
          path="/child/lesson/:id"
          element={<Lesson />}
        />

        <Route
  path="/child/game/:id"
  element={<Game />}
/>

        <Route
          path="/child/rewards"
          element={<Rewards />}
        />

        <Route
          path="/child/profile"
          element={<Profile />}
        />

        <Route
          path="/child/settings"
          element={<Settings />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>

      
    </BrowserRouter>
  );
}

export default App;

