import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, data);
      navigate("/login");
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
        <h1 className="text-2xl font-semibold text-clinic-tealDark">Create your account</h1>
        <input placeholder="Full name" className="w-full border rounded px-3 py-2" {...register("name", { required: true })} />
        <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" {...register("email", { required: true })} />
        <input type="password" placeholder="Password" className="w-full border rounded px-3 py-2" {...register("password", { required: true })} />
        <select className="w-full border rounded px-3 py-2" {...register("role")}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-clinic-teal text-white rounded py-2 font-medium hover:bg-clinic-tealDark transition"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
