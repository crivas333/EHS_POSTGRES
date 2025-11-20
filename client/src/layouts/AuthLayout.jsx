// import Head from "next/head";
import React from "react";
// import Navbar from "./Navigation/MainNavigation";
//import { makeStyles } from "@mui/styles";
// import SideBar from "./SideBar";

// const Layout = (props) => (
//   return {<div>
//     <SideBar />
//     <div className="container">{props.children}</div>
//   </div>};
// );

// export default Layout;
// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
// }));

export default function AuthLayout(props) {
  //const classes = useStyles();
  return (
    <div
    //className="container"
    >
      {props.children}
    </div>
  );
}

/*
   <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
      </Grid>
    </div>
*/
