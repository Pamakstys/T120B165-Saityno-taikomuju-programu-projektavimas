import React, { useState } from 'react';
import { register } from './services';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await register(form.name, form.email, form.password);
      setSuccess(true);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      if (success) {
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded shadow flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Register</h1>
        <input
          type="text"
          name="name"
          placeholder="name"
          value={form.name}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <Link
          to="/login"
          className="text-blue-400 hover:underline text-center"
        >
          Already have an account? Login here
        </Link>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">Registration successful!</div>}
      </form>
    </div>
  );
};

export default RegisterPage;