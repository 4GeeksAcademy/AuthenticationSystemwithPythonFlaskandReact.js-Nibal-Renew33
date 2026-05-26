import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getApiBaseUrl } from "../utils/api";

export const Private = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const loadPrivateData = async () => {
            if (!store.token) {
                navigate("/login", { replace: true });
                return;
            }

            dispatch({ type: "set_auth_error", payload: null });

            try {
                const response = await fetch(`${getApiBaseUrl()}/private`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${store.token}`
                    }
                });

                const data = await response.json();

                if (!response.ok || !data.ok) {
                    throw new Error(data.msg || "Unable to load private data");
                }

                dispatch({ type: "set_private_message", payload: data.msg });
                dispatch({ type: "set_user", payload: data.user || null });
            } catch (error) {
                dispatch({ type: "logout" });
                dispatch({ type: "set_auth_error", payload: error.message });
                navigate("/login", { replace: true });
            }
        };

        loadPrivateData();
    }, [store.token, dispatch, navigate]);

    return (
        <div className="container mt-5" style={{ maxWidth: "700px" }}>
            <h2 className="mb-3">Private Page</h2>
            <p className="lead">Only logged-in users can see this page.</p>
            {store.privateMessage && <div className="alert alert-success">{store.privateMessage}</div>}
            {store.currentUser && (
                <div className="card p-3">
                    <h5 className="mb-2">Logged in user</h5>
                    <p className="mb-0"><strong>Email:</strong> {store.currentUser.email}</p>
                    <p className="mb-0"><strong>ID:</strong> {store.currentUser.id}</p>
                </div>
            )}
        </div>
    );
};
