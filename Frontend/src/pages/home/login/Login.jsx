import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto min-h-screen">
      <div className="w-full p-6 rounded-lg shadow-md bg-[#1a1f2b] bg-opacity-80 border border-gray-600 max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-300 mb-4">
          Login <span className="text-blue-500">ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="label p-0 pb-1">
              <span className="text-base text-gray-300">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10 text-gray-300 bg-[#1e293b] placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label p-0 pb-1">
              <span className="text-base text-gray-300">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10 text-gray-300 bg-[#1e293b] placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Link to="/signup" className="text-sm text-gray-400 hover:text-blue-500 hover:underline mt-1 inline-block">
            Don't have an account?
          </Link>

          <button
            className="w-full py-2 mt-2 rounded-lg bg-[#111827] hover:bg-[#0f172a] text-gray-200 font-medium transition"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
