import React, { useState, useEffect } from "react";
import { storage, db } from "./firebase-config";
import { setDoc, doc, getDoc } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Comment, Header, Button } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";

const Avatar = ({ uid }) => {
  const [image, setImage] = useState();
  const [proofUrl, setProofUrl] = useState("");

  const updateImage = async (imageUrl) => {
    await setDoc(
      doc(db, "users", uid),
      { imageUrl: imageUrl },
      { merge: true }
    );
    setProofUrl(imageUrl);
  };
  const upload = () => {
    if (image.type && !image.type.startsWith("image/")) {
      console.log("File is not an image.", image.type, image);
      return;
    }
    let data = {};
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      data = event.target.result;
      const storageRef = ref(storage, `/userimages/${uid}/${image.name}`);
      uploadBytes(storageRef, data).then(() => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log(downloadURL);
          updateImage(downloadURL);
          toast("Updated avatar!");
        });
      });
    });
    reader.readAsArrayBuffer(image);
  };

  useEffect(() => {
    getDoc(doc(db, "users", uid)).then((userDoc) => {
      if (userDoc.exists && userDoc.data()?.imageUrl) {
        setProofUrl(userDoc.data().imageUrl);
      }
    });
  }, [uid]);

  return (
    <div>
      <Header as="h4">Upload Avatar</Header>
      <Container>
        <center>
          <div>
            <Comment.Avatar src={proofUrl} />
            <p>Note: If image blows out of view, please try a smaller size.</p>
          </div>
          <br />
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          <br />
          <br />
          <Button primary onClick={upload}>
            Upload new avatar
          </Button>
        </center>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Avatar;
