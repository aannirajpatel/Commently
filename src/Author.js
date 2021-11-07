import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebase-config";
const Author = ({ uid }) => {
  const [username, setUsername] = useState("Anonymous");
  useEffect(() => {
    getDoc(doc(db, "users", uid)).then((userDoc) => {
      if (userDoc.exists && userDoc.data()?.username)
        setUsername(userDoc.data().username);
    });
    return () => {};
  }, [uid]);
  return <>{username}</>;
};

export default Author;
