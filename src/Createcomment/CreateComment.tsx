import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { FaRegImage, FaPaperPlane } from "react-icons/fa6";

export default function CreateComment({ postId, queryKey = ["comments", postId] }: { postId: string; queryKey?: string[] }) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const query = useQueryClient();
  const mutation = useMutation({
    mutationFn: (body: FormData) => axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
    onSuccess: () => {
      if (textRef.current) textRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
      query.invalidateQueries({ queryKey });
      query.invalidateQueries({ queryKey: ["comments", postId] });
      query.invalidateQueries({ queryKey: ["singlePost"] });
      query.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Couldn't add comment"),
  });
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = textRef.current?.value.trim() || "";
    const file = imageRef.current?.files?.[0];
    if (!content && !file) return;
    const formData = new FormData();
    if (content) formData.append("content", content);
    if (file) formData.append("image", file);
    mutation.mutate(formData);
  }
  return <form onSubmit={submit}><div className="w-full p-5">
    <textarea ref={textRef} placeholder="Write your comment..." className="w-full resize-none rounded-2xl border-2 border-pink-100 bg-pink-50 p-4 text-gray-700 outline-none focus:border-pink-400" />
    <div className="mt-3 flex items-center gap-4">
      <label className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100"><FaRegImage className="text-xl" /><input ref={imageRef} type="file" accept="image/*" className="hidden" /></label>
      <button disabled={mutation.isPending} className="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600 disabled:opacity-50"><FaPaperPlane />{mutation.isPending ? "Posting..." : "Comment"}</button>
    </div>
  </div></form>;
}
