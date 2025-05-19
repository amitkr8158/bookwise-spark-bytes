
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import { SubscriptionSettings } from "../SubscriptionManager";
import { useToast } from "@/hooks/use-toast";

interface EmailSettingsProps {
  settings: SubscriptionSettings;
  onSettingsChange: (settings: SubscriptionSettings) => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const { toast } = useToast();
  
  // Handle settings change
  const handleSettingsChange = (key: keyof SubscriptionSettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
    
    toast({
      title: "Settings updated",
      description: "Subscription settings have been updated."
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Switch */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Daily Quote Emails</h3>
          <p className="text-sm text-muted-foreground">
            When enabled, daily quotes will be sent to your subscribers
          </p>
        </div>
        <Switch
          checked={settings.isEnabled}
          onCheckedChange={(checked) => handleSettingsChange("isEnabled", checked)}
        />
      </div>
      
      {/* Delivery Time */}
      <div className="space-y-2">
        <Label htmlFor="send-time">Delivery Time</Label>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input 
            id="send-time"
            type="time"
            value={settings.sendTime}
            onChange={(e) => handleSettingsChange("sendTime", e.target.value)}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">
            Quotes will be sent daily at this time (24-hour format)
          </span>
        </div>
      </div>
      
      {/* Email Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-subject">Email Subject</Label>
          <Input
            id="email-subject"
            value={settings.emailSubject}
            onChange={(e) => handleSettingsChange("emailSubject", e.target.value)}
            placeholder="Your Daily Quote from BookName"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-template">Email Template</Label>
          <Textarea
            id="email-template"
            rows={6}
            value={settings.emailTemplate}
            onChange={(e) => handleSettingsChange("emailTemplate", e.target.value)}
            placeholder="Enter your email template here. Use {{QUOTE}}, {{AUTHOR}}, and {{SOURCE}} as placeholders."
          />
          <p className="text-xs text-muted-foreground">
            Use <code>{"{{QUOTE}}"}</code>, <code>{"{{AUTHOR}}"}</code>, and <code>{"{{SOURCE}}"}</code> as placeholders in your template.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
