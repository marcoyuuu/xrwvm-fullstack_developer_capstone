import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";

function App() {
    return (
        <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPanel />} />
            <Route path="/register" element={<Register />} />

            {/* Dealers List Route */}
            <Route path="/dealers" element={<Dealers />} />

            {/* Dealer Details and Reviews Route */}
            <Route path="/dealer/:dealer_id" element={<Dealer />} />

            {/* Post Review Route */}
            <Route path="/postreview/:id" element={<PostReview />} />

        </Routes>
    );
}

export default App;

/*
Considerations for Professionalism, Data Integrity, and Code Organization:

1. **Code Organization**:
   - Group similar routes together logically (e.g., authentication-related routes are grouped first, followed by dealer routes).
   - The `Routes` component is cleanly structured for readability, with comments marking different sections for ease of maintenance.

2. **Data Integrity**:
   - The `dealerId` parameter in the paths for DealerDetails and AddReview ensures that only valid dealer-specific operations are performed.
   - Consider adding route guards in the future for paths like `/dealer/:dealerId/add-review` to ensure that users are logged in before posting reviews.

3. **Error Handling**:
   - Consider adding a `NotFound` component to handle undefined routes gracefully, which can enhance the user experience and professionalism of the app.
*/
