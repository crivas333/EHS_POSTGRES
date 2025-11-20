// src/components/NavBar/DrawerLeft.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  CssBaseline,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import Profile from "./Profile";
import drawerConfig from "./drawerConfig.jsx"; // Config-driven drawer content

const drawerWidth = 240;

export default function DrawerLeft({
  window,
  drawerOpen,
  onClickHandleDrawerClose,
  menuButtonRef,
}) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize open states dynamically from config
  const initialOpenStates = drawerConfig.reduce((acc, section) => {
    acc[section.stateKey] = section.defaultOpen;
    return acc;
  }, {});
  const [openStates, setOpenStates] = useState(initialOpenStates);

  const firstItemRef = useRef(null);

  const toggle = (key) => {
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Restore focus to menu button on drawer close (mobile only)
  useEffect(() => {
    if (!drawerOpen && isMobile) {
      menuButtonRef?.current?.focus();
    }
  }, [drawerOpen, menuButtonRef, isMobile]);

  const renderNestedItem = (to, label, icon = null, ref = null, autoFocus = false) => (
    <ListItem disablePadding key={to}>
      <ListItemButton
        ref={ref}
        component={NavLink}
        to={to}
        selected={location.pathname === to}
        onClick={() => {
          if (isMobile) onClickHandleDrawerClose();
        }}
        autoFocus={autoFocus && isMobile}
        sx={{
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
          },
        }}
      >
        {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Profile />
      <Divider />
      <List component="nav" sx={{ flex: 1, overflowY: "auto" }}>
        {drawerConfig.map((section, idx) => (
          <React.Fragment key={section.title}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggle(section.stateKey)}>
                <ListItemText primary={section.title} />
                {openStates[section.stateKey] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openStates[section.stateKey]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map((item, i) =>
                  renderNestedItem(
                    item.to,
                    item.label,
                    item.icon,
                    idx === 0 && i === 0 ? firstItemRef : null,
                    idx === 0 && i === 0
                  )
                )}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  const container = window ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ✅ Mobile Drawer (temporary) */}
      {isMobile ? (
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={(event, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              onClickHandleDrawerClose();
            }
          }}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            transition: {
              onEntered: () => {
                firstItemRef.current?.focus();
              },
            },
            paper: {
              sx: {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            },
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* ✅ Desktop Drawer (persistent) */
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          slotProps={{
            paper: {
              sx: {
                width: drawerWidth,
                boxSizing: "border-box",
                position: "relative",
                borderRight: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            },
          }}
          sx={{
            display: { xs: "none", sm: "block" },
            width: drawerWidth,
            flexShrink: 0,
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}
