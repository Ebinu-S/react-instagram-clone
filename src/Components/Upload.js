import {useState } from 'react';
import {db, storage} from './Firebase';
import firebase from 'firebase';

const Upload = ({userName, modalStyle, paper, setNewpostOpen}) => {
    const [progress, setProgress] = useState(50);
    const [isUploading, setIsUploading] = useState(false);
    const [image,setImage] = useState(null);
    const [caption, setCaption] = useState('');

    const handleImage = (e) => {;
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    console.log('uname',userName);

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

    console.log(caption);

    return ( 
    <div className={`${paper} upload__container`} style={modalStyle}>
            <h2>Upload Image</h2>
            <form onSubmit={handleUpload} className='upload__form'>
                <label className="upload__imageLabel">Upload Image</label>
                <input type="file" className="upload__image" onChange={handleImage}></input>
                <label  className="upload__captionLabel">Caption</label>
                <textarea className="upload__textarea" onChange ={(e) => setCaption(e.target.value)}></textarea>
                <button type='submit'>Post</button>
            </form>
            {isUploading && <progress className="upload__progress" value={progress}  max="100" />}
    </div> 
    );
}
 
export default Upload;