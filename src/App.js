import {useState, useEffect} from 'react';
import Post from './Components/Post.js';
import './app.css';
import {db, auth} from './Components/Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import signUpImage from './images/signup.svg';
import LoginImage from './images/login.svg';
import Upload from './Components/Upload.js';


function App() {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const [newpostOpen,setNewpostOpen] = useState(false);
  const [userName,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState(''); 

  //
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
          if(authUser.displayName){
            // add 
            console.log(authUser.displayName,'yes');
          }else{
             return authUser.updateProfile({
              displayName: userName
            });
            console.log(authUser.displayName,'no');
          }
      }
      else{
        setUser(null);
      }
    })

    return () => unsubscribe();

  },[user,userName]);

  user && console.log(user,user.displayName);
  //populate posts component
  useEffect(() => {
    db.collection('Posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
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
      boxShadow: theme.shadows[5],
      borderRadius: `10px`,
      overflow: `hidden`
    },
  }));


  const handleSignUp = (e) => {
    e.preventDefault();
    console.log(userName, "signup", password);
    auth.createUserWithEmailAndPassword(email, password).then(authUser => {
      setUser(authUser);
      return authUser.user.updateProfile({
        displayName: userName
      });
    }).catch(err => {
      alert(err);
      // todo: popup error message
    })
    console.log(userName, user,"signup_end", password);
    setOpen(false);
  }

  const handleSignIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email,password).catch(error => {
      //todo add error message handler
      alert(error);
    })

    setSigninOpen(false);
  }

  user && console.log(user.displayName);

  const classes = useStyles();
  return (
    <div className="App">
      <nav>
        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/>
        <div className="app__navLeft">
 
          {user ? (
            <span>
            <button className='app__btn bg_blue' onClick={() => {setNewpostOpen(true); console.log('hmm');}}> <i class="fas fa-plus"></i> New Post</button>     
            <button variant='contained' className='app__btn' onClick={() => auth.signOut()}>Logout</button>
            </span>
          ):(
            <span>
            <button className='app__btn' onClick={() => setSigninOpen(true)}>Sign In</button>
            <button className='app__btn bg_blue' onClick={() => setOpen(true)}>Sign Up</button>
            </span>
          )
          }
        </div>  
      </nav>
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
                  <form className='app__form' onSubmit={handleSignUp}>
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

        {/* sign in modal */}
          <Modal
          open={signinOpen}
          onClose={() => setSigninOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <div className="app_modal">
                <div className='app__modalRight'>
                  <img src={LoginImage} className='app_loginimg'/>
                </div>
                <div className='app__modalLeft'>
                  <h3>Sign In</h3>
                  <form className='app__form' onSubmit={handleSignIn}>
                    <label>Email</label>
                    <input type='email' onChange={(e) => setEmail(e.target.value)}></input>
                    <label>Password</label>
                    <input type='password' onChange={(e) => setPassword(e.target.value)}></input>
                    <button>Submit</button>
                  </form>
                </div></div>
            </div>  
          </Modal>

          {/* newpost modal  */}
          <Modal
          open={newpostOpen}
          onClose={() => setNewpostOpen(false)}>
            {user && <Upload userName={user.displayName} modalStyle={modalStyle} paper={classes.paper} setNewpostOpen={setNewpostOpen}/>}
          </Modal>



      <div className="container">

          {user? (posts.map(({id, post}) =>{
            return <Post key={id} id={id} caption={post.caption} userName={post.username} imgUrl={post.imageUrl} user={user} />
          } ) ):(
            <h1>Please login or Sign up to browse feed.</h1>
          )
        }

      </div>
    </div> 
  );
}

export default App;
   