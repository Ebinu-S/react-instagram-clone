import { Avatar } from "@material-ui/core"

const Post = ({imageUrl}) => {
    return ( 
    <div className="post"> 
        <div className="post__header">
            
            <Avatar src="static/images/avatar/1.jpg" 
            alt="Ebinu Suneer" 
            className="post__avatar" />
            <p><strong>Ebinu Suneer</strong></p>

        </div>        
        <img className="post__img" src={imageUrl}/>
        <div className="post__caption">
            <p><strong>Ebinu Suneer</strong>&nbsp;&nbsp;The greatest glory in living lies not in never falling, but in rising every time we fall.</p>
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