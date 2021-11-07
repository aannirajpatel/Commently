import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase-config";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import {
  Header,
  Container,
  Menu,
  Form,
  Checkbox,
  Button,
} from "semantic-ui-react";
import Comments from "./Comments";
import Avatar from "./Avatar";

function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setregisterUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [profileUsername, setprofileUsername] = useState("");
  const [isLoggedOut, setisLoggedOut] = useState(true);
  const [showLogin, setshowLogin] = useState(true);
  const [showSignup, setshowSignup] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const [showComments, setshowComments] = useState(false);
  const [username, setUsername] = useState("");

  const suppressPages = () => {
    setshowLogin(false);
    setshowProfile(false);
    setshowSignup(false);
  };

  const [user, setUser] = useState({});

  onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser?.email) {
      setshowLogin(false);
      setshowComments(true);
    } else {
      setshowComments(false);
    }
  });

  const signup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      await setDoc(
        doc(db, "users", user?.user?.uid),
        {
          username: registerUsername,
        },
        { merge: true }
      );
      console.log(user);
      setshowSignup(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      setshowLogin(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setshowProfile(false);
  };

  const [tabUrl, settabUrl] = useState("N/A");

  useEffect(() => {
    try {
      settabUrl(window.location.href);
    } catch (e) {
      console.log("Error: " + JSON.stringify(e));
    }
    return () => {};
  }, []);

  useEffect(() => {
    try {
      if (user?.uid) {
        getDoc(doc(db, "users", user.uid)).then((userDoc) => {
          if (userDoc.exists && userDoc.data()?.username)
            setUsername(userDoc.data()?.username);
          setprofileUsername(username);
        });
        setisLoggedOut(false);
      } else {
        setisLoggedOut(true);
        showLogin(true);
      }
    } catch (e) {
      console.log(e);
    }
  }, [user]);

  const selectLogin = () => {
    suppressPages();
    setshowLogin(true);
  };

  const selectSignup = () => {
    suppressPages();
    setshowSignup(true);
  };

  const selectProfile = () => {
    let opened = false;
    if (showProfile) {
      opened = true;
    }
    suppressPages();
    opened ? setshowProfile(false) : setshowProfile(true);
  };

  const updateProfile = async () => {
    await setDoc(
      doc(db, "users", user?.uid),
      {
        username: profileUsername,
      },
      { merge: true }
    );
    setUsername(profileUsername);
  };

  return (
    <>
      <Menu inverted pointing>
        {isLoggedOut && (
          <>
            <Menu.Item onClick={selectLogin}>Login</Menu.Item>
            <Menu.Item onClick={selectSignup}>Signup</Menu.Item>
          </>
        )}
        {!isLoggedOut && (
          <>
            <Menu.Item onClick={selectProfile}>Profile</Menu.Item>
            <Menu.Item onClick={logout}>Logout</Menu.Item>
          </>
        )}
        <Menu.Item position="right">Commently</Menu.Item>
      </Menu>
      <Container>
        {showLogin && (
          <div>
            <Header as="h1">Login to Commently!</Header>
            <Form>
              <Form.Field>
                <label>E-mail</label>
                <input
                  placeholder="Email"
                  onChange={(event) => setLoginEmail(event.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  placeholder="Password"
                  type="password"
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
              </Form.Field>
              <Button primary type="submit" onClick={login}>
                Submit
              </Button>
            </Form>
          </div>
        )}

        {showSignup && (
          <div>
            <Header as="h1">Sign up!</Header>
            <Form>
              <Form.Field>
                <label>Username</label>
                <input
                  placeholder="Need not be unique"
                  onChange={(event) => setregisterUsername(event.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>E-mail</label>
                <input
                  placeholder="Email"
                  onChange={(event) => setRegisterEmail(event.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  placeholder="Keep it secret :)"
                  type="password"
                  onChange={(event) => setRegisterPassword(event.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox label="I agree to the Terms and Conditions" />
              </Form.Field>
              <Button primary type="submit" onClick={signup}>
                Submit
              </Button>
            </Form>
          </div>
        )}

        {showProfile && (
          <div>
            <Header as="h1">Your Profile</Header>
            <Avatar uid={user?.uid} />
            <Form>
              <Form.Field>
                <label>Username</label>
                <input
                  placeholder="Need not be unique"
                  onChange={(event) => setprofileUsername(event.target.value)}
                />
              </Form.Field>
              <Button primary type="submit" onClick={updateProfile}>
                Update Profile
              </Button>
            </Form>
            <br />
            <p>
              Logged in as {username} via {user?.email}
            </p>
            <Button red onClick={() => setshowProfile(false)}>
              Close
            </Button>
            <hr />
          </div>
        )}

        {showComments && (
          <div>
            <Comments tabUrl={tabUrl} user={user} />
          </div>
        )}
      </Container>
    </>
  );
}

export default App;
