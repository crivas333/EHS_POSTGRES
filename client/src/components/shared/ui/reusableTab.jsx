import React, { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
// import Grid from "@mui/core/Grid";
// import Button from "@material-ui/core/Button";
// import IconAdd from "@material-ui/icons/Add";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Close from "@material-ui/icons/Close";
// import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
//import { makeStyles } from "@material-ui/styles";

// I was stuck at deleting Tab, however, I found this thread from Rahul-RB on git
// https://gist.github.com/Rahul-RB/273dbb24faf411fa6cc37488e1af2415
// Since I am building an app with react hook only,
// I tried converting it to React Hooks and its works like this

export default function CustomTab(props) {
  //const classes = useStyles();
  const indexToTabName = {
    Datos: 0,
    Contacto: 1,
    Misc: 2,
  };
  const [selectedTab, setSelectedTab] = useState(indexToTabName["Datos"]);
  const handleChangeTab = (event, newValue) => {
    //history.push(`/home/${tabNameToIndex[newValue]}`);
    //console.log('handleChangeTab: ',newValue)
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          //value={value}
          //onChange={handleChange}
          value={selectedTab}
          onChange={handleChangeTab}
        >
          <Tab label="Datos" />
          <Tab label="Contacto" />
          <Tab label="Misc" />
        </Tabs>
        {props.children}
      </Box>
    </Box>
  );
}
