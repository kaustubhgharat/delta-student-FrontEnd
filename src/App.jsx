import { BrowserRouter, Routes, Route } from "react-router-dom";
import Listings from "./views/listings/Listings";
import Show from "./views/listings/Show";
import New from "./views/listings/New";
import Edit from "./views/listings/Edit"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NotFound from "./util/Notfound";
import Signup from "./views/users/Signup"; // ✅ Match case exactly
import Login from "./views/users/Login";
console.log("ENV:", import.meta.env.VITE_BACKEND_URL);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<Show />} />
        <Route path="/listings/new" element={<New />} />
        <Route path="/listings/:id/edit" element={<Edit />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
