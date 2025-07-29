import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
const ProfilePage = () => {
  const { userData, loading, error } = useOutletContext();
  console.log("this is profilepage data", userData);
  // Color constants
  const colors = {
    primary: 'rgb(60, 89, 137)',
    primaryLight: 'rgba(60, 89, 137, 0.1)',
    primaryDark: 'rgb(40, 65, 105)',
    text: '#333',
    lightGray: '#f5f5f5',
    mediumGray: '#e0e0e0',
    darkGray: '#777',
    white: '#fff',
  };

  // State management
  // after
    const [profileImage, setProfileImage] = useState(userData?.user?.image_url || null);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
    name: userData?.user?.name || '',
    phone: userData?.user?.phone || '',
    email: userData?.user?.email || '',
    place: userData?.user?.place || '',
    address: userData?.user?.address || '',
    gender: userData?.user?.gender || '',
    date_of_birth: userData?.user?.date_of_birth || '',
    qualification: userData?.user?.qualification || '',
    experience: userData?.user?.experience || '',
    expertise: userData?.user?.expertise || '',
    bankName: userData?.user?.bankName || '',
    accountHolder: userData?.user?.accountHolder || '',
    accountNumber: userData?.user?.accountNumber || '',
    ifsc: userData?.user?.ifsc || '',
    branch: userData?.user?.branch || ''
  });

  useEffect(() => {
    if (userData?.user) {
      setFormData({
        name: userData.user.name || '',
        phone: userData.user.phone || '',
        email: userData.user.email || '',
        place: userData.user.place || '',
        address: userData.user.address || '',
        gender: userData.user.gender || '',
        date_of_birth: userData.user.date_of_birth || '',
        qualification: userData.user.qualification || '',
        experience: userData.user.experience || '',
        expertise: userData.user.expertise || '',
        bankName: userData.user.bankName || '',
        accountHolder: userData.user.accountHolder || '',
        accountNumber: userData.user.accountNumber || '',
        ifsc: userData.user.ifsc || '',
        branch: userData.user.branch || ''
      });
      setProfileImage(
      userData.user.image_url || null
    );
    }
  }, [userData]);
  const [password, setPassword] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Event handlers
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setProfileImage(URL.createObjectURL(file));
    }
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

//   const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSaving(true);
//         setSaveError(null);
//         setSaveSuccess(false);

//         try {
//         const token = localStorage.getItem('access_token');
//         console.log("Retrieved token:", token);
//         if (!token) throw new Error('Authentication token not found');

//         // Make API call to update profile
//         const response = await axios.put(`${API_BASE_URL}/api/v1/user/update`,
//             formData,
//             {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//             }
//         );

