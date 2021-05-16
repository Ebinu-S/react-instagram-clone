import {useState, useEffect} from 'react';
import Post from './Components/Post.js';
import './app.css';
import {db, auth} from './Components/Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import signUpImage from './images/signup.svg';


function App() {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [userName,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');

  //
  useEffect(() => {
    const fn = auth.onAuthStateChanged(authUser => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
          if(!authUser.userName){
            return authUser.updateProfile({
              userName: userName
            });
          }
      }
      else{
        setUser(null);
      }
    })

    return () => fn;

  },[user,userName]);

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


  function getModalStyle() {
    return {
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      height:'500px',
      width:'700px',
      boxShadow: theme.shadows[5],
      borderRadius: `10px`,
      overflow: `hidden`
    },
  }));


  const HandleSignUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then(authUser => {
      return authUser.user.updateProfile({
        userName: userName
      })
    }).catch(err => {
      alert(err);
      // todo: popup error message
    })
    setOpen(false);
  }

  const classes = useStyles();
  
  console.log(user);

  return (
    <div className="App">
      <nav>
        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/>
        <div className="app__navLeft">
          
          {user ? (
            <span>
            <button className='app__btn bg_blue'><i class="fas fa-plus"></i> New Post</button>          
            <button variant='contained' className='app__btn'>Logout</button>
            </span>
          ):(
            <span>
            <button className='app__btn' >Sign In</button>
            <button className='app__btn bg_blue' onClick={() => setOpen(true)}>Sign Up</button>
            </span>
          )
          }

          {/* signup Modal */}
          <Modal open={open}
          onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <div className="app_modal">
                <div className='app__modalRight'>
                  <img src={signUpImage} className='app_signupimg'/>
                </div>
                <div className='app__modalLeft'>
                  <h3>Sign Up</h3>
                  <form className='app__form' onSubmit={HandleSignUp}>
                    <label>Username</label>
                    <input type='text' onChange={(e) => setUserName(e.target.value)}></input>
                    <label>Email</label>
                    <input type='email' onChange={(e) => setEmail(e.target.value)}></input>
                    <label>Password</label>
                    <input type='password' onChange={(e) => setPassword(e.target.value)}></input>
                    <button>Submit</button>
                  </form>
                </div></div>
            </div>  
          </Modal> 

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
   