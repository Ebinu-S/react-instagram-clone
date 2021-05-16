import {useState, useEffect} from 'react';
import Post from './Components/Post.js';
import './app.css';
import {db, auth} from './Components/Firebase';

function App() {
  
  const [posts, setPosts] = useState([]);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState('');

  //populate posts component
  useEffect(() => {
    db.collection('Posts').onSnapshot(snapshot => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        }))
      )
    })
  }, []);

  const HandleSignIn = () => {

  }
  
  return (
    <div className="App">
      <nav>
        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/>
        <div className="app__navLeft">
          
          {/* show only if user not logged in */}
          <button className='app__btn' onClick={HandleSignIn}>Sign In</button>
          <button className='app__btn bg_blue'>Sign Up</button>
          
          {/* show if logged in */}
          {/* <button className='app__btn bg_blue'><i class="fas fa-plus"></i> New Post</button>          
          <button variant='contained' className='app__btn'>Logout</button> */}
        </div>  
      </nav>

      <div className="container">

          {posts.map(({id, post}) =>{
            return <Post key={id} id={id} caption={post.caption} userName={post.userName} imgUrl={post.imgUrl} />
          } )}

      </div>
    </div> 
  );
}

export default App;
   