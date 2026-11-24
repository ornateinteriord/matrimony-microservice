import React from 'react';

export interface NavItemConfig {
  id: string;
  title: string;
  path: string;
  icon: string | React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string | number;
  roles?: string[];
  children?: NavItemConfig[];
}

export interface SidebarConfig {
  brandTitle: string;
  homePath: string;
  items: NavItemConfig[];
}
