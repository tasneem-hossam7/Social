import axios from "axios";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
  FaHeart,
  FaUserCircle,
} from "react-icons/fa";

import {
  LuFlower2,
  LuHeart,
  LuImages,
  LuSparkles,
} from "react-icons/lu";

import Loading from "../../loader/loading";
import Post from "../../post/Post";
import type { PostType } from "../../types/post.types";

const API_URL = "https://route-posts.routemisr.com";

type ProfileUser = {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  photo?: string;
};

type ProfileResponse = {
  user?: ProfileUser;
  posts?: PostType[];
  [key: string]: unknown;
};

function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

function getProfile() {
  return axios.get(`${API_URL}/users/profile-data`, {
    headers: getHeaders(),
  });
}

function getMyPosts() {
  return axios.get(
    `${API_URL}/posts/feed?only=me&page=1&limit=20`,
    {
      headers: getHeaders(),
    }
  );
}

export default function Profile() {
  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    data: postsResponse,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["profilePosts"],
    queryFn: getMyPosts,
  });

  if (profileLoading || postsLoading) {
    return <Loading />;
  }

  if (profileError || postsError) {
    return (
      <div className="mx-auto mt-24 max-w-xl rounded-3xl bg-pink-50 p-8 text-center">
        <p className="text-lg font-bold text-rose-600">
          Couldn't load your profile. Please try again.
        </p>
      </div>
    );
  }

  const profileData: ProfileResponse =
    profileResponse?.data?.data?.user
      ? profileResponse.data.data
      : profileResponse?.data?.data ??
        profileResponse?.data ??
        {};

  const user: ProfileUser =
    (profileData.user as ProfileUser | undefined) ??
    (profileData as ProfileUser);

  const rawPostsData = postsResponse?.data?.data;

  const posts: PostType[] = Array.isArray(rawPostsData?.posts)
    ? rawPostsData.posts
    : Array.isArray(rawPostsData)
      ? rawPostsData
      : [];

  const name = user.name || user.username || "Your Profile";
  const avatar = user.photo;

  return (
    <>
      <Helmet>
        <title>My Profile</title>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-pink-50 via-[#fffaff] to-purple-50 px-3 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">

          {/* Profile Cover */}
          <section className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-[0_12px_45px_rgba(219,112,170,0.13)]">

            <div className="relative h-36 overflow-hidden bg-gradient-to-r from-pink-200 via-fuchsia-100 to-purple-200 sm:h-48">

              <LuSparkles className="absolute left-[12%] top-5 text-3xl text-white" />

              <LuFlower2 className="absolute right-[14%] top-8 text-4xl text-white" />

              <LuHeart className="absolute bottom-4 left-[48%] text-3xl text-white" />

              <span className="absolute bottom-3 right-5 rounded-full bg-white/75 px-4 py-2 text-xs font-bold text-purple-700 backdrop-blur">
                your happy place
                <LuFlower2 className="ml-1 inline text-pink-400" />
              </span>
            </div>

            <div className="px-5 pb-7 sm:px-8">

              <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">

                {/* Profile Picture */}
                <div className="z-10 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-pink-300 to-purple-300 text-4xl text-white shadow-md sm:h-28 sm:w-28">

                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle />
                  )}

                </div>

                {/* User Information */}
                <div className="min-w-0 flex-1 pb-1">

                  <h1 className="break-words text-2xl font-extrabold text-gray-800 sm:text-3xl">
                    {name}
                    <LuHeart className="ml-2 inline text-pink-400" />
                  </h1>

                  {user.username && (
                    <p className="mt-1 text-sm font-medium text-purple-500">
                      @{user.username}
                    </p>
                  )}

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {user.email || "A little mystery"}
                    {!user.email && (
                      <LuSparkles className="ml-1 inline text-purple-400" />
                    )}
                  </p>

                </div>

                <span className="self-start rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600 sm:self-auto">
                  <FaHeart className="mr-2 inline" />
                  my space
                </span>

              </div>

              {/* Profile Statistics */}
              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-pink-100 bg-pink-50/80 p-4 text-center">

                  <p className="text-2xl font-extrabold text-pink-600">
                    {posts.length}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    My posts
                    <LuFlower2 className="ml-1 inline text-pink-400" />
                  </p>

                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50/80 p-4 text-center">

                  <LuHeart className="mx-auto text-2xl text-purple-500" />

                  <p className="mt-1 text-sm text-gray-500">
                    Little moments
                  </p>

                </div>

              </div>
            </div>
          </section>

          {/* My Posts */}
          <section className="mt-9">

            <div className="mb-5 flex items-end justify-between gap-3">

              <div>

                <h2 className="text-2xl font-extrabold text-gray-800">
                  My Posts
                  <LuFlower2 className="ml-2 inline text-pink-400" />
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Every post tells a little story.
                </p>

              </div>

              <span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-purple-600 shadow-sm">
                {posts.length} posts
              </span>

            </div>

            {posts.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-pink-200 bg-white px-5 py-12 text-center">

                <LuImages className="mx-auto text-4xl text-pink-300" />

                <h3 className="mt-4 text-lg font-bold text-gray-800">
                  No posts yet
                  <LuHeart className="ml-2 inline text-pink-400" />
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Share your first little moment and it will appear here.
                </p>

                <Link
                  to="/home"
                  className="mt-5 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-bold text-white shadow-sm transition hover:scale-[1.02]"
                >
                  Go to Home
                </Link>

              </div>

            ) : (

              <div className="flex flex-col gap-2">

                {posts.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    ispostdetails={false}
                  />
                ))}

              </div>

            )}

          </section>

        </div>
      </main>
    </>
  );
}
