import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Chip,
  Badge,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as GroupIcon,
  CameraAlt as CameraAltIcon,
  Loyalty as LoyaltyIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  SupportAgent as SupportAgentIcon,
  Autorenew as AutorenewIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  HourglassEmpty as PendingIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  ManageSearch as ManageSearchIcon,
  ImageSearch as ImageSearchIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { NavItemConfig, SidebarConfig } from '../../types/navigation';

export interface DynamicSidebarProps {
  config: SidebarConfig;
  userRole?: string;
  onItemClick?: (item: NavItemConfig) => void;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  Dashboard: DashboardIcon,
  dashboard: DashboardIcon,
  Group: GroupIcon,
  group: GroupIcon,
  Groups: GroupIcon,
  CameraAlt: CameraAltIcon,
  camera: CameraAltIcon,
  Loyalty: LoyaltyIcon,
  loyalty: LoyaltyIcon,
  Security: SecurityIcon,
  security: SecurityIcon,
  Person: PersonIcon,
  person: PersonIcon,
  Share: ShareIcon,
  SupportAgent: SupportAgentIcon,
  Autorenew: AutorenewIcon,
  AttachMoney: AttachMoneyIcon,
  AccountBalanceWallet: AccountBalanceWalletIcon,
  Pending: PendingIcon,
  Favorite: FavoriteIcon,
  Search: SearchIcon,
  ManageSearch: ManageSearchIcon,
  ImageSearch: ImageSearchIcon,
  TrendingUp: TrendingUpIcon,
  Logout: LogoutIcon,
  Home: HomeIcon,
};

const renderIcon = (icon: NavItemConfig['icon'], active: boolean) => {
  const iconColor = active ? '#8B1E1E' : '#C5A059';
  if (!icon) return null;

  if (typeof icon === 'string') {
    const IconComponent = ICON_MAP[icon] || DashboardIcon;
    return <IconComponent style={{ fontSize: 20, color: iconColor }} />;
  }

  const CustomIcon = icon;
  return <CustomIcon style={{ fontSize: 20, color: iconColor }} />;
};

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  config,
  userRole,
  onItemClick,
  headerContent,
  footerContent,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const isRolePermitted = (item: NavItemConfig): boolean => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userRole) return true;
    return item.roles.includes(userRole);
  };

  const toggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigate = (item: NavItemConfig) => {
    if (item.children && item.children.length > 0) {
      toggleSubMenu(item.id);
      return;
    }

    if (onItemClick) {
      onItemClick(item);
    }

    if (item.path) {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  const filteredItems = config.items.filter(isRolePermitted);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FDFBF7',
        color: '#2D1810',
        borderRight: '1px solid rgba(197, 160, 89, 0.25)',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Link
          to={config.homePath}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}
          onClick={onClose}
        >
          <img
            src="/ShreeLogo.png"
            alt={config.brandTitle}
            style={{ height: '38px', width: 'auto', borderRadius: '4px', objectFit: 'contain' }}
            onError={(e) => {
              // Hide image if fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#78350F',
              letterSpacing: '0.3px',
            }}
          >
            {config.brandTitle}
          </Typography>
        </Link>
      </Box>

      {/* Optional Header Content (e.g. user profile card) */}
      {headerContent && (
        <Box sx={{ borderBottom: '1px solid rgba(197, 160, 89, 0.2)' }}>
          {headerContent}
        </Box>
      )}

      {/* Nav List */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List disablePadding>
          {filteredItems.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const isSubOpen = Boolean(openSubMenus[item.id]);

            return (
              <React.Fragment key={item.id}>
                <ListItem disablePadding sx={{ display: 'block', mb: 0.5, px: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavigate(item)}
                    sx={{
                      borderRadius: '4px',
                      minHeight: 44,
                      px: 2,
                      backgroundColor: isActive ? 'rgba(197, 160, 89, 0.18)' : 'transparent',
                      borderLeft: isActive ? '3px solid #78350F' : '3px solid transparent',
                      '&:hover': {
                        backgroundColor: isActive
                          ? 'rgba(197, 160, 89, 0.28)'
                          : 'rgba(197, 160, 89, 0.08)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {renderIcon(item.icon, isActive)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#8B1E1E' : '#2D1810',
                      }}
                    />
                    {item.badge !== undefined && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#C5A059',
                          color: '#FFFFFF',
                          mr: hasChildren ? 1 : 0,
                        }}
                      />
                    )}
                    {hasChildren && (isSubOpen ? <ExpandLess sx={{ color: '#8B1E1E' }} /> : <ExpandMore sx={{ color: '#5C4033' }} />)}
                  </ListItemButton>
                </ListItem>

                {hasChildren && item.children && (
                  <Collapse in={isSubOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 3, pr: 1 }}>
                      {item.children.filter(isRolePermitted).map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <ListItem key={child.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                              onClick={() => handleNavigate(child)}
                              sx={{
                                borderRadius: '6px',
                                minHeight: 38,
                                px: 2,
                                backgroundColor: isChildActive
                                  ? 'rgba(197, 160, 89, 0.15)'
                                  : 'transparent',
                                '&:hover': {
                                  backgroundColor: 'rgba(197, 160, 89, 0.08)',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                {renderIcon(child.icon, isChildActive)}
                              </ListItemIcon>
                              <ListItemText
                                primary={child.title}
                                primaryTypographyProps={{
                                  fontSize: '0.85rem',
                                  fontWeight: isChildActive ? 700 : 400,
                                  color: isChildActive ? '#8B1E1E' : '#5C4033',
                                }}
                              />
                              {child.badge !== undefined && (
                                <Chip
                                  label={child.badge}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    backgroundColor: '#C5A059',
                                    color: '#FFFFFF',
                                  }}
                                />
                              )}
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* Optional Footer Content */}
      {footerContent && (
        <Box sx={{ borderTop: '1px solid rgba(197, 160, 89, 0.25)', p: 1.5 }}>
          {footerContent}
        </Box>
      )}
    </Box>
  );
};

export default DynamicSidebar;
