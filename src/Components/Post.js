import { useState, useEffect} from 'react';
import { Avatar } from "@material-ui/core";
import { db} from './Firebase'; 
import {Link} from 'react-router-dom';
import InputComment from './InputComment.js';

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

        <InputComment postId={id}/>

    </div>
     );
}
 
export default Post;