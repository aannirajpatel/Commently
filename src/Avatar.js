import React, { useState } from "react";
import { storage, db } from "./firebase-config";
import { setDoc, doc, getDoc } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Comment, Header, Dimmer } from "semantic-ui-react";

const Avatar = ({ uid }) => {
  const [image, setImage] = useState();
  const [proofUrl, setProofUrl] = useState("");
  const [showProofImage, setShowProofImage] = useState(true);

  const updateImage = async (imageUrl) => {
    await setDoc(
      doc(db, "users", uid),
      { imageUrl: imageUrl },
      { merge: true }
    );
    setProofUrl(imageUrl);
    setShowProofImage(true);
  };
  const upload = () => {
    if (image.type && !image.type.startsWith("image/")) {
      console.log("File is not an image.", image.type, image);
      return;
    }
    setShowProofImage(false);
    let data = {};
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      data = event.target.result;
      const storageRef = ref(storage, `/userimages/${uid}/${image.name}`);
      uploadBytes(storageRef, data).then(() => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log(downloadURL);
          updateImage(downloadURL);
        });
      });
    });
    reader.readAsArrayBuffer(image);
  };

  useEffect(async () => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists && userDoc.data()?.imageUrl) {
      setProofUrl(userDoc.data().imageUrl);
      setShowProofImage(true);
    }
    return () => {};
  }, []);

  return (
    <>
      <Header as="h4">Upload Avatar</Header>
      <Container>
        <center>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          <br />
          <button onClick={upload}>Upload new avatar</button>
          <div>
            <br />
            <b>Uploaded image</b>
            <br />
            <Dimmer dimmed={!showProofImage}>
              <Comment.Avatar src={proofUrl} />
            </Dimmer>
          </div>
        </center>
      </Container>
    </>
  );
};

export default Avatar;
