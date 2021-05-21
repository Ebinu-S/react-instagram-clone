import {useParams, Link } from 'react-router-dom';
import {useState, useEffect} from 'react';
import useFetch from './useFetch';
import {db} from './Firebase';
import InputComment from './InputComment.js';
import { Avatar } from "@material-ui/core";

const PostDetail = () => {
    const {postid} = useParams(); 
    const [currentPost, setCurrentPost] = useState({});
    const [comments, setComments] = useState([]);
    const {posts} = useFetch();

    useEffect(() => {
        if(posts[0]){
            let post = posts.filter(p => p.id === postid);
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

    return ( 
    <div >
        {/* display selected post in details  */}
        {/* add view in full screen */}
        {currentPost && (
        <span className="detail__container">
            <div className='detail__header'>
                <Avatar src='static/images/avatar/1.jpg' alt={currentPost.username} />
                <strong><Link to={`/profile/${currentPost.username}`}>{currentPost.username}</Link></strong>
            </div>
            <img src={currentPost.imageUrl} className='detail__image'/>
            <div className='detail__captionContainer'>
                <p>
                    <strong><Link to={`/profile/${currentPost.username}`}>{currentPost.username}</Link></strong>
                    {currentPost.caption}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sagittis neque sit amet diam faucibus gravida. Nulla blandit dui sodales metus facilisis, ac ultricies mauris congue. Nulla a dolor id lacus vestibulum tempor vel vitae tellus. In commodo iaculis urna, eu tempus erat malesuada cursus. Pellentesque tincidunt mattis nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi molestie erat neque, id bibendum velit sollicitudin eget.
                </p>
            </div>
            <div className='detail__commentContainer'>{comments.map(cmt => (
                <div>
                    <Avatar src='static/images/avatar/1.jpg' alt={cmt.displayName}/>
                    <span><strong>{cmt.displayName}</strong>{cmt.text}
                    </span>
                </div>
                ))}
            <span className='detail__commentInput'>
            <InputComment postId={postid}/>
            </span>
            </div>
        </span> 
        )}
    </div> );
}
 
export default PostDetail;