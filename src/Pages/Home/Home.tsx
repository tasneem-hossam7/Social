import axios from 'axios'
import type { PostType } from '../../types/post.types';
import Post from '../../post/Post';
import Loading from '../../loader/loading';
import { useQuery } from '@tanstack/react-query';
import CreatePost from '../../createPost/CreatePost';
import {Helmet} from "react-helmet";

export default function Home() {

  //const [allPosts, setAllPosts] = React.useState<PostType[]>([]);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(false);

  //useEffect(() => {
   // getAllPosts();
  //}, []);

  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts?sort=created' , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  //     .then(response => {
  //       console.log(response.data.data.posts);
  //       setAllPosts(response.data.data.posts);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       setError(true);
  //     });
   };

 const { data, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,  //return a promise
  })


if(isLoading){
 return <Loading/>
}

if(isError){
  return  <h1 className="text-red-500">Error...!</h1>
  
}



  const posts: PostType[] = data?.data?.data?.posts || [];

  return <>
  <Helmet>
      <title>Home</title>
    </Helmet>
     <div className='pt-4'>
  <CreatePost/>
    </div>


    <div className="my-8 pt-20">
      {posts.map((post: PostType) => (
       <Post post={post} key={post._id} ispostdetails={false} />
       ))}
      {posts.length === 0 && <p className="mx-auto max-w-2xl rounded-2xl bg-pink-50 p-6 text-center text-gray-500">No posts to show yet. Create the first post!</p>}
    </div>
 </>
}

