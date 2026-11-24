import { SidebarConfig } from '../../types/navigation';

export const ADMIN_SIDEBAR_CONFIG: SidebarConfig = {
  brandTitle: 'Shree Ganda Admin',
  homePath: '/admin/dashboard',
  items: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'Dashboard',
      roles: ['admin', 'Admin']
    },
    {
      id: 'members',
      title: 'Member Records',
      path: '/admin/user-table',
      icon: 'Group',
      roles: ['admin', 'Admin'],
      children: [
        { id: 'user-table', title: 'User Table', path: '/admin/user-table', icon: 'Group' },
        { id: 'user-upgrade', title: 'User Upgrade', path: '/admin/userData', icon: 'Group' },
        { id: 'renewals', title: 'Renewal', path: '/admin/renewals', icon: 'Autorenew' },
        { id: 'reset-password', title: 'Password', path: '/admin/resetpass', icon: 'Security' },
      ]
    },
    {
      id: 'verifications',
      title: 'Photo Verifications',
      path: '/admin/imageverify',
      icon: 'CameraAlt',
      roles: ['admin', 'Admin']
    },
    {
      id: 'subscriptions',
      title: 'Membership Plans',
      path: '/admin/plans',
      icon: 'Loyalty',
      roles: ['admin', 'Admin'],
      children: [
        { id: 'promoters-data', title: 'Promoters', path: '/admin/promoters', icon: 'Group' },
        { id: 'promoters-users', title: 'Promoter Users', path: '/admin/promotersusers', icon: 'Group' },
        { id: 'promoter-earn', title: 'Promoter Earnings', path: '/admin/promoterearn', icon: 'AttachMoney' },
        { id: 'pay-to-promoters', title: 'Pay to Promoters', path: '/admin/paytopromoters', icon: 'AttachMoney' },
        { id: 'receipts-voucher', title: 'Receipt Voucher', path: '/admin/receiptsvocher', icon: 'Receipt' },
        { id: 'online-transaction', title: 'Online Transaction', path: '/admin/onlinetransaction', icon: 'AttachMoney' },
        { id: 'user-reports', title: 'User Reports', path: '/admin/userreports', icon: 'Assessment' },
      ]
    },
    {
      id: 'audit',
      title: 'Security Audit',
      path: '/admin/audit',
      icon: 'Security',
      roles: ['admin', 'Admin', 'security']
    }
  ]
};

export default ADMIN_SIDEBAR_CONFIG;
