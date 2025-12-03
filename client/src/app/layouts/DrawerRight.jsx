// client/src/app/layouts/LayoutDrawerRight.jsx
import React, { useEffect, useRef } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

import { useLayoutStore } from "@app/store/layout-store";
import rightDrawerConfig from "@app/config/drawer-right-config"; // ← Archivo externo

const DRAWER_WIDTH = 240;

export default function DrawerRight({ window, menuButtonRef }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    drawerRightOpen,
    drawerSections,
    toggleDrawerSection,
    closeDrawerRight,
  } = useLayoutStore();

  const firstItemRef = useRef(null);

  // Focus management (mobile)
  useEffect(() => {
    if (drawerRightOpen && isMobile) {
      setTimeout(() => firstItemRef.current?.focus(), 100);
    }
    if (!drawerRightOpen && isMobile) {
      menuButtonRef?.current?.focus();
    }
  }, [drawerRightOpen, isMobile, menuButtonRef]);

  const renderIcon = (Icon) => Icon && <Icon fontSize="small" sx={{ minWidth: 40 }} />;

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" fontWeight="600">
          Panel Rápido
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflowY: "auto", px: 1, py: 1 }}>
        {rightDrawerConfig.map((section, sectionIdx) => {
          const isOpen = drawerSections[section.stateKey] ?? section.defaultOpen;

          return (
            <React.Fragment key={section.stateKey}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => toggleDrawerSection(section.stateKey)}
                  sx={{
                    borderRadius: 1,
                    bgcolor: isOpen ? "action.hover" : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {renderIcon(section.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.title}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: "medium",
                    }}
                  />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items.map((item, itemIdx) => (
                    <ListItem key={item.to} disablePadding>
                      <ListItemButton
                        ref={sectionIdx === 0 && itemIdx === 0 ? firstItemRef : null}
                        component={NavLink}
                        to={item.to}
                        selected={location.pathname === item.to}
                        onClick={() => isMobile && closeDrawerRight()}
                        sx={{
                          pl: 4,
                          borderRadius: 1,
                          "&.Mui-selected": {
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            "& .MuiListItemIcon-root": { color: "inherit" },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {renderIcon(item.icon)}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{ fontSize: "0.85rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>

              {sectionIdx < rightDrawerConfig.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  const container = window?.document.body;

  return (
    <>
      {/* Mobile: Temporary */}
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={isMobile && drawerRightOpen}
        onClose={closeDrawerRight}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop: Persistent */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={!isMobile && drawerRightOpen}
        sx={{
          display: { xs: "none", sm: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}