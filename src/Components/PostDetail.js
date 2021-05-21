import {useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import useFetch from './useFetch';
import {db} from './Firebase';
import InputComment from './InputComment.js';

const PostDetail = () => {
    const {postid} = useParams(); 
    const [currentPost, setCurrentPost] = useState({});
    const [comments, setComments] = useState([]);
    const {posts} = useFetch();

    console.log(posts);
    useEffect(() => {
        if(posts[0]){
            let post = posts.filter(p => p.id === postid);
            console.log(post);
            setCurrentPost(post[0].post)
        }

    },[posts])

    useEffect(() => {
        let unsubscribe;
        if(postid){
            unsubscribe = db
            .collection("Posts")
            .doc(postid)
            .collection("Comments")
            .orderBy("timestamp","asc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })  
        }
        return () => {
            unsubscribe();
        }
    }, [postid]);

    console.log(comments);
    return ( 
    <div className="detail__container">
        {/* display selected post in details  */}
        {currentPost && (
        <span>
            <img src={currentPost.imageUrl} className='detail__image'/>
            <div><strong>{currentPost.username}</strong>{currentPost.caption}</div>
            <div>{comments.map(cmt => (
                <span><strong>{cmt.displayName}</strong>{cmt.text}</span>
                ))}
            </div>
            <InputComment postId={postid}/>
        </span> 
        )}
    </div> );
}
 
export default PostDetail;