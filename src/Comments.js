import React, { useRef, useState, useEffect } from "react";

import { Comment, Loader, Header, Form, Button, Icon } from "semantic-ui-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase-config";
import Moment from "react-moment";

const Comments = ({ tabUrl, user }) => {
  const [commentText, setcommentText] = useState("");
  const [commentProcessing, setCommentProcessing] = useState(false);
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    const q1 = query(collection(db, "webpages"), where("url", "==", tabUrl));
    const q1Snapshot = await getDocs(q1);
    if (q1Snapshot.empty) {
      console.log("Empty result for webpage comments");
    } else {
      const webpageRef = q1Snapshot.docs[0].ref;
      const q2 = query(
        collection(db, webpageRef.path, "comments"),
        orderBy("likeCount", "desc"),
        orderBy("timestamp", "desc")
      );
      const q2Snapshot = await getDocs(q2);
      setComments(q2Snapshot.docs);
    }
  };

  const addComment = async () => {
    if (!commentText) return;
    setCommentProcessing(true);
    const q = query(collection(db, "webpages"), where("url", "==", tabUrl));
    const querySnapshot = await getDocs(q);
    let webpageRef = null;

    if (querySnapshot.empty) {
      webpageRef = doc(collection(db, "webpages"));
      await setDoc(webpageRef, {
        url: tabUrl,
        timestamp: serverTimestamp(),
      });
    } else {
      webpageRef = querySnapshot.docs[0].ref;
    }

    await setDoc(doc(collection(db, webpageRef.path, "comments")), {
      uid: user.uid,
      username: user.email,
      timestamp: serverTimestamp(),
      content: commentText,
      likes: [],
      likeCount: 0,
    });
    setCommentProcessing(false);
    setcommentText("");
    toast("Comment sent!");
    loadComments();
  };

  const likeComment = async (ref) => {
    await updateDoc(ref, {
      likes: arrayRemove(user.uid),
    });
    await updateDoc(ref, {
      likes: arrayUnion(user.uid),
      likeCount: likeCount + 1,
    });
    loadComments();
  };

  const unlikeComment = async (ref, likeCount) => {
    await updateDoc(ref, {
      likes: arrayRemove(user.uid),
      likeCount: likeCount - 1,
    });
    loadComments();
  };

  useEffect(() => {
    loadComments();
    return () => {};
  }, []);

  return (
    <>
      <Comment.Group>
        <Header as="h4" dividing>
          Comments for{" "}
          <span title={tabUrl}>{tabUrl.substring(0, 20) + "..."}</span>
        </Header>
        <Form reply>
          <Form.TextArea
            value={commentText}
            onChange={(event) => {
              setcommentText(event.target.value);
            }}
          />
          <Button primary onClick={addComment} disabled={commentProcessing}>
            {commentProcessing ? (
              <Loader active={commentProcessing} inline />
            ) : (
              <>
                <Icon name="edit" /> Add comment
              </>
            )}
          </Button>
        </Form>
        <ToastContainer />
        {comments
          .map((comment) => {
            console.log(comment);
            return { ...comment.data(), id: comment.id, ref: comment.ref };
          })
          .map((comment) => {
            const likeCount = comment?.likes?.length || 0;
            return (
              <Comment key={comment.id}>
                <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">{comment?.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>
                      <Moment fromNow>{comment?.timestamp.toDate()}</Moment>
                    </div>
                  </Comment.Metadata>
                  <Comment.Text>{comment?.content}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action
                      onClick={
                        comment?.likes.filter((x) => x == user.uid).length > 0
                          ? () => unlikeComment(comment.ref, likeCount)
                          : () => likeComment(comment.ref, likeCount)
                      }
                    >
                      Like [{likeCount}]
                    </Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            );
          })}
        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
          <Comment.Content>
            <Comment.Author as="a">Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>

        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
          <Comment.Content>
            <Comment.Author as="a">Elliot Fu</Comment.Author>
            <Comment.Metadata>
              <div>Yesterday at 12:30AM</div>
            </Comment.Metadata>
            <Comment.Text>
              <p>This has been very useful for my research. Thanks as well!</p>
            </Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
          <Comment.Group>
            <Comment>
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
              <Comment.Content>
                <Comment.Author as="a">Jenny Hess</Comment.Author>
                <Comment.Metadata>
                  <div>Just now</div>
                </Comment.Metadata>
                <Comment.Text>Elliot you are always so right :)</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Comment>

        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/joe.jpg" />
          <Comment.Content>
            <Comment.Author as="a">Joe Henderson</Comment.Author>
            <Comment.Metadata>
              <div>5 days ago</div>
            </Comment.Metadata>
            <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </>
  );
};

export default Comments;
