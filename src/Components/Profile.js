import {useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {Avatar} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import {auth,db} from './Firebase';
import './profile.css';
import useFetch from './useFetch.js';
import InputComment from './InputComment.js';
import Home from './Home';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

const Profile = () => {
    const {uname} = useParams();
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

    const handleDelete = () => {
        db.collection('Posts').doc(currentId).delete().then(() => {
            console.log('delted');
            setDeleteOpen(false);
            setOpen(false);
        }).catch(error => {
            console.log(error);
        })
    }

    return ( 
    <div className="profile__container">
        {user && (
         <div className="profile__header">
             <Avatar alt={uname} src="static/images/avatar/1.jpg" className="profile__avtar"/>
             <div className="profile__details">
                 <h2>{uname}</h2>
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
                        {user && user.displayName === uname? (
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
                           <h4><Link to={`/profile/${uname}`} onClick={handleClose}>{uname}</Link></h4> 
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
              </div>  
            </div>
        </Modal>

        <Modal 
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}>
              <span className="profile__mDelete">
                  <h2>Are you sure?</h2>
                  <span>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>Yes</Button>
                    <Button variant="contained" color="primary" onClick={() => setDeleteOpen(false)}>No</Button>
                  </span>
              </span>
        </Modal>

        
    </div> );
}
 
export default Profile;