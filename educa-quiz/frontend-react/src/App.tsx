import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quizzes from "./pages/Quizzes";
import QuizPlay from "./pages/QuizPlay";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("user");

  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <PrivateRoute>
              <Quizzes />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute>
              <QuizPlay />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}