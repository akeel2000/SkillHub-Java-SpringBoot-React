import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Core pages
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategorySelect from "./pages/CategorySelect";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AddStory from "./pages/AddStory";
import PublicProfile from "./pages/PublicProfile";
import AccountSettings from "./pages/AccountSettings";

// Access control components
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Learning Plan Management pages
import LearningPlans from "./pages/LearningPlans";
import CreatePlan from "./pages/CreatePlan";
import EditPlan from "./pages/EditPlan";
import PlanProgress from "./pages/PlanProgress";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Entry Points */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />

        {/* Category Selection */}
        <Route path="/categories" element={<CategorySelect />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/add-story" element={<ProtectedRoute><AddStory /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/public-profile/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />

        {/* Learning Plan Management */}
        <Route path="/learning-plans" element={<ProtectedRoute><LearningPlans /></ProtectedRoute>} />
        <Route path="/create-plan" element={<ProtectedRoute><CreatePlan /></ProtectedRoute>} />
        <Route path="/edit-plan/:id" element={<ProtectedRoute><EditPlan /></ProtectedRoute>} />
        <Route path="/plan-progress/:id" element={<ProtectedRoute><PlanProgress /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
