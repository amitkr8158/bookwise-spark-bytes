
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Clock } from "lucide-react";

export interface NotificationSettings {
  salesNotificationsEnabled: boolean;
  frequency: number; // minimum seconds between notifications
  realSales: boolean; // show real sales or demo data
  displayDuration: number; // seconds to show notification
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  minPurchaseAmount: number; // minimum purchase amount to show notification
}

interface NotificationManagerProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  onTestNotification: () => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  settings,
  onSettingsChange,
  onTestNotification
}) => {
  const { toast } = useToast();
  
  const handleSettingsChange = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
    
    toast({
      title: "Settings updated",
      description: "Notification settings have been updated."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Notifications</CardTitle>
          <CardDescription>
            Configure how sales notifications appear to your visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Switch */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Sales Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Show recent purchase notifications to visitors
              </p>
            </div>
            <Switch
              checked={settings.salesNotificationsEnabled}
              onCheckedChange={(checked) => handleSettingsChange("salesNotificationsEnabled", checked)}
            />
          </div>
          
          {/* Data Source */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Use Real Sales Data</h3>
              <p className="text-sm text-muted-foreground">
                Show actual purchases instead of demo data
              </p>
            </div>
            <Switch
              checked={settings.realSales}
              onCheckedChange={(checked) => handleSettingsChange("realSales", checked)}
            />
          </div>
          
          {/* Notification Frequency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Notification Frequency</Label>
              <span className="text-sm">{settings.frequency} seconds</span>
            </div>
            <Slider
              value={[settings.frequency]}
              min={30}
              max={300}
              step={10}
              onValueChange={(value) => handleSettingsChange("frequency", value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Minimum time between notifications
            </p>
          </div>
          
          {/* Display Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Display Duration</Label>
              <span className="text-sm">{settings.displayDuration} seconds</span>
            </div>
            <Slider
              value={[settings.displayDuration]}
              min={3}
              max={15}
              step={1}
              onValueChange={(value) => handleSettingsChange("displayDuration", value[0])}
            />
            <p className="text-xs text-muted-foreground">
              How long each notification stays visible
            </p>
          </div>
          
          {/* Position */}
          <div className="space-y-2">
            <Label>Notification Position</Label>
            <Select 
              value={settings.position} 
              onValueChange={(value: NotificationSettings["position"]) => 
                handleSettingsChange("position", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Minimum Purchase Amount */}
          <div className="space-y-2">
            <Label>Minimum Purchase Amount</Label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-l-md">$</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={settings.minPurchaseAmount}
                onChange={(e) => handleSettingsChange("minPurchaseAmount", parseFloat(e.target.value))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Only show notifications for purchases above this amount
            </p>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline"
              onClick={onTestNotification}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Test Notification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationManager;
