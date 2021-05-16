import {useState, useEffect} from 'react';
import Post from './Components/Post.js';
import './app.css';

function App() {
  
  return (
    <div className="App">
      <nav>
        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/>
        <div className="app__navLeft">
          
          {/* show only if user not logged in */}
          <button className='app__btn'>Sign In</button>
          <button className='app__btn bg_blue'>Sign Up</button>
          
          {/* show if logged in */}
          {/* <button className='app__btn bg_blue'><i class="fas fa-plus"></i> New Post</button>          
          <button variant='contained' className='app__btn'>Logout</button> */}
        </div>  
      </nav>

      <div className="container">
        <Post imageUrl={'https://images.unsplash.com/photo-1621109493185-3f00a717c61b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'}/>
        <Post 
        imageUrl={'https://images.unsplash.com/photo-1621090162436-78df0d317942?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80'}
        />
      </div>
    </div> 
  );
}

export default App;
   