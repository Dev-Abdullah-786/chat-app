import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover bg-no-repeat">
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
    </div>
  )
}

export default App
