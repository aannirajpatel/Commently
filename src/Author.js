import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebase-config";
const Author = ({ uid }) => {
  const [username, setUsername] = useState("Anonymous");
  useEffect(async () => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists && userDoc.data()?.username)
      setUsername(userDoc.data().username);
    return () => {};
  }, []);
  return <>{username}</>;
};

export default Author;