import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegComment, FaEllipsis, FaPen, FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import type { PostType } from "../types/post.types";
import type { commentType } from "../types/comment.types";
import Comment from "../comment/Comment";
import CreateComment from "../Createcomment/CreateComment";
import Loading from "../loader/loading";

const API = "https://route-posts.routemisr.com";
export default function Post({ post, ispostdetails = false }: { post: PostType; ispostdetails: boolean }) {
  const id = post.id || post._id;
  const [isOpen, setIsOpen] = useState(false);
  const query = useQueryClient();
  const commentsQuery = useQuery({
    queryKey: ["comments", id],
    enabled: ispostdetails && Boolean(id),
    queryFn: () => axios.get(`${API}/posts/${id}/comments?page=1&limit=20`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  });
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`${API}/posts/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["profilePosts"] });
      toast.success("Post deleted");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Couldn't delete post"),
  });
  async function editPost() {
    const result = await Swal.fire({
      title: "Edit post", input: "textarea", inputValue: post.body || "",
      inputPlaceholder: "What's on your mind?", showCancelButton: true,
      confirmButtonText: "Save changes", confirmButtonColor: "#ec4899",
      inputValidator: (value) => !value?.trim() ? "Post text cannot be empty" : undefined,
    });
    if (!result.isConfirmed) return;
    const formData = new FormData();
    formData.append("body", result.value.trim());
    try {
      await axios.put(`${API}/posts/${id}`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      await query.invalidateQueries({ queryKey: ["posts"] });
      await query.invalidateQueries({ queryKey: ["profilePosts"] });
      await query.invalidateQueries({ queryKey: ["singlePost"] });
      toast.success("Post updated");
    } catch (e: any) { toast.error(e.response?.data?.message || "Couldn't update post"); }
  }
  async function deletePost() {
    const result = await Swal.fire({ title: "Delete this post?", text: "This action cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#e11d48" });
    if (result.isConfirmed) deleteMutation.mutate();
  }
  return <div className="mb-7 mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-pink-100 bg-pink-200 shadow-lg transition hover:shadow-xl">
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-3">
        <img src={post.user?.photo || "/default-user.png"} alt={post.user?.name || "User"} className="h-12 w-12 rounded-full object-cover ring-2 ring-pink-300" />
        <div><h3 className="text-sm font-bold text-gray-800">{post.user?.name || "Unknown User"}</h3><p className="mt-1 text-xs text-pink-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</p></div>
      </div>
      <div className="relative"><button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Post options" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-500"><FaEllipsis /></button>
        {isOpen && <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-pink-100 bg-white py-2 shadow-lg">
          <button type="button" onClick={() => { setIsOpen(false); void editPost(); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"><FaPen /> Edit</button>
          <button type="button" onClick={() => { setIsOpen(false); void deletePost(); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"><FaTrash /> Delete</button>
        </div>}
      </div>
    </div>
    <div className="px-5 pb-4"><p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-gray-700">{post.body}</p></div>
    {post.image && <div className="px-4 pb-4"><img src={post.image} alt="Post" className="max-h-[32rem] w-full rounded-2xl object-cover" /></div>}
    <div className="flex items-center justify-between border-t border-pink-100 px-5 py-4">
      <span className="flex items-center gap-2 text-sm text-gray-600"><FaHeart className="text-pink-500" /> {post.likesCount ?? post.likes?.length ?? 0} likes</span>
      <Link to={`/postdetails/${id}`} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-pink-600"><FaRegComment className="text-pink-500" /> {post.commentsCount ?? 0} Comments</Link>
    </div>
    {ispostdetails && <>
      <CreateComment postId={id} queryKey={["comments", id]} />
      {commentsQuery.isLoading && <Loading />}
      {commentsQuery.isError && <p className="px-5 pb-4 text-red-500">Couldn't load comments. Please refresh.</p>}
      {(commentsQuery.data?.data?.data?.comments || []).map((comment: commentType) => <Comment key={comment._id} comment={comment} postId={id} />)}
    </>}
  </div>;
}
