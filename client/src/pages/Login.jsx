import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        data,
        { withCredentials: true }
      );
      setSession(res.data.user, res.data.accessToken);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-sm p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-clinic-tealDark">Sign in to EasyMed</h1>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="text-clinic-coral text-sm mt-1">Email is required</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            {...register("password", { required: true })}
          />
          {errors.password && <p className="text-clinic-coral text-sm mt-1">Password is required</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-clinic-teal text-white rounded py-2 font-medium hover:bg-clinic-tealDark transition"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
