"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCurrentUser } from "@/lib/use-current-user";
import { useMyPaintings } from "@/lib/hooks/use-api";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Shield,
  Camera,
  Save,
  Eye,
  EyeOff,
  Calendar,
  Palette,
  Edit,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Avatar emoji options
const avatarEmojis = ["👤", "😊", "🎨", "🌟", "🎭", "🚀", "💡", "🦄", "🌈", "⭐"];

interface ProfileData {
  name: string;
  email: string;
  image?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, isLoading, error } = useCurrentUser();
  const { data: paintingsRes } = useMyPaintings({ page: 1, limit: 12 });
  const userPaintings = paintingsRes?.data ?? [];
  const paintingsCount = paintingsRes?.pagination?.total || 0;

  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Form states
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    image: "",
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      await authClient.updateUser({
        name: profileData.name,
        image: profileData.image,
        fetchOptions: {
          onError: (error) => {
            toast.error(error.error.message);
          },
          onSuccess: () => {
            toast.success("Profile updated successfully!");
            setIsEditingProfile(false);
          },
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsUpdating(true);
      await authClient.changePassword({
        newPassword: passwordData.newPassword,
        currentPassword: passwordData.currentPassword,
        fetchOptions: {
          onError: (error) => {
            toast.error(error.error.message);
          },
          onSuccess: () => {
            toast.success("Password changed successfully!");
            setPasswordData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            setIsChangingPassword(false);
          },
        },
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData({ ...profileData, image: result });
        setShowPhotoDialog(false);
        toast.success("Photo uploaded! Remember to save your profile.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle emoji avatar selection
  const handleEmojiSelect = (emoji: string) => {
    // Create a canvas to convert emoji to base64 image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 100;
    
    if (ctx) {
      ctx.font = "60px serif";
      ctx.textAlign = "center";
      ctx.fillText(emoji, 50, 70);
      const dataURL = canvas.toDataURL();
      setProfileData({ ...profileData, image: dataURL });
      setShowPhotoDialog(false);
      toast.success("Avatar selected! Remember to save your profile.");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    try {
      await authClient.forgetPassword({
        email: user?.email || "",
        redirectTo: "/reset-password",
        fetchOptions: {
          onError: (error) => {
            toast.error(error.error.message);
          },
          onSuccess: () => {
            toast.success("Password reset link sent to your email!");
          },
        },
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email");
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">Failed to load profile. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
              <p className="text-muted-foreground">
                Manage your account information and settings
              </p>
            </div>
            <Badge variant={user.isStale ? "destructive" : "default"}>
              {user.isStale ? "Inactive" : "Active"}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="paintings">Paintings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Profile Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="text-lg">
                        {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="mt-1">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {user.isStale ? (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className="font-medium">
                      {user.isStale ? "Inactive" : "Active"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>

              {/* Paintings Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Paintings</CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paintingsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Paintings uploaded
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.image} />
                    <AvatarFallback className="text-xl">
                      {profileData.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditingProfile && (
                    <div className="space-y-2">
                      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Photo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Change Profile Photo</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* File Upload */}
                            <div>
                              <Label htmlFor="photo-upload" className="text-sm font-medium">
                                Upload Photo
                              </Label>
                              <div className="mt-2">
                                <Input
                                  id="photo-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoUpload}
                                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Emoji Avatars */}
                            <div>
                              <Label className="text-sm font-medium">Or choose an avatar</Label>
                              <div className="grid grid-cols-5 gap-2 mt-2">
                                {avatarEmojis.map((emoji, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    className="h-12 w-12 text-2xl p-0"
                                    onClick={() => handleEmojiSelect(emoji)}
                                  >
                                    {emoji}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, or choose an emoji avatar. Max size 2MB.
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3">
                    <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                      <Save className="w-4 h-4 mr-2" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Password & Security</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isChangingPassword ? "Cancel" : "Change Password"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isChangingPassword ? (
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                          placeholder="Enter current password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                          }
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          placeholder="Enter new password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                          }
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          placeholder="Confirm new password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                          }
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button onClick={handlePasswordChange} disabled={isUpdating}>
                      <Save className="w-4 h-4 mr-2" />
                      {isUpdating ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Account Security Status */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Account Status</p>
                          <p className="text-sm text-muted-foreground">
                            Your account is {user.isStale ? "inactive" : "active"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={user.isStale ? "destructive" : "default"}>
                        {user.isStale ? "Inactive" : "Active"}
                      </Badge>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Member Since</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>

                    {/* Forgot Password Option */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Forgot Password?</p>
                          <p className="text-sm text-muted-foreground">
                            Get a password reset link via email
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleForgotPassword}>
                        Send Reset Link
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paintings Tab */}
          <TabsContent value="paintings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Your Paintings ({paintingsCount})
                  </CardTitle>
                  <Button variant="outline" asChild>
                    <a href="/paintings/my">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {userPaintings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {userPaintings.map((painting) => (
                      <div
                        key={painting.id}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2 relative">
                          <Image
                            src={painting.imageUrl}
                            alt={painting.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized={true}
                          />
                        </div>
                        <p className="text-sm font-medium truncate">{painting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(painting.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No paintings uploaded yet</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/paintings/my">Upload Your First Painting</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}