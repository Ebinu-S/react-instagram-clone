import Button from '@material-ui/core/Button';
import {db} from './Firebase';
import {useHistory } from 'react-router-dom';

const DeletePost = ({currentId, setDeleteOpen, setOpen, username}) => {
    let history = useHistory();

    const handleDelete = () => {
        db.collection('Posts').doc(currentId).delete().then(() => {
            setDeleteOpen(false);
            setOpen && setOpen(false);
            username && history.push(`/profile/${username}`);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
    <span className="profile__mDelete">
        <h2>Are you sure?</h2>
        <span>
        <Button variant="contained" color="secondary" onClick={handleDelete}>Yes</Button>
        <Button variant="contained" color="primary" onClick={() => setDeleteOpen(false)}>No</Button>
        </span>
    </span>
    )
}
 
export default DeletePost;