//         // Handle successful update
//         setSaveSuccess(true);
//         setEditMode(false);
//         // Optionally update context/user data here
//         } catch (error) {
//         console.error('Profile update failed:', error);
//         setSaveError(error.response?.data?.message || error.message);
//         } finally {
//         setIsSaving(false);
//         // Auto-hide success message after 3 seconds
//         if (saveSuccess) {
//             setTimeout(() => setSaveSuccess(false), 3000);
//         }
//         }
//     }

  // Container styles
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Authentication token not found');

        // Create FormData object
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
        });
        
        // Append image if exists
        if (imageFile) {
        formDataToSend.append('profile_image', imageFile);
        }
        console.log("this is image file", imageFile);
        // Add password fields if needed
        if (password.newPassword && password.newPassword === password.confirmPassword) {
        formDataToSend.append('password', password.newPassword);
        }

        // Make API call
        const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/update`,
        formDataToSend,
        {
            headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            }
        }
        );

        // Handle response
        setSaveSuccess(true);
        setEditMode(false);
        setImageFile(null);
        setUploadProgress(0);
        
        // Update profile image in UI
        if (response.data.user.profile_image_url) {
        setProfileImage(response.data.user.profile_image_url);
        }

    } catch (error) {
        setSaveError(error.response?.data?.message || error.message);
    } finally {
        setIsSaving(false);
    }
    };
  
  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: colors.text,
  };

  // Header styles
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: `2px solid ${colors.primaryLight}`,
    paddingBottom: '1rem',
  };

  const titleStyles = {
    color: colors.primary,
    fontSize: '1.8rem',
    margin: 0,
  };

  const buttonStyles = {
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyles = {
    backgroundColor: colors.primaryDark,
  };

  // Content layout
  const contentStyles = {
    display: 'flex',
    gap: '2rem',
  };

  // Image section
  const imageSectionStyles = {
    flex: '0 0 250px',
  };

  const imageUploadStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  };

  const imagePreviewStyles = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: colors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: `3px solid ${colors.primary}`,
  };

  const initialsStyles = {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: colors.primary,
  };

  const uploadButtonStyles = {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s',
    textAlign: 'center',
    width: '100%',
  };

  const uploadButtonHoverStyles = {
    backgroundColor: colors.primary,
    color: 'white',
  };

  const imageNoteStyles = {
    color: colors.darkGray,
    fontSize: '0.8rem',
    margin: 0,
  };

  // Form styles
  const formStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  };

  const sectionStyles = {
    backgroundColor: colors.white,
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
    padding: '1.5rem',
  };

  const sectionTitleStyles = {
    color: colors.primary,
    marginTop: 0,
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px solid ${colors.mediumGray}`,
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  };

  const formGroupStyles = {
    marginBottom: '1rem',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: colors.primaryDark,
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  };

  const inputFocusStyles = {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: `0 0 0 2px ${colors.primaryLight}`,
  };

  const textareaStyles = {
    ...inputStyles,
    minHeight: '100px',
    resize: 'vertical',
  };

  const paragraphStyles = {
    margin: 0,
    padding: '0.75rem 0',
    borderBottom: `1px solid ${colors.lightGray}`,
  };

  const formActionsStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  };

  const saveButtonStyles = {
    ...buttonStyles,
    padding: '0.75rem 2rem',
  };

  // Password section
  const passwordSectionStyles = {
    ...sectionStyles,
    // marginTop: '2rem',
  };

  const passwordFormStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  };

  const updatePasswordButtonStyles = {
    ...buttonStyles,
    gridColumn: 'span 2',
    padding: '0.75rem',
    marginTop: '1rem',
  };

  // Responsive styles
  const responsiveStyles = {
    '@media (max-width: 768px)': {
      content: {
        flexDirection: 'column',
      },
      imageSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
      },
      passwordForm: {
        gridTemplateColumns: '1fr',
      },
      updatePasswordButton: {
        gridColumn: 'span 1',
      },
    },
  };

  // Apply responsive styles (inline approach)
  const getResponsiveStyle = (baseStyle, responsiveRules) => {
    return {
      ...baseStyle,
      ...(window.innerWidth <= 768 && responsiveRules['@media (max-width: 768px)']),
    };
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Profile Information</h2>
        <button 
          onClick={() => setEditMode(!editMode)}
          style={{
            ...buttonStyles,
            ':hover': buttonHoverStyles,
          }}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div style={getResponsiveStyle(contentStyles, responsiveStyles)}>
        <div style={getResponsiveStyle(imageSectionStyles, responsiveStyles.imageSection)}>
          <div style={imageUploadStyles}>
            <div style={imagePreviewStyles}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={initialsStyles}>{formData.name.charAt(0)}</div>
              )}
            </div>
            <label style={uploadButtonStyles}>
              Upload Image
              <input 
                type="file" 
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </label>
            <p style={imageNoteStyles}>(Ratio 1:1)</p>
          </div>
        </div>
        {isSaving && (
        <div style={{ marginTop: '1rem' }}>
            <progress value={uploadProgress} max="100" />
            <span> {uploadProgress}%</span>
        </div>
        )}

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Basic Information</h3>
            <div style={gridStyles}>
              <div style={formGroupStyles}>
                <label style={labelStyles}>Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.name || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Phone</label>
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.phone || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.email || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Place</label>
                {editMode ? (
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.place || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Address</label>
                {editMode ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={textareaStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.address || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Gender</label>
                {editMode ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={inputStyles}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p style={paragraphStyles}>{formData.gender || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Date of Birth</label>
                    {editMode ? (
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        style={inputStyles}
                    />
                    ) : (
                    <p style={paragraphStyles}>
                    {formData.date_of_birth
                        ? new Date(formData.date_of_birth).toLocaleDateString()
                        : 'Not specified'}
                    </p>
                )}
              </div>
            </div>
          </div>

          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Professional Information</h3>
            <div style={gridStyles}>
              <div style={formGroupStyles}>
                <label style={labelStyles}>Qualification</label>
                {editMode ? (
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.qualification || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Experience</label>
                {editMode ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.experience || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Expertise</label>
                {editMode ? (
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.expertise || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Bank Details</h3>
            <div style={gridStyles}>
              <div style={formGroupStyles}>
                <label style={labelStyles}>Bank Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.bankName || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Account Holder Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.accountHolder || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Account Number</label>
                {editMode ? (
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.accountNumber || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>IFSC Code</label>
                {editMode ? (
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.ifsc || 'Not specified'}</p>
                )}
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>Branch</label>
                {editMode ? (
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    style={inputStyles}
                  />
                ) : (
                  <p style={paragraphStyles}>{formData.branch || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {editMode && (
            <div style={formActionsStyles}>
              <button type="submit" style={saveButtonStyles}>
                Save Changes
              </button>
            </div>
          )}
        </form>

        <div style={passwordSectionStyles}>
          <h3 style={sectionTitleStyles}>Change Your Password</h3>
          <div style={getResponsiveStyle(passwordFormStyles, responsiveStyles.passwordForm)}>
            <div style={formGroupStyles}>
              <label style={labelStyles}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                style={inputStyles}
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                style={inputStyles}
              />
            </div>
            <button style={getResponsiveStyle(updatePasswordButtonStyles, responsiveStyles.updatePasswordButton)}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;