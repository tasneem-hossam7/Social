import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Post from "../../post/Post";
import Loading from "../../loader/loading";
import type { PostType } from "../../types/post.types";

export default function PostDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["singlePost", id], enabled: Boolean(id),
    queryFn: () => axios.get(`https://route-posts.routemisr.com/posts/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
  });
  if (isLoading) return <Loading />;
  const post: PostType | undefined = data?.data?.data?.post || data?.data?.data;
  if (isError || !post) return <div className="mx-auto mt-28 max-w-xl text-center"><p className="mb-4 font-bold text-red-500">Couldn't load this post.</p><Link to="/" className="text-pink-500 underline">Back to Home</Link></div>;
  return <><Helmet><title>Post Details</title></Helmet><main className="min-h-screen bg-pink-50 px-3 pb-10 pt-24"><Post post={post} ispostdetails /></main></>;
}
