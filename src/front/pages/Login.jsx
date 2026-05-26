import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getApiBaseUrl } from "../utils/api";

export const Login = () => {
    const navigate = useNavigate();
    const { dispatch, store } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        dispatch({ type: "set_auth_error", payload: null });

        try {
            const response = await fetch(`${getApiBaseUrl()}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.ok || !data.token) {
                throw new Error(data.msg || "Login failed");
            }

            dispatch({ type: "set_token", payload: data.token });
            dispatch({ type: "set_user", payload: data.user || null });
            navigate("/private");
        } catch (error) {
            dispatch({ type: "set_auth_error", payload: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="login-email" className="form-label">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="login-password" className="form-label">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {store.authError && <div className="alert alert-danger mt-3">{store.authError}</div>}
        </div>
    );
};
