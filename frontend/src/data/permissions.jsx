import {
  LayoutDashboard, Building2, Users, Key, CreditCard, BarChart3,
  Settings, Shield, FileText, Link2, Database, Monitor, Terminal,
  Activity, Bot, Cog, Briefcase, Calendar, Layers, Clock, UserPlus,
  Users2, FolderKanban, CheckSquare, Video, BookOpen, ClipboardList,
  Bell, UserCircle, DollarSign, TrendingUp, Target, PieChart,
  MessageSquare, Headphones, Award, GitBranch, Server,
  LifeBuoy
} from 'lucide-react';

export const ROLES = {
  admin: {
    label: 'Platform Administrator',
    level: 3,
    color: '#ef4444',
    sidebar: [
      { section: 'Main', items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      ]},
      { section: 'Tenant Management', items: [
        { label: 'Companies', path: '/admin/companies', icon: <Building2 className="h-4 w-4" /> },
      ]},
      { section: 'User Management', items: [
        { label: 'Employees', path: '/admin/employees', icon: <Users className="h-4 w-4" /> },
      ]},
      { section: 'Billing', items: [
        { label: 'Subscriptions', path: '/admin/subscriptions', icon: <CreditCard className="h-4 w-4" /> },
        { label: 'Invoices', path: '/admin/billing', icon: <FileText className="h-4 w-4" /> },
      ]},
      { section: 'Platform', items: [
        { label: 'Settings', path: '/admin/settings', icon: <Cog className="h-4 w-4" /> },
        { label: 'API Keys', path: '/admin/api-keys', icon: <Link2 className="h-4 w-4" /> },
        { label: 'Background Jobs', path: '/admin/background-jobs', icon: <Bot className="h-4 w-4" /> },
        { label: 'Backups', path: '/admin/backups', icon: <Database className="h-4 w-4" /> },
      ]},
      { section: 'Monitoring', items: [
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
        { label: 'Audit Logs', path: '/admin/logs', icon: <Terminal className="h-4 w-4" /> },
        { label: 'Service Status', path: '/admin/service-status', icon: <Activity className="h-4 w-4" /> },
      ]},
    ],
  },
  manager: {
    label: 'Company Administrator',
    level: 2,
    color: '#f59e0b',
    sidebar: [
      { section: 'Main', items: [
        { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      ]},
      { section: 'Team Management', items: [
        { label: 'Employees', path: '/manager/employees', icon: <UserPlus className="h-4 w-4" /> },
        { label: 'Teams', path: '/manager/teams', icon: <Users2 className="h-4 w-4" /> },
        { label: 'Departments', path: '/manager/departments', icon: <Building2 className="h-4 w-4" /> },
      ]},
      { section: 'Work', items: [
        { label: 'Projects', path: '/manager/projects', icon: <FolderKanban className="h-4 w-4" /> },
        { label: 'Tasks', path: '/manager/tasks', icon: <CheckSquare className="h-4 w-4" /> },
        { label: 'Meetings', path: '/manager/meetings', icon: <Video className="h-4 w-4" /> },
        { label: 'Calendar', path: '/manager/calendar', icon: <Calendar className="h-4 w-4" /> },
        { label: 'Work Logs', path: '/manager/work-logs', icon: <BookOpen className="h-4 w-4" /> },
      ]},
      { section: 'Resources', items: [
        { label: 'Documents', path: '/manager/documents', icon: <FileText className="h-4 w-4" /> },
        { label: 'Reports', path: '/manager/reports', icon: <BarChart3 className="h-4 w-4" /> },
        { label: 'Analytics', path: '/manager/analytics', icon: <PieChart className="h-4 w-4" /> },
      ]},
      { section: 'Administration', items: [
        { label: 'Approvals', path: '/manager/approvals', icon: <Shield className="h-4 w-4" /> },
        { label: 'Notifications', path: '/manager/notifications', icon: <Bell className="h-4 w-4" /> },
        { label: 'Settings', path: '/manager/settings', icon: <Cog className="h-4 w-4" /> },
      ]},
      { section: 'Account', items: [
        { label: 'Profile', path: '/manager/profile', icon: <UserCircle className="h-4 w-4" /> },
      ]},
    ],
  },
  user: {
    label: 'Employee',
    level: 1,
    color: '#3b82f6',
    sidebar: [
      { section: 'Main', items: [
        { label: 'Dashboard', path: '/user/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      ]},
      { section: 'Work', items: [
        { label: 'My Tasks', path: '/user/tasks', icon: <CheckSquare className="h-4 w-4" /> },
        { label: 'My Projects', path: '/user/projects', icon: <FolderKanban className="h-4 w-4" /> },
        { label: 'Calendar', path: '/user/calendar', icon: <Calendar className="h-4 w-4" /> },
        { label: 'Documents', path: '/user/documents', icon: <FileText className="h-4 w-4" /> },
      ]},
      { section: 'Time', items: [
        { label: 'Attendance', path: '/user/attendance', icon: <Clock className="h-4 w-4" /> },
        { label: 'Leave', path: '/user/leave', icon: <Briefcase className="h-4 w-4" /> },
      ]},
      { section: 'Insights', items: [
        { label: 'My Performance', path: '/user/performance', icon: <BarChart3 className="h-4 w-4" /> },
        { label: 'Notifications', path: '/user/notifications', icon: <Bell className="h-4 w-4" /> },
        { label: 'Activity', path: '/user/activity', icon: <Activity className="h-4 w-4" /> },
      ]},
      { section: 'Support', items: [
        { label: 'Help & Support', path: '/user/help', icon: <LifeBuoy className="h-4 w-4" /> },
      ]},
      { section: 'Account', items: [
        { label: 'My Profile', path: '/user/profile', icon: <UserCircle className="h-4 w-4" /> },
        { label: 'Settings', path: '/user/settings', icon: <Cog className="h-4 w-4" /> },
      ]},
    ],
  },
};

export const getRoleConfig = (role) => ROLES[role] || ROLES.user;
