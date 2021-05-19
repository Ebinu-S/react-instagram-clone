import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar} from '@material-ui/core';
import './profile.css';
import {db} from './Firebase';

const Profile = ({posts}) => {
    const {uname } = useParams();
    
    const UserPosts = posts.filter(t => t.post.username === uname);

    return ( 
    <div className="profile__container">
        {/* header
            avathar name ?likes?
        posts of the use sort but descenting timestamp
         */}
         <div className="profile__header">
             <Avatar alt={uname} src="static/images/avatar/1.jpg" className="profile__avtar"/>
             <div className="profile__details">
                 <h2>{uname}</h2>
                 <p>This the Bio of this Profile.</p>
             </div>
         </div>
        {/* user userName/ post count /settings icon */}
        <div className="profile__posts">
            {UserPosts.map(obj => (
                <img src={obj.post.imageUrl} className="profile__image"/>
            ))}
        </div>
 

    </div> );
}
 
export default Profile;