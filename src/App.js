import {useState, useEffect} from 'react';
import './app.css';
import {db, auth} from './Components/Firebase';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import signUpImage from './images/signup.svg';
import LoginImage from './images/fall.svg';
import Upload from './Components/Upload.js';
import Posts from './Components/Posts.js';
import Profile from './Components/Profile.js';
import PostDetail from './Components/PostDetail';
import useFetch from './Components/useFetch';
import Settings from './Components/Settings';
import Tooltip from '@material-ui/core/Tooltip';

function App() {

  const {posts} = useFetch();
  const [user, setUser] = useState(null);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const [newpostOpen,setNewpostOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  
  let errorText = '';

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
      console.log(error);
      errorText = error.code;
      setIsError(true);
      alert(error)
    })
    setSigninOpen(false);
  }

  const handleLogout = () => {
    auth.signOut();
    //todo usehistory.push('/');
  }

  // console.log(user);
  const classes = useStyles();
  return (
    <div className="App">
      <Router >
      <nav>
        <Link to='/' className='app__navLink'><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/></Link> 
        <div className="app__navLeft">
 
          {user && (
            window.screen.width > 600 ?(
            <span>
              <Tooltip title='Add new post' className="tooltip">
                <button className='app__btn' onClick={() => {setNewpostOpen(true)}}> <i class="fas fa-plus"></i></button>     
              </Tooltip>
              <Tooltip title={user.displayName} className="tooltip">
                <Link className='app__btn' to={`/profile/${user.displayName}`}><i class="far fa-user-circle"></i></Link>
              </Tooltip>
              <button variant='contained' className='app__btn btn_bgRed' onClick={handleLogout}>Logout</button>
            </span>
            ):(
             <button onClick={() => {setMobileMenuOpen(true); console.log('hmm')}} className="app__navHam"><i class="fas fa-bars"></i></button>
            ))
          }
        </div>  
      </nav>
          {/* signup Modal */}
          <Modal open={open}
          onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <div className="app_modal">
                <div className='app__modalLeft'>
                  <img src={signUpImage} className='app_signupimg'/>
                </div>
                <div className=' app__modalRight'>
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
                <div className='app__modalLeft'>
                  <img src={LoginImage} className='app_loginimg'/>
                </div>
                <div className='app__modalRight'>
                  <h1>Welcome back!!</h1>
                  <form className='app__form' onSubmit={handleSignIn}>
                    <label>Email</label>
                    <input type='email' onChange={(e) => setEmail(e.target.value)}></input>
                    <label>Password</label>
                    <input type='password' onChange={(e) => setPassword(e.target.value)}></input>
                    <button>Submit</button>
                  </form>
                  <p>{errorText}</p>
                </div></div>
            </div>  
          </Modal>

          {/* newpost modal  */}
          <Modal
          open={newpostOpen}
          onClose={() => setNewpostOpen(false)}>
            {user && <Upload userName={user.displayName} setNewpostOpen={setNewpostOpen}/>}
          </Modal>

          {/* mobile menu modal */}
          {user && <Modal 
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}>
            <div className='app__mobileMenu'>
                <button className='app__btn' onClick={() => {setNewpostOpen(true); console.log('hmm');}}>Add new post</button>     
                <Link className='app__btn border-top' to={`/profile/${user.displayName}`}>Profile </Link>
                <button variant='contained' className='app__btn btn_bgRed border-top' onClick={handleLogout}>Logout</button>
            </div>
          </Modal>}

        <Switch>
          <Route exact path="/">
            <Posts posts={posts} user={user} setSigninOpen={setSigninOpen} setOpen={setOpen}/>
          </Route>
          <Route exact path='/profile/:uname'>
            <Profile posts={posts}/>
          </Route>
          <Route exact path='/postdetail/:postid'>
            <PostDetail/>
          </Route>
          <Route exact path='/settings'>
            <Settings />
          </Route>
        </Switch>
        
        <footer>
          <h1>This is a footer <a href='https://github.com/Ebinu-S' target="_blank">My Github</a></h1>
        </footer>
      </Router>
    </div> 
  );
}

export default App;
   