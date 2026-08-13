import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-clinic-tealDark mb-2">EasyMed AI</h1>
      <p className="text-clinic-ink/70 max-w-md mb-6">
        Smart healthcare management and clinical decision support — appointments,
        records, AI risk prediction, and a symptom-checker assistant in one platform.
      </p>
      <div className="flex gap-3">
        <Link to="/login" className="bg-clinic-teal text-white px-5 py-2 rounded font-medium hover:bg-clinic-tealDark transition">
          Sign in
        </Link>
        <Link to="/register" className="border border-clinic-teal text-clinic-teal px-5 py-2 rounded font-medium hover:bg-white transition">
          Create account
        </Link>
      </div>
    </div>
  );
}
