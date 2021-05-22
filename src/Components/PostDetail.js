import {useParams, Link } from 'react-router-dom';
import {useState, useEffect} from 'react';
import useFetch from './useFetch';
import {auth, db} from './Firebase';
import InputComment from './InputComment.js';
import { Avatar } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import DeletePost from './DeletePost.js';
import {FullScreen, useFullScreenHandle} from 'react-full-screen';

const PostDetail = () => {
    const {postid} = useParams(); 
    const [currentPost, setCurrentPost] = useState({});
    const [comments, setComments] = useState([]);
    const [deleteOpen,setDeleteOpen] = useState(false);
    const [menuToggle,setMenuToggle] = useState(false);
    const {posts} = useFetch();
    const user = auth.currentUser;

    const handle = useFullScreenHandle();

    useEffect(() => {
        if(posts[0]){
            let post = posts.filter(p => p.id === postid);
            if(post[0]){
                setCurrentPost(post[0].post)
            }
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
        {/* add view in full screen */}
        {user ? (currentPost && (
        <span className="detail__container">
            <FullScreen  handle={handle}> 
                <div className='detail__header'>
                    <span>
                        <Avatar src='static/images/avatar/1.jpg' alt={currentPost.username} />
                        <strong><Link to={`/profile/${currentPost.username}`}>{currentPost.username}</Link></strong>
                    </span>
                    <span>
                        <Tooltip title="View FullScreen"><button onClick={handle.enter}><i class="fas fa-expand-alt"></i></button></Tooltip>
                        <button onClick={() => setMenuToggle(!menuToggle)}><i class="fas fa-ellipsis-v"></i></button>
                        <div className={`details__menu ${menuToggle? '' : 'hidden'}`}>
                            {user && user.displayName === currentPost.username? (
                                <Tooltip title="Delete this post">
                                    <button className="dlt_btn" onClick={() => setDeleteOpen(true)}>
                                    <i className="fas fa-trash-alt"></i></button>
                                </Tooltip>):('')
                                // add edit here?
                            }
                        </div>
                    </span>
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
                        <span><strong><Link to={`/profile/${cmt.displayName}`}>{cmt.displayName}</Link></strong>{cmt.text}
                        </span>
                    </div>
                    ))}
                <span className='detail__commentInput'>
                <InputComment postId={postid}/>
                </span>
                </div>
            </FullScreen>
            </span> 
            )):(
                <h1>Signup</h1>
            )}

            <Modal 
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}>
                <DeletePost setDeleteOpen={setDeleteOpen} currentId={postid} username={currentPost.username}/>
            </Modal>
    </div> );
}
 
export default PostDetail;