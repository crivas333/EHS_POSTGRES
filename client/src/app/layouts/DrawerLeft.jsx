// client/src/app/layouts/DrawerLeft.jsx
import React, { useEffect, useRef, useCallback, memo } from "react";
import PropTypes from 'prop-types'; // Add this import
import {
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

import Profile from "@app/layouts/Profile";
import drawerConfig from "@app/config/drawer-config";
import { useLayoutStore } from "@app/store/layout-store";

const DRAWER_WIDTH = 240;

// Memoized section component for better performance
const DrawerSection = memo(({
  section,
  isOpen,
  location,
  isMobile,
  onToggle,
  onCloseDrawer,
  firstItemRef,
  sectionIndex
}) => {
  const theme = useTheme();
  
  const renderIcon = useCallback((Icon) => 
    Icon ? (
      <ListItemIcon sx={{ minWidth: 40 }}>
        <Icon fontSize="small" />
      </ListItemIcon>
    ) : null,
    []
  );

  return (
    <React.Fragment key={section.stateKey}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => onToggle(section.stateKey)}
          aria-expanded={isOpen}
          aria-controls={`${section.stateKey}-content`}
          sx={{
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          {renderIcon(section.icon)}
          <ListItemText 
            primary={section.title}
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem',
            }}
          />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      <Collapse 
        in={isOpen} 
        timeout="auto"
        id={`${section.stateKey}-content`}
        // Remove unmountOnExit for better UX with animations
      >
        <List component="div" disablePadding dense>
          {section.items.map((item, itemIndex) => {
            const isSelected = location.pathname === item.to;
            const isFirstItem = sectionIndex === 0 && itemIndex === 0;
            
            return (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  ref={isFirstItem ? firstItemRef : null}
                  component={NavLink}
                  to={item.to}
                  selected={isSelected}
                  onClick={() => isMobile && onCloseDrawer()}
                  sx={{
                    pl: 4,
                    py: 0.75,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {renderIcon(item.icon)}
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </React.Fragment>
  );
});

DrawerSection.displayName = 'DrawerSection';

// PropTypes for DrawerSection component
DrawerSection.propTypes = {
  section: PropTypes.shape({
    stateKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    items: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCloseDrawer: PropTypes.func.isRequired,
  firstItemRef: PropTypes.object,
  sectionIndex: PropTypes.number.isRequired,
};

export default function DrawerLeft({ window, menuButtonRef }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    drawerLeftOpen,
    drawerSections,
    toggleDrawerSection,
    closeDrawerLeft,
  } = useLayoutStore();

  const firstItemRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (drawerLeftOpen && isMobile) {
      setTimeout(() => firstItemRef.current?.focus(), 100);
    }
    if (!drawerLeftOpen && isMobile) {
      menuButtonRef?.current?.focus();
    }
  }, [drawerLeftOpen, isMobile, menuButtonRef]);

  const drawerContent = (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <Profile />
      <Divider />
      
      <List 
        sx={{ 
          flex: 1, 
          overflowY: "auto",
          overflowX: "hidden",
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: '3px',
          },
        }}
      >
        {drawerConfig.map((section, sectionIdx) => (
          <DrawerSection
            key={section.stateKey}
            section={section}
            isOpen={drawerSections[section.stateKey]}
            location={location}
            isMobile={isMobile}
            onToggle={toggleDrawerSection}
            onCloseDrawer={closeDrawerLeft}
            firstItemRef={firstItemRef}
            sectionIndex={sectionIdx}
          />
        ))}
      </List>
      
      {/* Optional: Add drawer footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        {/* Add version info, logout button, etc. */}
      </Box>
    </Box>
  );

  const container = window?.document.body;

  return (
    <>
      {/* Mobile: Temporary Drawer */}
    <Drawer
  container={container}
  variant="temporary"
  open={isMobile && drawerLeftOpen}
  onClose={closeDrawerLeft}
  ModalProps={{
    keepMounted: true,
    // Remove ariaHideApp or use disablePortal if needed
    disablePortal: false, // Use this instead of ariaHideApp
  }}
  // Or use slotProps for MUI v5+
  slotProps={{
    backdrop: {
      sx: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }
    }
  }}
  sx={{
    display: { xs: "block", sm: "none" },
    '& .MuiDrawer-paper': { 
      width: DRAWER_WIDTH, 
      boxSizing: "border-box",
    },
  }}
>
        {drawerContent}
      </Drawer>

      {/* Desktop: Persistent Drawer */}
      <Drawer
        variant="persistent"
        open={!isMobile && drawerLeftOpen}
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerLeftOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        aria-label="Desktop navigation drawer"
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

// PropTypes for DrawerLeft component
DrawerLeft.propTypes = {
  window: typeof window === 'undefined' ? undefined : PropTypes.object,
  menuButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};