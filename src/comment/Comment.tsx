import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa";
import type { commentType } from "../types/comment.types";

export default function Comment({ comment, postId }: { comment: commentType; postId: string }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content || "");
  const query = useQueryClient();
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
  const invalidate = () => {
    query.invalidateQueries({ queryKey: ["comments", postId] });
    query.invalidateQueries({ queryKey: ["singlePost"] });
    query.invalidateQueries({ queryKey: ["posts"] });
  };
  const update = useMutation({
    mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, { content }, { headers }),
    onSuccess: () => { setEditing(false); invalidate(); toast.success("Comment updated"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Couldn't update comment"),
  });
  const remove = useMutation({
    mutationFn: () => axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, { headers }),
    onSuccess: () => { invalidate(); toast.success("Comment deleted"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Couldn't delete comment"),
  });
  async function deleteComment() {
    const result = await Swal.fire({ title: "Delete comment?", icon: "warning", showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#e11d48" });
    if (result.isConfirmed) remove.mutate();
  }
  return <div className="px-4 pb-4"><div className="rounded-2xl border border-pink-100 bg-pink-100 p-4">
    <div className="mb-3 flex items-center justify-between gap-2"><div className="flex min-w-0 items-center gap-3">
      <img src={comment.commentCreator?.photo || "/default-user.png"} alt={comment.commentCreator?.name || "User"} className="h-11 w-11 rounded-full border-2 border-pink-300 object-cover" />
      <div><h3 className="text-sm font-bold text-gray-800">{comment.commentCreator?.name || "Unknown User"}</h3><p className="mt-0.5 text-xs text-gray-400">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}</p></div>
    </div><div className="flex gap-2"><button type="button" title="Edit comment" onClick={() => setEditing(!editing)} className="rounded-lg p-2 text-pink-600 hover:bg-white"><FaPen /></button><button type="button" title="Delete comment" onClick={() => void deleteComment()} className="rounded-lg p-2 text-red-500 hover:bg-white"><FaTrash /></button></div></div>
    {editing ? <div className="space-y-2"><textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded-xl border border-pink-200 bg-white p-3 outline-none focus:border-pink-400" /><div className="flex gap-2"><button disabled={update.isPending} onClick={() => update.mutate()} className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save</button><button onClick={() => { setContent(comment.content); setEditing(false); }} className="rounded-full bg-white px-4 py-2 text-sm">Cancel</button></div></div> : <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">{comment.content}</p>}
    {comment.image && <img src={comment.image} alt="Comment attachment" className="mt-3 max-h-72 rounded-xl object-cover" />}
  </div></div>;
}
