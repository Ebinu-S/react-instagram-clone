import {useState} from 'react';
import firebase from 'firebase';
import {db, auth} from './Firebase.js';
import './inputComment.css';

const InputComment = ({postId}) => {
    const [comment, setComment] = useState('');

    const handleComment = (e) => {
        e.preventDefault();

        db.collection('Posts').doc(postId).collection('Comments').add({
            text: comment,
            displayName : auth.currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        
        setComment('');
    };

    return (
    <form className="input__commentform" onSubmit={handleComment}>
        <input type='text' placeholder='Enter your comment here..' value={comment} onChange={e => setComment(e.target.value)}></input>
        <button>Post</button>
    </form>
    );
}
 
export default InputComment;