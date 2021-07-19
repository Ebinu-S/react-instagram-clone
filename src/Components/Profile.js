import {useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {Avatar} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import {auth,db} from './Firebase';
import './profile.css';
import useFetch from './useFetch.js';
import InputComment from './InputComment.js';
import Tooltip from '@material-ui/core/Tooltip';
import DeletePost from './DeletePost';

const Profile = () => {
    const {id} = useParams();
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [caption, setCaption] = useState('');
    const [imgUrl, setImgUrl] = useState(''); 
    const [comment, setComment] = useState([]); 
    const [comments, setComments] = useState([]); 
    const [currentId, setCurrentId] = useState('');
    const {posts} = useFetch();
    const width = window.screen.width;
    const user = auth.currentUser;
    const profilePic = user && user.photoURL ? user.photoURL : 'static/images/avatar/1.jpg';
    
    //find a way to get username from uid
    let uname = ''

    // get user from the username 
    const userPosts = posts.filter(t => t.post.uid === id);

    const handleClick = (caption,url,id) => {
        setOpen(true);
        setCaption(caption);
        setImgUrl(url);
        setCurrentId(id);
        getComments(id);
    };

    const getComments = (id) => {
        db.collection('posts').doc(id).collection("Comments").orderBy('timestamp','asc')
        .onSnapshot(snap => {
            setComments(
                snap.docs.map(doc => (
                    doc.data()
                ))
            );
        })
    };

    const handleClose = () => {
        setOpen(false);
        setComments([]);
        setComment('');
        setImgUrl('');
        setCaption(''); 
    };

    return ( 
    <div className="profile__container">
        {user && (
         <div className="profile__header">
             <Avatar alt={uname} src={profilePic} className="profile__avtar"/>
             <div className="profile__details">
                 <span>
                    <h2>{uname}</h2>
                    {user && user.uid === id? (<Tooltip title='settings' className="tooltip">
                    <Link to ={`/settings`}><i class="fas fa-cog"></i></Link>
                </Tooltip> ):( '')}
                 </span>
                 <p>This the Bio of {uname}. 😄😘🤩🤗🙂.</p>
             </div>

         </div>)}
        {/* user userName/ post count /settings icon */}
        {user ? (
        <div className="profile__posts">
            {userPosts.map(obj => (
                width > 600 ? (
                    <a  className='profile__obj' onClick={() => handleClick(obj.post.caption, obj.post.imageUrl,obj.id)}>
                        <img src={obj.post.imageUrl} className="profile__image"/>
                    </a>
                ):(
                    <Link to={`/postdetail/${obj.id}`} className='profile__obj'>
                        <img src={obj.post.imageUrl} className="profile__image"/>
                    </Link>
                )
        ))}
        </div>):(
            // not component, go to home
            <h1>Login / SignUp</h1>
        )}
        <Modal open={open} onClose={handleClose} className="profile_modalmain">
            <div className='profile__modal'>
              <img src={imgUrl}/>
              <div className="profile__mright">
                  <div className='profile__mheader'>
                      <span>
                        <Avatar alt={uname} src="static/images/avatar/1.jpg"/>
                        <h3><Link to={`/profile/${uname}`} onClick={handleClose}>{uname}</Link></h3>
                      </span>
                      <span>
                        {user && user.uid === id? (
                                <Tooltip title="Delete this post">
                                    <button onClick={() => setDeleteOpen(true)}>
                                    <i class="fas fa-trash-alt"></i></button>
                                </Tooltip>):('')
                                
                        }
                        <Tooltip title="Show in Detail"><Link  to={`/postdetail/${currentId}`}><i class="fas fa-expand"></i></Link></Tooltip>
                      </span>
                  </div>
                  <div className='profile__mdetails'>
                      <div className="profile_caption">
                           <h4><Link to={`/profile/${id}`} onClick={handleClose}>{uname}</Link></h4> 
                        <p>{caption}</p><p>I am commenting to verify that this comment does not overflow the screen. I hope it odesnot overflow and should i use word wrap. if not then what ? Think I should make usure that my width and all are correct id if it spans this width it should go to next Line</p>
                      </div>
                      {/* comments */}
                      <div className='profile_allcomments'>
                        {comments.map(cmt => (
                            <div className="profile_mComment">
                                <div className="profile__mComment_detail">
                                    <Avatar alt={cmt.displayName} src="static/images/avatar/1.jpg" className="profile__mCommentAvatar"/>
                                    <span>
                                        <strong><Link to={`/profile/${cmt.uid}`} onClick={handleClose}>{cmt.displayName}</Link></strong>{cmt.text}
                                    </span>
                                </div>    
                            </div>
                        ))}
                      </div>
                  <div className='Profile__iComment'>
                      <InputComment postId={currentId}/>
                  </div>
                  </div>
              </div>  
            </div>
        </Modal>

        {/* delete post modal  */}
        <Modal 
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}>
              <DeletePost currentId={currentId} setOpen={setOpen} setDeleteOpen={setDeleteOpen}/>
        </Modal>

    </div> );
}
 
export default Profile;