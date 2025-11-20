import React from "react";

/**
 * A lightweight reusable <form> wrapper that plays nicely
 * with the useReusableFormGPT hook.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form fields and buttons.
 * @param {Object} props.other - Any other <form> attributes (like onSubmit).
 *
 * Usage Example:
 * ---------------
 * <ReusableFormGPT onSubmit={handleSubmit(mySubmitFn)}>
 *   <TextField name="email" onChange={handleInputChange} value={values.email} />
 *   <Button type="submit">Save</Button>
 * </ReusableFormGPT>
 */
export function ReusableFormGPT({ children, ...other }) {
  return (
    <form
      autoComplete="off"
      noValidate
      {...other}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {children}
    </form>
  );
}
