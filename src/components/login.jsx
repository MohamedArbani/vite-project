import { useRef } from "react";
import { login, signup } from "../services/userService";
import toast, { Toaster } from "react-hot-toast";
import "./styles.css";
function Login() {
  const usernameRef1 = useRef();
  const passwordRef1 = useRef();
  const usernameRef2 = useRef();
  const passwordRef2 = useRef();
  const emailRef = useRef();

  const storeUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.sessionToken);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = usernameRef1.current.value;
    const password = passwordRef1.current.value;
    if (!username || !password) {
      toast.error("Please fill all the fields.", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }
    try {
      const response = await login(username, password);
      if (response.sessionToken) {
        storeUser(response);
        toast.success("Login successful!", {
          duration: 4000,
          position: "top-right",
        });
        //Redirect to home page
        window.location.reload();
      }
    } catch (error) {
      toast.error("Login failed, please check your credentials.", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const username = usernameRef2.current.value;
    const password = passwordRef2.current.value;
    const email = emailRef.current.value;
    if (!username || !password || !email) {
      toast.error("Please fill all the fields.", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }
    try {
      const response = await signup(username, email, password);
      if (response.sessionToken) {
        storeUser(response);
        toast.success("Signup successful!", {
          duration: 4000,
          position: "top-right",
        });
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        "Signup failed. Maybe the username or email is already taken.",
        {
          duration: 4000,
          position: "top-right",
        }
      );
    }
  };
  return (
    <>
      <div className="login-wrap">
        <div className="login-html">
          <input
            id="tab-1"
            type="radio"
            name="tab"
            className="sign-in"
            defaultChecked
          />
          <label htmlFor="tab-1" className="tab">
            Sign In
          </label>
          <input id="tab-2" type="radio" name="tab" className="sign-up" />
          <label htmlFor="tab-2" className="tab">
            Sign Up
          </label>
          <div className="login-form">
            <form className="sign-in-htm" onSubmit={handleLogin}>
              <div className="group">
                <label htmlFor="user" className="label">
                  Username
                </label>
                <input
                  id="user"
                  type="text"
                  className="input"
                  ref={usernameRef1}
                />
              </div>
              <div className="group">
                <label htmlFor="pass" className="label">
                  Password
                </label>
                <input
                  id="pass"
                  type="password"
                  className="input"
                  data-type="password"
                  ref={passwordRef1}
                />
              </div>
              <div className="group">
                <input
                  id="check"
                  type="checkbox"
                  className="check"
                  defaultChecked
                />
                <label htmlFor="check">
                  <span className="icon"></span> Keep me Signed in
                </label>
              </div>
              <div className="group">
                <input type="submit" className="button" value="Sign In" />
              </div>
              <div className="hr"></div>
            </form>
            <form className="sign-up-htm" onSubmit={handleSignup}>
              <div className="group">
                <label htmlFor="user" className="label">
                  Username
                </label>
                <input
                  id="user"
                  type="text"
                  className="input"
                  ref={usernameRef2}
                />
              </div>
              <div className="group">
                <label htmlFor="pass" className="label">
                  Password
                </label>
                <input
                  id="pass"
                  type="password"
                  className="input"
                  data-type="password"
                  ref={passwordRef2}
                />
              </div>
              <div className="group">
                <label htmlFor="pass" className="label">
                  Email Address
                </label>
                <input id="pass" type="text" className="input" ref={emailRef} />
              </div>
              <div className="group">
                <input type="submit" className="button" value="Sign Up" />
              </div>
              <div className="hr"></div>
              <div className="foot-lnk">
                <label htmlFor="tab-1">Already Member?</label>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Login;
