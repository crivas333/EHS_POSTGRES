import React, { useState } from "react";

// function SignUpForm() {
export const SignUpForm = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // let history = useHistory();
  // history.push("/paciente");

  const submit = async (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);
    props.signUp.mutate({
      variables: {
        email: email,
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        password: password,
      },
    });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          {" "}
          firsName
          <input
            value={firstName}
            onChange={({ target }) => setFirstName(target.value)}
          />
        </div>
        <div>
          {" "}
          lastName
          <input
            value={lastName}
            onChange={({ target }) => setLastName(target.value)}
          />
        </div>
        <div>
          {" "}
          userName
          <input
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
        <div>
          {" "}
          email
          <input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <div>
          {" "}
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">SignUp</button>
      </form>
    </div>
  );
};

// export default SignUpForm;
// export const SignUpFormWithRouter = withRouter(SignUpForm)
