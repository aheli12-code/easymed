import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/request-password-reset`, data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      // Always show the same confirmation, whether or not the email exists
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-clinic-tealDark mb-4">Reset your password</h1>
        {sent ? (
          <p className="text-sm text-gray-600">
            If that email is registered, we've sent a reset link. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
              {...register("email", { required: true })}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-clinic-teal text-white rounded py-2 font-medium hover:bg-clinic-tealDark transition"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
