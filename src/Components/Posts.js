import Post from './Post.js';

const Posts = ({user, posts}) => {
    return ( 
        <div className="posts__container">
            {user? (posts.map(({id, post}) =>{
                return <Post key={id} id={id} caption={post.caption} userName={post.username} imgUrl={post.imageUrl} user={user} />
            } ) ):(
                <h1>Please login or Sign up to browse feed.</h1>
            )
            }
        </div>
     );
}
 
export default Posts;