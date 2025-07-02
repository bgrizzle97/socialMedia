import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './userSlice';

const ProfileSettings = ({ onNavigate }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [status, setStatus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000";
  const [likedPosts, setLikedPosts] = useState({});
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch user info and posts on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Fetch user info
    fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm(f => ({ ...f, username: data.username || '', email: data.email || '' }));
        // Fetch profilePic from a new endpoint or add to /me response
        fetch('http://localhost:5000/api/auth/profile-pic', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(picData => {
            setProfilePicUrl(picData.profilePic);
          })
          .catch(() => setProfilePicUrl(null));
      });
    // Fetch user posts
    fetch('http://localhost:5000/api/posts/my-posts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      setProfilePicPreview(URL.createObjectURL(files[0]));
    }
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    if (form.profilePic) {
      formData.append('profilePic', form.profilePic);
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setStatus('Profile updated successfully!');
        const data = await res.json();
        dispatch(setUser(data.user));
      } else {
        setStatus('Failed to update profile.');
      }
    } catch (err) {
      setStatus('An error occurred.');
    }
  };

  const handleDeletePost = async (postId) => {
    setDeletePostId(postId);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!deletePostId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/posts/${deletePostId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts(posts => posts.filter(post => post.id !== deletePostId));
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      alert('An error occurred while deleting the post.');
    }
    setShowDeleteModal(false);
    setDeletePostId(null);
  };

  const cancelDeletePost = () => {
    setShowDeleteModal(false);
    setDeletePostId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white font-sans flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center gap-2 mb-8">
        <Users className="w-10 h-10 text-yellow-300" />
        <h1 className="text-4xl font-bold tracking-tight">Profile Settings</h1>
      </header>
      <main className="flex flex-col md:flex-row items-start w-full max-w-6xl gap-8">
        {/* Left: Profile Settings Form */}
        <div className="flex-1 bg-white/10 rounded-xl p-8 shadow-lg flex flex-col items-center mb-8 md:mb-0 min-w-[300px]">
          {/* Profile Picture Display */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={profilePicPreview || (profilePicUrl ? BACKEND_URL + profilePicUrl : 'https://ui-avatars.com/api/?name=User&background=random')}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300 shadow-lg mb-2"
            />
            <span className="text-indigo-100 text-sm">Current Profile Picture</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block mb-1 font-medium text-yellow-300">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border-2 border-white/30 bg-white/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder:text-indigo-200"
                required
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-yellow-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-2 border-white/30 bg-white/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder:text-indigo-200"
                required
                placeholder="Enter your email"
                disabled
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-yellow-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-2 border-white/30 bg-white/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder:text-indigo-200"
                required
                placeholder="Enter a new password"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-yellow-300">Profile Picture</label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-indigo-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-indigo-900 font-bold py-2 rounded-lg shadow-lg hover:bg-yellow-300 transition transform duration-200 hover:scale-105"
            >
              Save Changes
            </button>
          </form>
          {status && (
            <div className={`mt-4 ${status.includes('success') ? 'text-green-300' : 'text-red-300'}`}>{status}</div>
          )}
        </div>
        {/* Center: Posts */}
        <div className="flex-1 w-full max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300 text-center">Your Posts</h2>
          {loading ? (
            <div className="text-indigo-100 text-center">Loading your posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-indigo-100 text-center">You haven't posted anything yet.</div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 shadow-xl relative">
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
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => setLikedPosts(lp => ({ ...lp, [post.id]: !lp[post.id] }))}
                        className={`flex items-center space-x-2 transition-colors duration-200 ${likedPosts[post.id] ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'}`}
                      >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors duration-200">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">0</span>
                      </button>
                    </div>
                  </div>
                  <button
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition text-lg"
                    title="Delete post"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right: Connect Other Socials */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="p-6 bg-teal-600/30 rounded-xl shadow-lg border-2 border-teal-400/40 backdrop-blur-md flex flex-col items-center">
            <h3 className="text-lg font-bold mb-3 text-white drop-shadow">Connect Other Socials</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-teal-300 rounded-lg hover:bg-teal-400/30 transition text-white text-sm shadow"
                onClick={() => window.open('http://localhost:5000/api/auth/google', '_blank', 'width=500,height=600')}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-teal-300 rounded-lg hover:bg-teal-400/30 transition text-white text-sm shadow"
                onClick={() => window.open('http://localhost:5000/api/auth/github', '_blank', 'width=500,height=600')}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-5 h-5" />
                <span>GitHub</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-teal-300 rounded-lg hover:bg-teal-400/30 transition text-white text-sm shadow"
                onClick={() => window.open('http://localhost:5000/api/auth/discord', '_blank', 'width=500,height=600')}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discord/discord-original.svg" alt="Discord" className="w-5 h-5" />
                <span>Discord</span>
              </button>
            </div>
            <div className="text-xs text-teal-100 text-center">Your authentication is handled securely. More social integrations coming soon.</div>
          </div>
        </div>
      </main>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white text-indigo-900 rounded-xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this post?</h2>
            <div className="flex gap-4">
              <button
                onClick={confirmDeletePost}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={cancelDeletePost}
                className="bg-gray-200 text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings; 