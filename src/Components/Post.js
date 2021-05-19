import { useState, useEffect} from 'react';
import { Avatar } from "@material-ui/core";
import { db} from './Firebase'; 
import firebase from 'firebase';
import {Link} from 'react-router-dom';


const Post = ({imgUrl, id, caption, userName, user}) => {

    const [comment,setComment] = useState('');
    const [comments,setComments] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if(id){
            unsubscribe = db
            .collection("Posts")
            .doc(id)
            .collection("Comments")
            .orderBy("timestamp","asc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })  
        }
        return () => {
            unsubscribe();
        }
    }, [id]);

    const handleComment = (e) => {
        e.preventDefault();

        db.collection('Posts').doc(id).collection('Comments').add({
            text: comment,
            displayName : user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        
        setComment('');
    };

    return ( 
    <div className="post"> 
        <div className="post__header">
            
            <Avatar src="static/images/avatar/1.jpg" 
            alt={userName} 
            className="post__avatar" />
            <p><strong><Link to={`profile/${userName}`} >{userName}</Link></strong></p>
            {/* add a menu for deleting post if you are the user?  */}

        </div>        
        <img className="post__img" src={imgUrl}/>
        <div className="post__caption">
            <p><strong><Link to={`profile/${userName}`}>{userName}</Link></strong>&nbsp;&nbsp;{caption}</p>
        </div>

        <div className="post__comments">
            { comments.map(cmt => (
                <p><strong><Link to={`profile/${cmt.displayName}`} >{cmt.displayName}</Link></strong>{cmt.text}</p>
             ) )}
        </div>

        <form className="post__commentform" onSubmit={handleComment}>
            <input type='text' placeholder='Enter your comment here..' value={comment} onChange={e => setComment(e.target.value)}></input>
            <button>Post</button>
        </form>
    </div>
     );
}
 
export default Post;