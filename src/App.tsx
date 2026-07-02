import { Routes, Route } from 'react-router-dom'
import FeedContext from './context/FeedContext'
import AuthContext from './context/AuthContext'
import PageNotFound from './Pages/PageNotFound'
import SignUpPage from './Pages/SignUp'
import LoginPage from './Pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Feed from './Pages/Feed';
import CreatePost from './components/PostComposer';
import Profile from './Pages/Profile';
import WithNavbar from './components/WithNavbar';
import FirebaseGuide from './components/FirebaseGuide';

function App(){
  return (
    <>
      <AuthContext>
          <FeedContext>
        <Routes>
          <Route path='/signup' element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />} >
            <Route element={<WithNavbar />}>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/createpost" element={<CreatePost />} />
              <Route path="/firebase-guide" element={<FirebaseGuide />} />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
          </FeedContext>
      </AuthContext>
    </>
  );
}

export default App;
