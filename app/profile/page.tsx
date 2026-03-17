"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Smartphone,
  Key,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"

const initialKycSteps = [
  { id: 1, name: "Personal Information", status: "completed" },
  { id: 2, name: "Identity Document", status: "completed" },
  { id: 3, name: "Proof of Address", status: "pending" },
  { id: 4, name: "Selfie Verification", status: "pending" },
]

const securitySettings = [
  {
    id: "2fa",
    name: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account",
    enabled: true,
  },
  {
    id: "login-alerts",
    name: "Login Alerts",
    description: "Get notified when someone logs into your account",
    enabled: true,
  },
  {
    id: "withdrawal-confirmation",
    name: "Withdrawal Confirmation",
    description: "Require email confirmation for withdrawals",
    enabled: true,
  },
  {
    id: "api-trading",
    name: "API Trading",
    description: "Allow trading through API connections",
    enabled: false,
  },
]

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [kycSteps, setKycSteps] = useState(initialKycSteps)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [addressDocument, setAddressDocument] = useState<string | null>(null)
  const [selfieDocument, setSelfieDocument] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [settings, setSettings] = useState(
    securitySettings.reduce((acc, s) => ({ ...acc, [s.id]: s.enabled }), {} as Record<string, boolean>)
  )
  const [sessions, setSessions] = useState([
    { id: "current", name: "Chrome on Windows", details: "New York, USA - Current session", current: true },
    { id: "mobile", name: "Safari on iPhone", details: "New York, USA - 2 hours ago", current: false },
  ])
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const kycProgress = (kycSteps.filter((s) => s.status === "completed").length / kycSteps.length) * 100

  const passwordRules = useMemo(
    () => ({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    }),
    [newPassword]
  )

  const passwordStrength = useMemo(() => {
    const passed = Object.values(passwordRules).filter(Boolean).length
    return Math.round((passed / 4) * 100)
  }, [passwordRules])

  const completeKycStep = (stepId: number) => {
    setKycSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status: "completed" } : step))
    )
  }

  const handleAvatarUpload = (file: File | null) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
    toast.success("Profile Photo Updated")
  }

  const handleAddressUpload = (file: File | null) => {
    if (!file) return
    setAddressDocument(file.name)
    completeKycStep(3)
    toast.success("Address Document Uploaded")
  }

  const handleSelfieUpload = (file: File | null) => {
    if (!file) return
    setSelfieDocument(file.name)
    completeKycStep(4)
    toast.success("Selfie Uploaded")
  }

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Missing Fields", { description: "Please complete all password fields." })
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password Mismatch", { description: "New password and confirmation must match." })
      return
    }
    if (!Object.values(passwordRules).every(Boolean)) {
      toast.error("Weak Password", { description: "Please satisfy all password requirements." })
      return
    }
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    toast.success("Password Updated", { description: "Your password has been changed successfully." })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile & Security</h1>
          <p className="text-muted-foreground">Manage your account settings and verification status.</p>
        </div>

        {/* Profile Overview */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? <AvatarImage src={avatarPreview} alt="Profile" /> : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-foreground">John Doe</h2>
                  <Badge className="bg-chart-1/20 text-chart-1">Verified</Badge>
                </div>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <p className="text-sm text-muted-foreground mt-1">Member since January 2024</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Account Level:</span>
                  <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">Gold</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">KYC Status:</span>
                  <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">In Progress</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>First Name</FieldLabel>
                      <Input defaultValue="John" />
                    </Field>
                    <Field>
                      <FieldLabel>Last Name</FieldLabel>
                      <Input defaultValue="Doe" />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input type="email" defaultValue="john.doe@example.com" />
                  </Field>
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input type="tel" defaultValue="+1 (555) 123-4567" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Date of Birth</FieldLabel>
                      <Input type="date" defaultValue="1990-05-15" />
                    </Field>
                    <Field>
                      <FieldLabel>Country</FieldLabel>
                      <Select defaultValue="us">
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input defaultValue="123 Trading Street, New York, NY 10001" />
                  </Field>
                </FieldGroup>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => toast.success('Profile Updated', { description: 'Your changes have been saved' })}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Verification Progress</CardTitle>
                <CardDescription>Complete all steps to fully verify your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium text-foreground">{Math.round(kycProgress)}%</span>
                  </div>
                  <Progress value={kycProgress} className="h-2" />
                </div>

                <div className="space-y-4">
                  {kycSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border p-4",
                        step.status === "completed"
                          ? "border-chart-1/30 bg-chart-1/5"
                          : "border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          step.status === "completed"
                            ? "bg-chart-1 text-chart-1-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{step.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.status === "completed" ? "Verified" : "Pending verification"}
                        </p>
                      </div>
                      {step.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (step.id === 3 ? addressInputRef.current?.click() : selfieInputRef.current?.click())}
                        >
                          Upload
                        </Button>
                      )}
                      {step.status === "completed" && (
                        <Badge className="bg-chart-1/20 text-chart-1">Completed</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Proof of Address
                  </CardTitle>
                  <CardDescription>Upload a utility bill or bank statement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => addressInputRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium text-foreground">{addressDocument ? "Document selected" : "Click to upload"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addressDocument ?? "PDF, JPG or PNG (max 5MB)"}
                    </p>
                  </div>
                  <input
                    ref={addressInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleAddressUpload(e.target.files?.[0] ?? null)}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Selfie Verification
                  </CardTitle>
                  <CardDescription>Take a photo holding your ID document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => selfieInputRef.current?.click()}
                  >
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium text-foreground">{selfieDocument ? "Selfie selected" : "Click to capture"}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selfieDocument ?? "Or upload an existing photo"}</p>
                  </div>
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSelfieUpload(e.target.files?.[0] ?? null)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {securitySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">{setting.name}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      checked={settings[setting.id]}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, [setting.id]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 2FA Setup */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Secure your account with 2FA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-chart-1/10 border border-chart-1/30">
                  <CheckCircle2 className="h-8 w-8 text-chart-1" />
                  <div>
                    <p className="font-medium text-foreground">2FA is enabled</p>
                    <p className="text-sm text-muted-foreground">
                      Your account is protected with authenticator app
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                      setSettings((prev) => ({ ...prev, "2fa": !prev["2fa"] }))
                      toast.success(settings["2fa"] ? "2FA Disabled" : "2FA Enabled")
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Devices currently logged into your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", session.current ? "bg-chart-1/10" : "bg-secondary")}>
                        {session.current ? <Shield className="h-5 w-5 text-chart-1" /> : <Smartphone className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{session.name}</p>
                        <p className="text-sm text-muted-foreground">{session.details}</p>
                      </div>
                    </div>
                    {session.current ? (
                      <Badge className="bg-chart-1/20 text-chart-1">Active</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-chart-2"
                        onClick={() => {
                          setSessions((prev) => prev.filter((item) => item.id !== session.id))
                          toast.success('Session Revoked', { description: 'Device has been logged out' })
                        }}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-6">
            <Card className="bg-card border-border max-w-xl">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel>Current Password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>New Password</FieldLabel>
                    <Input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Confirm New Password</FieldLabel>
                    <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Field>
                </FieldGroup>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Password strength</span>
                    <span>{passwordStrength}%</span>
                  </div>
                  <Progress value={passwordStrength} className="h-2" />
                </div>
                <div className="mt-4 p-3 rounded-lg bg-secondary">
                  <p className="text-sm font-medium text-foreground mb-2">Password requirements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      {passwordRules.length ? <CheckCircle2 className="h-3 w-3 text-chart-1" /> : <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordRules.uppercase ? <CheckCircle2 className="h-3 w-3 text-chart-1" /> : <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordRules.number ? <CheckCircle2 className="h-3 w-3 text-chart-1" /> : <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      One number
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordRules.special ? <CheckCircle2 className="h-3 w-3 text-chart-1" /> : <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      One special character
                    </li>
                  </ul>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={handleUpdatePassword}>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
