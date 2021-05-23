import {useState } from 'react';
import {db, storage} from './Firebase';
import firebase from 'firebase';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Compressor from 'compressorjs';

const Upload = ({userName, modalStyle, setNewpostOpen}) => {
    const [progress, setProgress] = useState(50);
    const [isUploading, setIsUploading] = useState(false);
    const [image,setImage] = useState(null);
    const [caption, setCaption] = useState('');

    const handleImage = (e) => {;
        if(e.target.files[0]){
            new Compressor(e.target.files[0], {
                quality: 0.8,
                maxHeight: 1600,
                success : (result) => {
                    console.log(result, e.target.files[0], 'size:', e.target.files[0].size, result.size );
                    setImage(result)
                }
            })
        }
    }

    const handleUpload = (e) => {
        e.preventDefault(); 

        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        setIsUploading(true);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (error) => {
                console.log(error);
            },() =>{
                storage.ref('images').child(image.name)
                .getDownloadURL().then(url => {
                    db.collection("Posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: userName
                    });
                });

                setProgress(0);
                setIsUploading(false);
                setCaption('');
                setImage(null);
                setNewpostOpen(false);
            }
            );
    }

    return ( 
    <div className='upload__container'>
            <h2>Upload Image</h2>
            <form onSubmit={handleUpload} className='upload__form'>
                <label className="upload__imageLabel" for="imageInput">Upload Image</label>
                <input id="imageInput" type="file" accept="image/png, image/jpeg" className="upload__imageInput" onChange={handleImage}></input>
                {image && <i class="fas fa-check"></i>}
                <label  className="upload__captionLabel">Caption</label>
                <textarea className="upload__textarea" onChange ={( e) => setCaption(e.target.value)}></textarea>
                <Button type='submit' disabled={!image} variant="contained" color="primary" > Post</Button>
            </form>
            {isUploading && <LinearProgress variant="determinate" value={progress} />}
    </div> 
    );
}
 
export default Upload;