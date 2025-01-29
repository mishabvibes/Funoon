import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";
import NavBar from "./Components/Header/NavBar";
import CursorAnimation from "./Components/Cursor/CursorAnimation";
import { ProtectedRoute } from "./Components/AdminLogin/AdminLogin";
import PWAInstallPrompt from "./Components/PWAInstallPrompt/PWAInstallPrompt";
// import ComingSoon from "./Pages/ComingSoon";
 
const Home = lazy(() => import("./Pages/Home"));
const Result = lazy(() => import("./Pages/Result"));
const Login = lazy(() => import("./Pages/Login"));
const PosterPage = lazy(() => import("./Components/Result/PosterPage"));
const AddResult = lazy(() => import("./Pages/AddResult"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const ScoreTable = lazy(() => import("./Pages/ScoreTable"));
const TopParticipants = lazy(() => import("./Pages/TopPartPage"));

// const IS_COMINGSOON = true;

function App() {
  // if (IS_COMINGSOON) {
  //   return <ComingSoon />
  // }
  return (
    <BrowserRouter>
      <CursorAnimation />
      <NavBar />
      <PWAInstallPrompt />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/result' element={<Result />} />
          <Route path="/poster/:programName" element={<PosterPage />} />
          <Route path='/scoretable' element={<ScoreTable />} />
          <Route path='/toppartficipants' element={<TopParticipants />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/addresult' element={<AddResult />} />
            <Route path='/cart' element={<CartPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
