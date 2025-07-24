import { Route, Routes } from "react-router-dom"
import Messages from "./pages/Messages"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/signup"
import Verification from "./pages/auth/Verification"
import { useEffect } from "react"
import ErrorPage from "./pages/ErrorPage"
import Layout from "./layout"
import ProfilePage from "./pages/ProfilePage"

function App() {

  useEffect(() => {
    const colorMode = JSON.parse(window.localStorage.getItem('color-theme'));
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    colorMode === 'dark' ? bodyClass.add(className) : bodyClass.remove(className);

  }, []);


  return (
    <Routes>
      {/* <Route index={true} element={<Messages />} /> */}
       <Route path="/" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/verify" element={<Verification />} />
      <Route path="*" element={<ErrorPage/>}/>

      <Route path="/dashboard/" element={<Layout />}>
      <Route index element={<Messages />} />
      <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
