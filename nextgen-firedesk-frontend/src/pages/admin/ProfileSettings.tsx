import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  ArrowLeft,
  Camera,
  Shield,
  Calendar,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  userType: string;
  name: string;
  email: string;
  phone: string;
  displayName: string;
  profile: string;
  loginID: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileData {
  userType: string;
  name: string;
  displayName: string;
  phone: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export default function ProfileSettings() {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    displayName: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (authUser) {
      setUser(authUser as UserProfile);
      setFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        displayName: authUser.displayName || '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!user) {
        toast({
          title: "Error",
          description: "User data not loaded",
          variant: "destructive",
        });
        return;
      }

      // Prepare update data according to backend requirements
      const updateData: UpdateProfileData = {
        userType: user.userType,
        name: formData.name,
        displayName: formData.displayName,
        phone: formData.phone,
        email: formData.email,
      };

      // Add password fields only if they are being changed
      if (showPasswordFields && formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Check if any changes were made (excluding passwords)
      const hasChanges = 
        formData.name !== user.name ||
        formData.email !== user.email ||
        formData.phone !== user.phone ||
        formData.displayName !== user.displayName ||
        (showPasswordFields && formData.currentPassword && formData.newPassword);

      if (!hasChanges) {
        toast({
          title: "No changes made",
          description: "Your profile information is up to date.",
        });
        return;
      }

      // Make API call to update profile using the correct endpoint
      const response = await api.put('/editAdmin', updateData);
      
      // Update local user state and auth context
      if (response.admin) {
        setUser(response.admin);
        updateUser(response.admin);
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
        }));
        setShowPasswordFields(false);
        
        toast({
          title: "Profile updated successfully",
          description: "Your changes have been saved.",
        });
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (showPasswordFields) {
      // Clear password fields when hiding them
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
      }));
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Form */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password Change Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Change Password
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Update your password for enhanced security
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={togglePasswordFields}
                  >
                    {showPasswordFields ? 'Cancel' : 'Change Password'}
                  </Button>
                </div>

                {showPasswordFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password *</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password *</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-orange-100">
                    <AvatarImage src={user.profile} />
                    <AvatarFallback className="bg-orange-500 text-white text-xl">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    disabled
                    title="Profile picture upload coming soon"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.userType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="text-sm font-mono text-xs">{user.id.slice(0, 8)}...</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Login ID</span>
                <span className="text-sm">{user.loginID || 'Not set'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Member since
                </span>
                <span className="text-sm text-right">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last updated</span>
                <span className="text-sm text-right">{formatDate(user.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={togglePasswordFields}
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                Deactivate Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Settings Card */}
      {/* <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
          <CardDescription>
            Your account security details and session information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Account Type</h4>
                  <p className="text-sm text-muted-foreground">
                    Your role and permissions
                  </p>
                </div>
                <Badge variant="secondary">{user.userType}</Badge>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Verified</h4>
                  <p className="text-sm text-muted-foreground">
                    Your email verification status
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Verified
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Last Login</h4>
                  <p className="text-sm text-muted-foreground">
                    Your most recent sign-in
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">Just now</span>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Account Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Current account state
                  </p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}