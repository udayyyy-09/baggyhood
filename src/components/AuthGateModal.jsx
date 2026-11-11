import { useAuth } from '../context/AuthContext.jsx'

/**
 * AuthGateModal
 *
 * A full-screen overlay that blocks cart checkout until the user signs in.
 * Appears ONLY when the user clicks "Continue" in the cart without being logged in.
 * After Google login, the modal closes automatically and checkout resumes.
 *
 * Props:
 *   isOpen      — boolean, controlled by cart state
 *   onClose     — () => void, called when user dismisses without logging in
 *   onSuccess   — (user) => void, called automatically after successful login
 */
export default function AuthGateModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth()

  if (!isOpen) return null

  function handleGoogleLogin() {
    // Pass onSuccess as a callback — AuthContext will fire it after login redirect
    login(onSuccess)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-1">baggyHood</p>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign in to continue
          </h2>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">
            Create a free account to place your order and track your drops.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6" />

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 active:bg-white/80 text-gray-800 font-medium text-sm py-3 px-4 rounded-xl transition-all duration-150 shadow-sm"
        >
          {/* Google "G" SVG logo */}
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Fine print */}
        <p className="text-center text-xs text-white/25 mt-5 leading-relaxed">
          Your cart is saved. You'll return right here after signing in.
        </p>
      </div>
    </div>
  )
}

