import { Avatar } from "@material-ui/core"

const Post = ({imgUrl, id, caption, userName}) => {
    return ( 
    <div className="post"> 
        <div className="post__header">
            
            <Avatar src="static/images/avatar/1.jpg" 
            alt={userName} 
            className="post__avatar" />
            <p><strong>{userName}</strong></p>

            {/* add a menu for deleting post if you are the user?  */}

        </div>        
        <img className="post__img" src={imgUrl}/>
        <div className="post__caption">
            <p><strong>{userName}</strong>&nbsp;&nbsp;{caption}</p>
        </div>

        <div className="post__comments">
            {/* these are dummy comments  */}
            <p><strong>Jabiq12</strong>&nbsp; Main Adipoli</p>
            <p><strong>35iq12</strong>&nbsp; Ore Poli</p>
            <p><strong>ebs12</strong>&nbsp; Such a beautiful picture.</p>
        </div>
        <form className="post__commentform">
            <input type='text' placeholder='Enter your comment here..'></input>
            <button>Post</button>
        </form>
    </div>
     );
}
 
export default Post;