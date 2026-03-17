"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Bell,
  Globe,
  Moon,
  Palette,
  Mail,
  MessageSquare,
  Smartphone,
  Volume2,
  Save,
  Sparkles,
  Shield,
  SlidersHorizontal,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

const notificationSettings = [
  {
    id: "email-trades",
    category: "Email",
    name: "Trade Notifications",
    description: "Get notified about executed trades",
    enabled: true,
  },
  {
    id: "email-deposits",
    category: "Email",
    name: "Deposit/Withdrawal Updates",
    description: "Updates on your transactions",
    enabled: true,
  },
  {
    id: "email-marketing",
    category: "Email",
    name: "Marketing & Promotions",
    description: "News about promotions and bonuses",
    enabled: false,
  },
  {
    id: "push-trades",
    category: "Push",
    name: "Trade Alerts",
    description: "Real-time trade notifications",
    enabled: true,
  },
  {
    id: "push-price",
    category: "Push",
    name: "Price Alerts",
    description: "Get notified when price targets are hit",
    enabled: true,
  },
  {
    id: "push-competitions",
    category: "Push",
    name: "Competition Updates",
    description: "Leaderboard changes and results",
    enabled: true,
  },
]

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const SETTINGS_STORAGE_KEY = "forexpro-settings"
  const [settings, setSettings] = useState(
    notificationSettings.reduce((acc, s) => ({ ...acc, [s.id]: s.enabled }), {} as Record<string, boolean>)
  )
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("utc-5")
  const [appTheme, setAppTheme] = useState("dark")
  const [soundEffects, setSoundEffects] = useState("on")

  const emailSettings = notificationSettings.filter((s) => s.category === "Email")
  const pushSettings = notificationSettings.filter((s) => s.category === "Push")

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as {
        toggles?: Record<string, boolean>
        language?: string
        timezone?: string
        appTheme?: string
        soundEffects?: string
      }
      if (parsed.toggles) setSettings(parsed.toggles)
      if (parsed.language) setLanguage(parsed.language)
      if (parsed.timezone) setTimezone(parsed.timezone)
      if (parsed.appTheme) setAppTheme(parsed.appTheme)
      if (parsed.soundEffects) setSoundEffects(parsed.soundEffects)
    } catch {
      // Ignore invalid local storage payloads.
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        toggles: settings,
        language,
        timezone,
        appTheme,
        soundEffects,
      })
    )
    setTheme(appTheme)
    toast.success('Settings Saved', { description: 'Your preferences have been updated' })
  }

  const restoreDefaults = () => {
    setSettings(notificationSettings.reduce((acc, s) => ({ ...acc, [s.id]: s.enabled }), {} as Record<string, boolean>))
    setLanguage("en")
    setTimezone("utc-5")
    setAppTheme("dark")
    setSoundEffects("on")
    toast.success("Defaults Restored")
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences.</p>
        </div>

        <Card className="border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Configuration Profile</p>
                <p className="text-lg font-semibold text-foreground inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Enterprise Preference Suite
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2" onClick={restoreDefaults}>
                  <SlidersHorizontal className="h-4 w-4" />
                  Restore Defaults
                </Button>
                <Button className="gap-2" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save All Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-card border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your trading experience</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </FieldLabel>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Timezone
                  </FieldLabel>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                      <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Theme
                  </FieldLabel>
                  <Select value={appTheme} onValueChange={setAppTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Sound Effects
                  </FieldLabel>
                  <Select value={soundEffects} onValueChange={setSoundEffects}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sound settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="bg-card border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>Choose what email notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailSettings.map((setting) => (
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

        {/* Push Notifications */}
        <Card className="bg-card border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>Manage real-time push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pushSettings.map((setting) => (
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Settings Summary
            </CardTitle>
            <CardDescription>Review your active configuration before saving</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Theme</p>
              <p className="font-medium text-foreground capitalize">{appTheme}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Language</p>
              <p className="font-medium text-foreground uppercase">{language}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Timezone</p>
              <p className="font-medium text-foreground">{timezone}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Enabled Alerts</p>
              <p className="font-medium text-foreground">
                {Object.values(settings).filter(Boolean).length}/{Object.values(settings).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
