export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface commentType {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  image: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}