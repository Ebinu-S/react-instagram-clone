import './settings.css';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import {Button} from '@material-ui/core';
import {auth} from './Firebase';

const Settings = () => {
    const user = auth.currentUser;
    const username = user ? user.displayName : 'nil';

    const handleChangeUsername = (e) =>{
        e.preventDefault();
    }

    return ( 
    <div className="settings">
        <div className='settings__container'>
            <div className = "settings__userDisplay">
                <h1>Settings</h1>
                <span>
                    {/* make these links */}
                    <Avatar src='static/images/avatar/1.jpg' alt={username} />
                    <h2 className='ml-1'>{username}</h2>
                </span>
            </div>

            <div className='settings__CuserName w-43'>
                <h3 className='mt-2'>Change Username</h3>
                <form onSubmit={handleChangeUsername}>
                    <TextField variant='outlined' label='Enter your new Username.' />
                    <Button varient="contained" color="primary">Update</Button>
                </form>
            </div>

            <div className='settings__Cpassword w-43'>
                <h3 className='mt-2'>Change Password</h3>
                <form onSubmit={handleChangeUsername}>
                    <TextField varient='outlined' type="password" label='Enter your old password' />
                    <TextField varient='outlined' type="password" label='Enter your new password' />
                    <TextField varient='outlined' type="password" label='Enter your new password again' />
                    <Button varient="   " color="primary">Update</Button>
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
    </div>);
}
 
export default Settings;

// Change Username
// Change Password
// Delete Account
// DIsable Account