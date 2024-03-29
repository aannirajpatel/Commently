import React, { useState, useEffect } from "react";

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

import Author from "./Author";
import CommentAvatar from "./CommentAvatar";

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
        orderBy("netLikes", "desc"),
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
      timestamp: serverTimestamp(),
      content: commentText,
      likes: [],
      dislikes: [],
      netLikes: 0,
    });
    setCommentProcessing(false);
    setcommentText("");
    toast("Comment sent!");
    loadComments();
  };

  //like comments
  const likeComment = async (ref, netLikes) => {
    await updateDoc(ref, {
      likes: arrayRemove(user.uid),
    });
    await updateDoc(ref, {
      dislikes: arrayRemove(user.uid),
      likes: arrayUnion(user.uid),
      netLikes: netLikes + 1,
    });
    loadComments();
  };

  const unlikeComment = async (ref, netLikes) => {
    await updateDoc(ref, {
      likes: arrayRemove(user.uid),
      netLikes: netLikes - 1,
    });
    loadComments();
  };

  //dislike comments
  const dislikeComment = async (ref, netLikes) => {
    await updateDoc(ref, {
      dislikes: arrayRemove(user.uid),
    });
    await updateDoc(ref, {
      likes: arrayRemove(user.uid),
      dislikes: arrayUnion(user.uid),
      netLikes: netLikes - 1,
    });
    loadComments();
  };

  const undislikeComment = async (ref, netLikes) => {
    await updateDoc(ref, {
      dislikes: arrayRemove(user.uid),
      netLikes: netLikes + 1,
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
            return { ...comment.data(), id: comment.id, ref: comment.ref };
          })
          .map((comment) => {
            const likeCount = comment?.likes?.length || 0;
            const dislikeCount = comment?.dislikes?.length || 0;
            return (
              <Comment key={comment.id}>
                <CommentAvatar uid={comment.uid} />
                <Comment.Content>
                  <Comment.Author as="a">
                    <Author uid={comment.uid} />
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>
                      <Moment fromNow>{comment?.timestamp.toDate()}</Moment>
                    </div>
                  </Comment.Metadata>
                  <Comment.Text>{comment?.content}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action
                      onClick={
                        comment?.likes.filter((x) => x === user?.uid).length > 0
                          ? () => unlikeComment(comment.ref, comment.netLikes)
                          : () => likeComment(comment.ref, comment.netLikes)
                      }
                    >
                      Like [{likeCount}]
                    </Comment.Action>
                    <Comment.Action
                      onClick={
                        comment?.dislikes.filter((x) => x === user?.uid)
                          .length > 0
                          ? () =>
                              undislikeComment(comment.ref, comment.netLikes)
                          : () => dislikeComment(comment.ref, comment.netLikes)
                      }
                    >
                      Dislike [{dislikeCount}]
                    </Comment.Action>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            );
          })}
      </Comment.Group>
    </>
  );
};

export default Comments;
