import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_new.webp'; // adjust the path based on your folder structure


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [captchaUrl, setCaptchaUrl] = useState('http://127.0.0.1:8000/admin/auth/code/captcha/1');
  const [captchaUrl, setCaptchaUrl] = useState('http://127.0.0.1:8000/admin/auth/code/captcha/1');
  const navigate = useNavigate();

  const refreshCaptcha = () => {
  setCaptchaUrl(
      `http://127.0.0.1:8000/admin/auth/code/captcha/${Math.random()}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

 try {
 const response = await axios.post(
  'http://127.0.0.1:8000/admin/auth/api-login',
  { email, password},
  { withCredentials: true }
);

  const { token, user } = response.data;
  if (token) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard');
  } else {
    alert('Token not received. Please try again.');
  }
}
catch (error) {
  if (error.response) {
    const data = error.response.data;
    if (data.errors) {
      const messages = Object.values(data.errors).flat().join('\n');
      alert(messages);
    }
    else if (data.provided !== undefined && data.expected !== undefined) {
      alert(`Captcha mismatch:\nProvided: ${data.provided}\nExpected: ${data.expected}`);
    }
    else {
      alert(data.message || 'Unknown server error.');
    }
  } else {
    alert('Network error: could not reach server.');
  }
  console.error(error);
}
finally {
  refreshCaptcha();
  setIsLoading(false);
}

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-auto w-full relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Left branding */}
    <div className="hidden lg:flex lg:w-1/2 relative z-10 pl-30">
      <div className="flex flex-col justify-center items-start p-16 w-full">
        <div className="mb-8">
          {/* 🖼️ Added logo image here */}
          <img 
            src={logo}
            alt="ERP Logo" 
            className="mb-6 w-32 h-auto rounded-lg shadow-lg" 
          />

          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm"></div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-2 leading-tight">
            COZY
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">
              ERP
            </span>
          </h1>

          <p className="text-xl text-slate-300 font-light tracking-wide">
            Business Management System
          </p>
        </div>
      </div>
    </div>


      {/* Right - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-300">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-blue-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Fallback captcha */}
                <div className="flex items-center space-x-2 mb-6">
                  <input
                    type="text"
                    name="default_captcha_value"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    placeholder="Enter captcha"
                    className="w-1/2 px-3 py-2 rounded border border-white/20 text-white bg-white/10 placeholder-slate-400 focus:outline-none"
                    required
                  />
                  <img
                    src={captchaUrl}
                    alt="captcha"
                    className="h-12 w-1/3 rounded border border-white/20"
                    crossOrigin="use-credentials"    // ← tell the browser to send cookies
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-white hover:text-blue-400"
                    title="Refresh captcha"
                  >
                    ↻
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: 'rgb(60,89,137)' }}
                  className="w-full py-4 px-6 rounded-xl text-white font-semibold hover:opacity-90 flex items-center justify-center space-x-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">Contact Administrator</a>
            </div>
          </div>

          <div className="mt-8 text-center text-slate-400 text-sm">
            © 2024 COZY ERP. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
