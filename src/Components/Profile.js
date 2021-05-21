import {useState, useEffect } from 'react';
import {useParams, Link} from 'react-router-dom';
import {Avatar} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import {db} from './Firebase';
import './profile.css';
import useFetch from './useFetch.js';
import InputComment from './InputComment.js';

const Profile = () => {
    const {uname} = useParams();
    const [open, setOpen] = useState(false);
    const [caption, setCaption] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [comment, setComment] = useState([]); 
    const [comments, setComments] = useState([]); 
    const [currentId, setCurrentId] = useState('');
    const {posts} = useFetch();
    
    // get user from the username 

    const userPosts = posts.filter(t => t.post.username === uname);

    const handleClick = (caption,url,id) => {
        setOpen(true);
        setCaption(caption);
        setImgUrl(url);
        setCurrentId(id);
        getComments(id);
    };

    const getComments = (id) => {
        db.collection('Posts').doc(id).collection("Comments").orderBy('timestamp','asc')
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
    }

    // console.log(comments);

    return ( 
    <div className="profile__container">

         <div className="profile__header">
             <Avatar alt={uname} src="static/images/avatar/1.jpg" className="profile__avtar"/>
             <div className="profile__details">
                 <h2>{uname}</h2>
                 <p>This the Bio of this Profile.</p>
             </div>
         </div>
        {/* user userName/ post count /settings icon */}
        <div className="profile__posts">
            {userPosts.map(obj => (
                <a  className='profile__obj' onClick={() => handleClick(obj.post.caption, obj.post.imageUrl,obj.id)}>
                    <img src={obj.post.imageUrl} className="profile__image"/>
                </a>
            ))}
        </div>

        <Modal open={open} onClose={handleClose} className="profile_modalmain">
            <div className='profile__modal'>
              <img src={imgUrl}/>
              <div className="profile__mright">
                  <div className='profile__mheader'>
                      <span>
                        <Avatar alt={uname} src="static/images/avatar/1.jpg"/>
                        <h3>{uname}</h3>
                      </span>
                      <Link to={`/postdetail/${currentId}`}><i class="fas fa-expand"></i></Link>
                  </div>
                  <div className='profile__mdetails'>
                      <div className="profile_caption">
                        <Avatar alt={uname} src="static/images/avatar/1.jpg"/> <h4>{uname}</h4> 
                        <p>{caption}</p>
                      </div>
                      {/* comments */}
                      {comments.map(cmt => (
                          <div className="profile_mComment">
                              <div className="profile__mComment_detail">
                                  <Avatar alt={cmt.displayName} src="static/images/avatar/1.jpg" className="profile__mCommentAvatar"/>
                                  <span>
                                      <strong><Link to={`/profile/${cmt.displayName}`} onClick={handleClose}>{cmt.displayName}</Link></strong>{cmt.text}
                                  </span>
                              </div>    
                          </div>
                      ))}
                  </div>
                  <InputComment postId={currentId}/>
                  {/* add comment form */}
              </div>  
            </div>
        </Modal>

    </div> );
}
 
export default Profile;