import {useState, useEffect} from 'react';
import Post from './Components/Post.js';
import './app.css';
import {db, auth} from './Components/Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import signUpImage from './images/signup.svg';
import LoginImage from './images/login.svg';
import Upload from './Components/Upload.js';
import Posts from './Components/Posts.js';
import Profile from './Components/Profile.js';
import { BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';


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
        setUser(authUser);
          if(authUser.displayName){
            // {-}
          }else{
             return authUser.updateProfile({
              displayName: userName
            });
          }
      }
      else{
        setUser(null);
      }
    })

    return () => unsubscribe();

  },[user,userName]);

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
    auth.createUserWithEmailAndPassword(email, password).then(authUser => {
      setUser(authUser);
      return authUser.user.updateProfile({
        displayName: userName
      });
    }).catch(err => {
      alert(err);
      // todo: popup error message
    })
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


  const classes = useStyles();
  return (
    <div className="App">
      <Router >
      <nav>
        <Link to='/' className='app__navLink'><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/></Link> 
        <div className="app__navLeft">
 
          {user ? (
            <span>
            <button className='app__btn bg_blue' onClick={() => {setNewpostOpen(true); console.log('hmm');}}> <i class="fas fa-plus"></i> New Post</button>     
            <button variant='contained' className='app__btn' onClick={() => auth.signOut()}>Logout</button>
            </span>
          ):(
            <span>
            <button className='app__btn' onClick={() => setSigninOpen(true)}>Log In</button>
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

        <Switch>
          <Route exact path="/">
            <Posts posts={posts} user={user} />
          </Route>
          <Route exact path='/profile/:uname'>
            <Profile posts={posts}/>
          </Route>
        </Switch>

      </Router>
    </div> 
  );
}

export default App;
   