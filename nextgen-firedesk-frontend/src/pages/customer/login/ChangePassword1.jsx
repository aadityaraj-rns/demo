import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password change data:', formData);
    // Handle password change logic here
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasMinLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar
    };
  };

  const validation = validatePassword(formData.newPassword);

  return (
    <div className="w-full font-[Figtree] p-3">
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-4">
          <Link to='/customer' className='text-black'>Home</Link>
          <span className="mx-2">/</span>
          <span>Change Password</span>
        </div>

        {/* Header */}
        <div className="mb-2">
          <p className="text-xl md:text-4xl font-medium md:font-semibold">Change Password</p>
          <p className="text-xs md:text-lg text-[#727272]">Please choose a password you haven't used before on this account.</p>
        </div>

        {/* Form */}
        <div className="space-y-6 w-full md:w-[40vw] bg-white p-3 rounded-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="********"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.current ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="********"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 bg-[#E9E9E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.new ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

         

          
        </div>
         {/* Password Requirements */}
          <div className="mt-6 bg-white w-full md:w-[40vw] rounded-4 p-3">
            <p className="text-lg md:text-xl font-medium mb-3">Your Password must include:</p>
            <ul className="text-base text-[#727272]">
              <li className={`flex items-start ${validation.hasMinLength ? 'text-green-600' : 'text-gray-600'}`}>
                <span className="mr-2">•</span>
                At least 8 characters in total
              </li>
              <li className={`flex items-start ${validation.hasUpperCase && validation.hasNumber && validation.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                <span className="mr-2">•</span>
                One uppercase letter, one number, and one special character
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                A value different from your previous password
              </li>
            </ul>
          </div>
          {/* Submit Button */}
          <div className="pt-6 w-full md:w-[40vw] flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full md:w-[20vw] py-2 text-base rounded-3 bg-[#FF6B2C] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Change Password
            </button>
          </div>
      </div>
    </div>
  );
}