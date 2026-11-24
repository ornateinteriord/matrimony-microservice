import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Chip,
  Badge,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavItemConfig, SidebarConfig } from '../../types/navigation';

export interface DynamicSidebarProps {
  config: SidebarConfig;
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  userProfile?: {
    first_name?: string;
    last_name?: string;
    type_of_user?: string;
    role?: string;
    avatar?: string;
  };
  onItemClick?: (item: NavItemConfig) => void;
  width?: number;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  config,
  isOpen = true,
  isMobile = false,
  onClose,
  userProfile,
  onItemClick,
  width = 250,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const handleToggleSubmenu = (itemId: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleNavClick = (item: NavItemConfig) => {
    if (item.children && item.children.length > 0) {
      handleToggleSubmenu(item.id);
      return;
    }

    if (onItemClick) {
      onItemClick(item);
    }

    if (item.path) {
      navigate(item.path);
    }

    if (isMobile && onClose) {
      onClose();
    }
  };

  const isItemActive = (item: NavItemConfig): boolean => {
    if (item.path && location.pathname.toLowerCase() === item.path.toLowerCase()) {
      return true;
    }
    if (item.children) {
      return item.children.some(
        (child) => child.path && location.pathname.toLowerCase() === child.path.toLowerCase()
      );
    }
    return false;
  };

  const renderIcon = (icon: NavItemConfig['icon']) => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <span style={{ fontSize: '1.25rem' }}>{icon}</span>;
    }
    const IconComponent = icon;
    return <IconComponent style={{ fontSize: '1.25rem' }} />;
  };

  const renderNavItem = (item: NavItemConfig, depth: number = 0) => {
    const active = isItemActive(item);
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isSubmenuOpen = Boolean(openSubmenus[item.id]);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavClick(item)}
            sx={{
              minHeight: 44,
              px: depth > 0 ? 3.5 : 2,
              py: 0.8,
              borderRadius: '6px',
              mx: 1,
              backgroundColor: active
                ? 'rgba(212, 175, 55, 0.18)'
                : 'transparent',
              borderLeft: active
                ? '3px solid #D4AF37'
                : '3px solid transparent',
              color: active ? '#D4AF37' : '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                color: '#D4AF37',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: active ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)',
                }}
              >
                {renderIcon(item.icon)}
              </ListItemIcon>
            )}

            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: depth > 0 ? '0.9rem' : '0.95rem',
                fontWeight: active ? 700 : 500,
              }}
            />

            {item.badge !== undefined && (
              <Badge
                badgeContent={item.badge}
                color="secondary"
                sx={{ mr: hasChildren ? 1 : 0 }}
              />
            )}

            {hasChildren && (
              isSubmenuOpen ? (
                <ExpandLess sx={{ color: active ? '#D4AF37' : '#FFFFFF' }} />
              ) : (
                <ExpandMore sx={{ color: active ? '#D4AF37' : '#FFFFFF' }} />
              )
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && item.children && (
          <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1 }}>
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0B192C',
        color: '#FFFFFF',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          onClick={() => navigate(config.homePath || '/')}
          sx={{
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.5px',
            color: '#FFFFFF',
          }}
        >
          {config.brandTitle}
        </Typography>

        {isMobile && onClose && (
          <IconButton onClick={onClose} sx={{ color: '#FFFFFF' }} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Profile summary if provided */}
      {userProfile && (
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: '#FFFFFF', textTransform: 'capitalize' }}
          >
            {userProfile.first_name} {userProfile.last_name || ''}
          </Typography>
          {(userProfile.type_of_user || userProfile.role) && (
            <Chip
              label={userProfile.type_of_user || userProfile.role}
              size="small"
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#D4AF37',
                color: '#0B192C',
              }}
            />
          )}
        </Box>
      )}

      {/* Nav List */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
        <List sx={{ width: '100%' }}>
          {config.items.map((item) => renderNavItem(item))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isOpen}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          backgroundColor: '#0B192C',
          color: '#FFFFFF',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default DynamicSidebar;
