import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "@/api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register";

const Register = () => {
  const userNameRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatchPwd, setValidMatchPwd] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userNameRef?.current?.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(userName);
    console.log(userName, result);
    setValidUserName(result);
  }, [userName]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(pwd);
    console.log(pwd, result);
    setValidPwd(result);

    const matchResult = pwd === matchPwd;
    setValidMatchPwd(matchResult);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrorMsg("");
  }, [userName, pwd, matchPwd]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if button enabled with js hack
    const v1 = USER_REGEX.test(userName);
    const v2 = PASSWORD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrorMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          userName,
          passeord: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data)
      setSuccess(true);
      // clear the input field

    } catch (error: any) {
      if (!error) {
        setErrorMsg("No server response")
      } else if (error.response?.status === 409) {
        setErrorMsg("Username taken")
      } else {
        setErrorMsg("Registeration Failed")
      }
      errRef.current?.focus()
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errorMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errorMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <span className={validUserName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validUserName || !userName ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="username"
              ref={userNameRef}
              autoComplete="off"
              onChange={(e) => setUserName(e.target.value)}
              required
              arial-invalid={validUserName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
              maxLength={24}
            />
            <p
              id="uidnote"
              className={
                userNameFocus && userName && !validUserName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 charaters.
              <br />
              Must begin with a letter.
              <br />
              Letters, Numbers, Underscores, Hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              arial-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              maxLength={24}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 charaters.
              <br />
              Must include uppercase and lowercase letters, number and a special
              character.
              <br />
              Allowed special characters:
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_password">
              Confirm Password:
              <span className={validMatchPwd && matchPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatchPwd || !matchPwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="confirm_password"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              arial-invalid={validMatchPwd ? "false" : "true"}
              aria-describedby="confirmpwdnote"
              onFocus={() => setMatchPwdFocus(true)}
              onBlur={() => setMatchPwdFocus(false)}
              maxLength={24}
            />
            <p
              id="confirmpwdnote"
              className={
                matchPwdFocus && !validMatchPwd ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button disabled={!validUserName || !validPwd || !validMatchPwd}>
              Sign Up
            </button>
          </form>
          <p>
            Already Registered?
            <br />
            <span className="line">
              {/* router link */}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
