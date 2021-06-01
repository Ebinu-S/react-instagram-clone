import './settings.css';
import {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {Button, Input, TextField, Snackbar} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {auth, storage, db} from './Firebase';
import {Link } from 'react-router-dom';
import Compressor from 'compressorjs';

const Settings = () => {
    const user = auth.currentUser;
    const username = user ? user.displayName : 'nil';
    const uid = user && user.uid;
    const profilePic = user && user.photoURL ? user.photoURL : 'static/images/avatar/1.jpg';
    
    const [currentUsername, setCurrentUsername] = useState('');
    const [bio, setbio] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState(0);

    const handleChangeUsername = (e) =>{
        e.preventDefault();

        console.log(currentUsername);
        if(currentUsername.length > 3){
            user.updateProfile({
                displayName : currentUsername
            }).then( () => {
                snackManager('Username Updated!', 'success');
            }).catch( error => {
                console.log(error);
            })
        }
    }

    const handleChangeImage = (e) => {
        if(e.target.files[0]){
            new Compressor(e.target.files[0], {
                quality: 0.9,
                Height: 150,
                Width: 150,
                success : (result) => {
                    setAvatar(result)
                }
            })
        }
    }

    const handleAvatar = (e) => {
        e.preventDefault(); 

        // setCaption(caption.replace("\r\n", "\\r\\n"));
        const uploadTask = storage.ref(`profilePic/${avatar.name}`).put(avatar);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (error) => {
                console.log(error);
            },() =>{
                storage.ref('profilePic').child(avatar.name)
                .getDownloadURL().then(url => {
                    user.updateProfile({
                        photoURL : url,
                    }).then(() => {
                        console.log('successs');
                    }).catch(error => {
                        console.log(error);
                    })
                })
            }
            );
    }
    
        const handleBio = (e) => {
            e.preventDefault(); 
            db.collection('users').doc(uid).set({
                bio: bio,
                username: username
            }).then( () => {
                snackManager('Bio Successfully added!', 0);
            }).catch(error => {
                snackManager(error,1);
            })
        }

    const handlePassword = (e) => {
        e.preventDefault(); 

        if(password1 === password2 ) {
            // set new password
        }else{
            alert('monja')
        }
        console.log('hmm');
    }

    /*
    Calls Snackbar
    @params {message} message to be displayed
    @params {severity} severity of the message 
                        0 - success 
                        1 - error
                        2 - info
                        3 - warning
    */
    const snackManager = (message, severity) =>{
        setMessage(message);

        switch (severity){
            case 0: 
                severity = 'success'; break;
            case 1:
                severity = 'error'; break;
            case 2:
                severity = 'warning'; break;
            default:
                severity = 'info'; break;
        }

        setSeverity(severity);
        setSnackOpen(true);
    }

    console.log(user);

    return ( 
    <div className="settings">
        <div className='settings__container'>
            <div className = "settings__userDisplay">
                <h1>Settings</h1>
                    {/* make these links */}
                    <Link to=''>
                        <Avatar src={profilePic} alt={username} />
                        <h2 className='ml-1'>{username}</h2>
                    </Link>
            </div>

            <div className='settings__CuserName w-43'>
                <h3 className='mt-2'>Change Username</h3>
                <form onSubmit={handleChangeUsername}>
                    <TextField variant='outlined' label='Enter your new Username.' value={currentUsername} onChange={e => setCurrentUsername(e.target.value)}/>
                    <Button varient="contained" color="primary" type='submit'>Update</Button>
                </form>
            </div>

            <div className='settings__pp w-43'>
                <h3 className='mt-2'>Update Profile Picture</h3>
                <form onSubmit={handleAvatar}>
                    <Input id="imageInput" type="file" accept="image/png, image/jpeg" onChange={handleChangeImage}/>
                    <Button varient="contained" color="primary" type='submit'>Update</Button>
                </form>
            </div>

            <div className='settings__Cbio w-43'>
                {/* ?fix overflow */}
                <h3 className='mt-2 mb-1'>Add Bio</h3>
                <form onSubmit={handleBio}>
                    <textarea maxLength='251' value={bio} onChange={e => setbio(e.target.value)}></textarea>
                    <Button varient="contained" color="primary" type='submit'>Update</Button>
                </form>
            </div>

            <div className='settings__Cpassword w-43'>
                <h3 className='mt-2'>Change Password</h3>
                <form onSubmit={handlePassword}>
                    <TextField varient='outlined' type="password" label='Enter your new password' value={password1} onChange={e => setPassword1(e.target.value)}/>
                    <TextField className='mt-1' varient='outlined' type="password" label='Enter your new password again' value={password2} onChange={e => setPassword2(e.target.value)}/>
                    <Button varient="contained" className='mt-1' color="primary" type='submit'>Update</Button>
                </form>
            </div>      

            <div className='settings_danger w-43 mb-2'>
                <h3 className='mt-2 mb-1'>Danger</h3>
                <span>
                    <Button varient="outlined" color="secondary">Disable Account</Button>
                    <Button varient="contained" color="secondary">Delete Account</Button>
                </span>
            </div>
        </div>
        <Snackbar severity={severity} open={snackOpen} autoHideDuration={3000} onClose={e => setSnackOpen(false)}>
            <Alert variant="filled" severity={severity}>
                {message}
            </Alert>
        </Snackbar>  
    </div>);
}
 
export default Settings;
