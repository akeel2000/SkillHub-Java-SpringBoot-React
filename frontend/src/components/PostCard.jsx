const PostCard = ({ post }) => (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <h3 className="font-bold">{post.title}</h3>
      <p className="text-gray-700 mt-1">{post.content}</p>
      <p className="text-xs text-gray-500 mt-2">Posted by: {post.userName}</p>
    </div>
  );
  export default PostCard;
  