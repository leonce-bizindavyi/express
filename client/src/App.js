import './App.css';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import Post from './pages/Post';
import Register from './pages/Register';
import Login from './pages/Login';
import {Authcontext} from './helpers/Authcontext'
import {useState,useEffect} from 'react'
import axios from 'axios';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePass from './pages/ChangePass';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <Authcontext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {authState.status ?(
                <>
                <Link to="/"> Home Page</Link>
                <Link to="/createpost"> Create A Post</Link>
                </>
              ): (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepass" element={<ChangePass />} />
            <Route path='*' element={<PageNotFound />} />
        </Routes>
        </Router>
      </Authcontext.Provider>
    </div>
  );
}

export default App;