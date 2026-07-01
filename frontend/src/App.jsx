import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import AdminEmployees from './pages/admin/Employees';
import AdminSettings from './pages/admin/Settings';
import AdminBilling from './pages/admin/Billing';
import AdminAnalytics from './pages/admin/Analytics';
import SystemLogs from './pages/admin/Logs';
import ApiKeys from './pages/admin/ApiKeys';
import Subscriptions from './pages/admin/Subscriptions';
import BackgroundJobs from './pages/admin/BackgroundJobs';
import Backups from './pages/admin/Backups';
import ServiceStatus from './pages/admin/ServiceStatus';

import CompanyDashboard from './pages/company/Dashboard';
import CompanyDepartments from './pages/company/Departments';
import CompanyEmployees from './pages/company/Employees';
import CompanyTeams from './pages/company/Teams';
import CompanyProjects from './pages/company/Projects';
import CompanyTasks from './pages/company/Tasks';
import CompanyMeetings from './pages/company/Meetings';
import CompanyCalendar from './pages/company/Calendar';
import CompanyWorkLogs from './pages/company/WorkLogs';
import CompanyDocuments from './pages/company/Documents';
import CompanyReports from './pages/company/Reports';
import CompanyAnalytics from './pages/company/Analytics';
import CompanyApprovals from './pages/company/Approvals';
import CompanyNotifications from './pages/company/Notifications';
import CompanySettings from './pages/company/Settings';
import ManagerProfile from './pages/company/Profile';

import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeTasks from './pages/employee/Tasks';
import EmployeeProjects from './pages/employee/Projects';
import EmployeeCalendar from './pages/employee/Calendar';
import EmployeeDocuments from './pages/employee/Documents';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeeLeave from './pages/employee/Leave';
import EmployeePerformance from './pages/employee/Performance';
import EmployeeNotifications from './pages/employee/Notifications';
import EmployeeActivity from './pages/employee/Activity';
import EmployeeHelp from './pages/employee/Help';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeSettings from './pages/employee/Settings';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Super Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="logs" element={<SystemLogs />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="background-jobs" element={<BackgroundJobs />} />
        <Route path="backups" element={<Backups />} />
        <Route path="service-status" element={<ServiceStatus />} />
      </Route>

      {/* Manager Routes — Full Operational Command Center */}
      <Route path="/manager" element={<ProtectedRoute role="manager"><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="employees" element={<CompanyEmployees />} />
        <Route path="teams" element={<CompanyTeams />} />
        <Route path="departments" element={<CompanyDepartments />} />
        <Route path="projects" element={<CompanyProjects />} />
        <Route path="tasks" element={<CompanyTasks />} />
        <Route path="meetings" element={<CompanyMeetings />} />
        <Route path="calendar" element={<CompanyCalendar />} />
        <Route path="work-logs" element={<CompanyWorkLogs />} />
        <Route path="documents" element={<CompanyDocuments />} />
        <Route path="reports" element={<CompanyReports />} />
        <Route path="analytics" element={<CompanyAnalytics />} />
        <Route path="approvals" element={<CompanyApprovals />} />
        <Route path="notifications" element={<CompanyNotifications />} />
        <Route path="settings" element={<CompanySettings />} />
        <Route path="profile" element={<ManagerProfile />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/user" element={<ProtectedRoute role="user"><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="tasks" element={<EmployeeTasks />} />
        <Route path="projects" element={<EmployeeProjects />} />
        <Route path="calendar" element={<EmployeeCalendar />} />
        <Route path="documents" element={<EmployeeDocuments />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="performance" element={<EmployeePerformance />} />
        <Route path="notifications" element={<EmployeeNotifications />} />
        <Route path="activity" element={<EmployeeActivity />} />
        <Route path="help" element={<EmployeeHelp />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
