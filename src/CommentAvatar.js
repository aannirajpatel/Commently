import React, { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { doc, getDoc } from "@firebase/firestore";
import { Comment } from "semantic-ui-react";

const CommentAvatar = ({ uid }) => {
  const [proofUrl, setProofUrl] = useState("");

  useEffect(() => {
    getDoc(doc(db, "users", uid)).then((userDoc) => {
      if (userDoc.exists && userDoc.data()?.imageUrl) {
        setProofUrl(userDoc.data().imageUrl);
      } else {
        setProofUrl(
          "https://react.semantic-ui.com/images/avatar/small/matt.jpg"
        );
      }
    });
  }, [uid]);

  return <Comment.Avatar src={proofUrl} />;
};

export default CommentAvatar;
