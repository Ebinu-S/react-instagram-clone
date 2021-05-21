import {useState, useEffect} from 'react';
import {db} from './Firebase';

const useFetch = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('Posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
            setPosts(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data()
                }))
            )
        });

        return () => unsubscribe();
        
    },[]);
    return {posts};
}


 
export default useFetch;