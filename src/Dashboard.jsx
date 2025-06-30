import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  User, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Search, 
  Bell,
  Settings,
  Home,
  Users,
  Bookmark,
  TrendingUp
} from "lucide-react";
import { useUser } from './UserContext';

function Dashboard({ onNavigate }) {
  const { user, setUser } = useUser();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postMessage, setPostMessage] = useState({ type: "", text: "" });
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingNav, setPendingNav] = useState(null); // 'back' or 'unload'
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [theatreVideo, setTheatreVideo] = useState(null);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    // Remove localStorage logic for user
    if (!user) {
      onNavigate('/');
    }
  }, [user, onNavigate]);

  // Fetch posts from backend
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts.map(post => ({
          ...post,
          shares: 0 // default shares
        })));
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [onNavigate]);

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    if (pendingNav === 'back') {
      onNavigate('/');
    } else if (pendingNav === 'unload') {
      window.removeEventListener('beforeunload', () => {});
      window.location.href = '/';
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    setPendingNav(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    onNavigate('/');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const url = URL.createObjectURL(selected);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setFilePreview(URL.createObjectURL(dropped));
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) {
      setPostMessage({ type: "error", text: "Post content cannot be empty." });
      return;
    }
    setIsPosting(true);
    setPostMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', newPost);
      if (file) formData.append('file', file);
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setPostMessage({ type: "success", text: "Post created!" });
        setNewPost("");
        setFile(null);
        setFilePreview(null);
        fetchPosts(); // Refresh posts after new post
      } else {
        setPostMessage({ type: "error", text: data.message || "Failed to post." });
      }
    } catch (err) {
      setPostMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white text-indigo-900 rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to leave?</h2>
            <p className="mb-6">You will be logged out if you leave this page.</p>
            <div className="flex gap-4">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Yes, Log me out
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-200 text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-purple-500/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-bold text-white">Socially</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-300 hover:text-purple-400 transition-colors duration-200">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-300 hover:text-purple-400 transition-colors duration-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              <button className="p-2 text-gray-300 hover:text-purple-400 transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 mb-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                {console.log('Sidebar user:', user)}
                <img
                  src={user && user.profilePic ? (user.profilePic.startsWith('http') ? user.profilePic : BACKEND_URL + user.profilePic) : "https://ui-avatars.com/api/?name=User&background=random"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30 shadow-lg"
                />
                <div>
                  <h3 className="font-semibold text-white">@{user && (user.username || user.fullName) ? (user.username || user.fullName) : 'User'}</h3>
                  <p className="text-sm text-gray-300">{user && user.email ? user.email : ''}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 text-gray-300 hover:text-white">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 text-gray-300 hover:text-white">
                  <Users className="w-5 h-5" />
                  <span>Friends</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 text-gray-300 hover:text-white">
                  <Bookmark className="w-5 h-5" />
                  <span>Saved</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 text-gray-300 hover:text-white">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-400/30 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Welcome back, @{user && (user.username || user.fullName) ? (user.username || user.fullName) : 'User'}! 👋</h2>
              <p className="text-purple-100">Ready to connect with your friends and share your thoughts?</p>
            </div>

            {/* Create Post */}
            <div
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 mb-6 shadow-xl transition-all duration-200 ${isDragActive ? 'ring-4 ring-yellow-400 border-yellow-400' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <form onSubmit={handlePostSubmit} encType="multipart/form-data">
                <div className="flex items-start space-x-3">
                  <img
                    src={user && user.profilePic ? (user.profilePic.startsWith('http') ? user.profilePic : BACKEND_URL + user.profilePic) : "https://ui-avatars.com/api/?name=User&background=random"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30 shadow-lg"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="What's on your mind?"
                      className="w-full p-3 bg-gray-700/50 border border-purple-500/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-gray-400"
                      rows="3"
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                      disabled={isPosting}
                    />
                    <div className="flex items-center gap-3 mt-3">
                      <label className="flex items-center cursor-pointer text-gray-400 hover:text-purple-400 transition-colors duration-200">
                        <Plus className="w-5 h-5 mr-1" />
                        <span className="text-sm">Attach</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isPosting}
                        />
                      </label>
                      {filePreview && (
                        <div className="relative">
                          {file && file.type.startsWith('image') ? (
                            <img src={filePreview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-purple-400" />
                          ) : file && file.type.startsWith('video') ? (
                            <video src={filePreview} className="w-16 h-16 object-cover rounded-lg border border-purple-400" controls />
                          ) : null}
                          <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">&times;</button>
                        </div>
                      )}
                      <button
                        type="submit"
                        className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                        disabled={isPosting}
                      >
                        {isPosting ? "Posting..." : "Post"}
                      </button>
                    </div>
                    {isDragActive && (
                      <div className="mt-3 p-3 rounded-lg border-2 border-dashed border-yellow-400 bg-yellow-100/10 text-yellow-300 text-center text-sm">
                        Drop your image or video here to attach
                      </div>
                    )}
                    {postMessage.text && (
                      <div className={`mt-3 p-2 rounded text-sm ${postMessage.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                        {postMessage.text}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {isLoadingPosts ? (
                <div className="text-center text-purple-200">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center text-purple-200">No posts yet. Be the first to post!</div>
              ) : posts.map((post) => (
                <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 shadow-xl">
                  <div className="flex items-start space-x-3 mb-4">
                    <img 
                      src={post.userId && post.userId.profilePic ? (post.userId.profilePic.startsWith('http') ? post.userId.profilePic : BACKEND_URL + post.userId.profilePic) : "https://ui-avatars.com/api/?name=User&background=random"}
                      alt={post.userId ? post.userId.fullName : 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">@{post.userId ? post.userId.fullName : 'User'}</h3>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-200 mb-4">{post.content}</p>
                  {post.fileUrl && (
                    <div className="mb-4">
                      {post.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <img src={BACKEND_URL + post.fileUrl} alt="attachment" className="w-full max-h-60 rounded-lg border border-purple-400" />
                      ) : post.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                        <div className="relative group w-full h-60">
                          <video
                            src={BACKEND_URL + post.fileUrl}
                            controls
                            className="w-full h-full object-cover rounded-lg border border-purple-400"
                          />
                          <button
                            type="button"
                            onClick={() => setTheatreVideo(BACKEND_URL + post.fileUrl)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                            style={{ pointerEvents: 'auto' }}
                            aria-label="Open theatre mode"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <polygon points="9,7 9,17 16,12" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-colors duration-200"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors duration-200">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 mb-6 shadow-xl">
              <h3 className="font-semibold text-white mb-4">Trending Topics</h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm font-medium text-white">#ReactDevelopment</p>
                  <p className="text-xs text-gray-300">1.2k posts</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm font-medium text-white">#UIAnimations</p>
                  <p className="text-xs text-gray-300">856 posts</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm font-medium text-white">#MongoDB</p>
                  <p className="text-xs text-gray-300">543 posts</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 shadow-xl">
              <h3 className="font-semibold text-white mb-4">Suggested Friends</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">@emma_design</p>
                    <p className="text-xs text-gray-300">UI/UX Designer</p>
                  </div>
                  <button className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors duration-200">Follow</button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">@john_dev</p>
                    <p className="text-xs text-gray-300">Full Stack Dev</p>
                  </div>
                  <button className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors duration-200">Follow</button>
                </div>
              </div>
            </div>

            <button
              className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              onClick={() => onNavigate('/profile-settings')}
            >
              Profile Settings
            </button>
          </div>
        </div>
      </div>

      {/* Theatre Mode Modal */}
      {theatreVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setTheatreVideo(null)}
          style={{ cursor: 'zoom-out' }}
        >
          <div className="relative max-w-3xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setTheatreVideo(null)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-indigo-900 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold z-10"
              aria-label="Close theatre mode"
            >
              &times;
            </button>
            <video
              src={theatreVideo}
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-xl shadow-2xl border-4 border-purple-500"
              style={{ background: 'black' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 