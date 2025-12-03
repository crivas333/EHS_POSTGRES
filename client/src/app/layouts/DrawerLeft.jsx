// client/src/app/layouts/LayoutDrawerLeft.jsx
import React, { useEffect, useRef } from "react";
import {
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

//import Profile from "@app/components/Profile";
import Profile from "@app/layouts/Profile";
import drawerConfig from "@app/config/drawer-config";
import { useLayoutStore } from "@app/store/layout-store"; // ← ¡AQUÍ ESTÁ LA MAGIA!

const DRAWER_WIDTH = 240;

export default function DrawerLeft({ window, menuButtonRef }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Zustand state & actions
  const {
    drawerLeftOpen,
    drawerSections,
    toggleDrawerSection,
    closeDrawerLeft,
  } = useLayoutStore();

  const firstItemRef = useRef(null);

  // Focus first item when mobile drawer opens
  useEffect(() => {
    if (drawerLeftOpen && isMobile) {
      setTimeout(() => firstItemRef.current?.focus(), 100);
    }
    if (!drawerLeftOpen && isMobile) {
      menuButtonRef?.current?.focus();
    }
  }, [drawerLeftOpen, isMobile, menuButtonRef]);

  const renderIcon = (Icon) => Icon && <Icon fontSize="small" sx={{ mr: 2 }} />;

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.paper" }}>
      <Profile />
      <Divider />
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {drawerConfig.map((section, sectionIdx) => (
          <React.Fragment key={section.stateKey}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleDrawerSection(section.stateKey)}>
                {renderIcon(section.icon)}
                <ListItemText primary={section.title} />
                {drawerSections[section.stateKey] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={drawerSections[section.stateKey]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map((item, itemIdx) => (
                  <ListItem key={item.to} disablePadding>
                    <ListItemButton
                      ref={sectionIdx === 0 && itemIdx === 0 ? firstItemRef : null}
                      component={NavLink}
                      to={item.to}
                      selected={location.pathname === item.to}
                      onClick={() => isMobile && closeDrawerLeft()}
                      sx={{
                        pl: 4,
                        "&.Mui-selected": {
                          bgcolor: "action.selected",
                          fontWeight: 600,
                        },
                      }}
                    >
                      {renderIcon(item.icon)}
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  const container = window?.document.body;

  return (
    <>
      {/* Mobile: Temporary Drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={isMobile ? drawerLeftOpen : false}
        onClose={closeDrawerLeft}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
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
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}