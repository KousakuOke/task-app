import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./router/PrivateRoute";
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;