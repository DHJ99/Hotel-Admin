import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Save, X, Camera, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { AdminProfile } from '../types';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { validateProfileForm, validatePassword, validateEmail } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile: React.FC = () => {
  const { adminProfile, updateAdminProfile } = useData();
  const { updateUser, updatePassword, getCurrentCredentials } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<AdminProfile>(adminProfile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(adminProfile);
      setProfilePicturePreview(null);
    }
    setIsEditing(!isEditing);
    setMessage(null);
    setValidationErrors({});
  };

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicturePreview(result);
        setEditForm(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const validation = validateProfileForm(editForm);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
    }
    
    return validation.isValid;
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};
    const currentCredentials = getCurrentCredentials();
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    } else if (passwordForm.currentPassword !== currentCredentials.password) {
      errors.currentPassword = 'Current password is incorrect';
    }
    
    const newPasswordValidation = validatePassword(passwordForm.newPassword);
    if (!newPasswordValidation.isValid) {
      errors.newPassword = newPasswordValidation.error!;
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setMessage({ type: 'error', text: 'Please fix the password errors below' });
      return false;
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateAdminProfile(editForm);
    
    // Update user context if email changed
    if (editForm.email !== adminProfile.email) {
      updateUser({ email: editForm.email, name: editForm.name });
      setMessage({ type: 'success', text: 'Profile updated! You will be redirected to login with your new email.' });
    } else {
      updateUser({ name: editForm.name });
    }
    
    setIsEditing(false);
    setProfilePicturePreview(null);
    setIsLoading(false);
    
    // Show success animation
    setShowSuccessAnimation(true);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update password in credentials and trigger logout
    updatePassword(passwordForm.newPassword);

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setIsLoading(false);
    setMessage({ type: 'success', text: 'Password changed successfully! You will be redirected to login.' });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account information and preferences</p>
        </div>
      </div>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white p-6 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
            <CheckCircle className="h-8 w-8" />
            <span className="text-lg font-semibold">Profile Updated!</span>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            disabled={isLoading}
          >
            {isEditing ? <X className="h-4 w-4" /> : <User className="h-4 w-4" />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                {profilePicturePreview || adminProfile.profilePicture ? (
                  <img 
                    src={profilePicturePreview || adminProfile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {adminProfile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:scale-110">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{adminProfile.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{adminProfile.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{adminProfile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{adminProfile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{adminProfile.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Joined Date
                </label>
                <div className="flex items-center space-x-2 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {new Date(adminProfile.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border ${
                      validationErrors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                  />
                  {validationErrors.bio && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.bio}</p>
                  )}
                </>
              ) : (
                <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                  <span className="text-gray-900 dark:text-white">{adminProfile.bio}</span>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border ${
                  passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border ${
                  passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border ${
                  passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleChangePassword}
            disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;