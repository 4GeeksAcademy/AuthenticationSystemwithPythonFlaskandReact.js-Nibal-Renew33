import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const isAuthenticated = Boolean(store.token);

	const handleLogout = () => {
		dispatch({ type: "logout" });
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Auth App</span>
				</Link>
				<div className="ml-auto">
					{!isAuthenticated ? (
						<>
							<Link to="/signup" className="me-2">
								<button className="btn btn-outline-primary">Sign Up</button>
							</Link>
							<Link to="/login">
								<button className="btn btn-primary">Login</button>
							</Link>
						</>
					) : (
						<>
							<Link to="/private" className="me-2">
								<button className="btn btn-success">Private</button>
							</Link>
							<button className="btn btn-danger" onClick={handleLogout}>Logout</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};