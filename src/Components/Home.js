import welcomeSvg from '../images/welcome.svg';
import './home.css';

const Home = ({setSigninOpen, setOpen}) => {
    return ( 
    <div className="home__container">
        <img src={welcomeSvg} className="home__left"/>
        <div className="home__right">
            <h1>Please login or Sign up to browse feed.</h1>
            <span>
                <button onClick={() => setSigninOpen(true)} className="home__signin">Sign In</button>
                <button onClick={() => setOpen(true)} className="home__signup">Sign Up</button>
            </span>
        </div>
    </div> );
}
 
export default Home;