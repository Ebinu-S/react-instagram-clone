import Post from './Post.js';
import Home from './Home';

const Posts = ({user, posts, setSigninOpen, setOpen}) => {
    return ( 
        <div className="posts__container">
            {user? (posts.map(({id, post}) =>{
                return <Post key={id} id={id} caption={post.caption} userName={post.username} imgUrl={post.imageUrl} user={user} />
            } ) ):(
                <Home setSigninOpen={setSigninOpen} setOpen={setOpen}/>
            )
            }
        </div>
    );
}

export default Posts;