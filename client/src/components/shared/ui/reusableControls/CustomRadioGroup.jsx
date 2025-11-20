import React from "react";
//import { FormControl, FormLabel, RadioGroup as MuiRadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
//import {RadioGroup as MuiRadioGroup} from '@material-ui/core'
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function CustomRadioGroup(props) {
  const { name, label, value, onChange, items } = props;
  //MuiRadioGroup
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio />}
            label={item.title}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
