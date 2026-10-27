import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaRegEdit, FaHeart, FaImage, FaPaperPlane, FaTimes } from "react-icons/fa";

export default function CreatePost() {
  const textinput = useRef<HTMLTextAreaElement>(null);
  const imginput = useRef<HTMLInputElement>(null);
  const query = useQueryClient();
  const [image, setImage] = useState<string | null>(null);
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  }
  const mutation = useMutation({
    mutationFn: (formData: FormData) => axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
    onSuccess: () => {
      if (textinput.current) textinput.current.value = "";
      if (imginput.current) imginput.current.value = "";
      setImage(null);
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["profilePosts"] });
      toast.success("Post created successfully");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create post"),
  });
  function handleCreatePost() {
    const body = textinput.current?.value.trim() || "";
    const file = imginput.current?.files?.[0];
    if (!body && !file) return toast.error("Write something or add a photo first");
    const formData = new FormData();
    if (body) formData.append("body", body);
    if (file) formData.append("image", file);
    mutation.mutate(formData);
  }
  return <div className="w-full mt-20">
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-pink-200 bg-white shadow-lg shadow-pink-200/40">
      <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-pink-50/80 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-200 text-xl text-pink-500"><FaRegEdit /></div><h2 className="text-xl font-bold text-pink-500 sm:text-2xl">Create Post</h2></div><FaHeart className="text-2xl text-pink-300" />
      </div>
      <div className="p-4 sm:p-6">
        <textarea placeholder="What's on your mind? 💗" rows={3} ref={textinput} className="w-full resize-y rounded-2xl border-2 border-pink-100 p-4 text-gray-700 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100" />
        {image && <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-xl"><img src={image} alt="Preview" className="h-full w-full object-cover" /><button type="button" onClick={() => { setImage(null); if (imginput.current) imginput.current.value = ""; }} className="absolute right-2 top-2 rounded-full bg-pink-500 p-2 text-white"><FaTimes /></button></div>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-pink-50 px-4 py-3 font-semibold text-pink-500 hover:bg-pink-100"><FaImage /> Add Photo<input type="file" ref={imginput} accept="image/*" onChange={handleImageChange} className="hidden" /></label>
          <button type="button" onClick={handleCreatePost} disabled={mutation.isPending} className="flex items-center gap-2 rounded-full bg-pink-500 px-7 py-3 font-semibold text-white hover:bg-pink-600 disabled:opacity-50"><FaPaperPlane />{mutation.isPending ? "Posting..." : "Post"}</button>
        </div>
      </div>
    </div>
  </div>;
}
