import { Route,Routes } from "react-router-dom";
import SellerSignup from "@/views/seller/signUpPage/SignUpPage";


export default function SellerRoutes()
{
    <Routes>
        <Route path="/seller/signup" element={<SellerSignup/>} />
    </Routes>
}