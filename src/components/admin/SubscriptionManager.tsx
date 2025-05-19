
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Quote } from "@/components/subscription/DailyQuote";
import EmailSettings from "./subscription/EmailSettings";
import QuoteLibrary from "./subscription/QuoteLibrary";

export interface SubscriptionSettings {
  isEnabled: boolean;
  sendTime: string;
  emailSubject: string;
  emailTemplate: string;
}

interface SubscriptionManagerProps {
  settings: SubscriptionSettings;
  quotes: Quote[];
  onSettingsChange: (settings: SubscriptionSettings) => void;
  onAddQuote: (quote: Omit<Quote, "id">) => void;
  onEditQuote: (quote: Quote) => void;
  onDeleteQuote: (quoteId: string) => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  settings,
  quotes,
  onSettingsChange,
  onAddQuote,
  onEditQuote,
  onDeleteQuote,
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Subscription Settings</CardTitle>
          <CardDescription>
            Configure how and when daily quotes are sent to your subscribers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailSettings 
            settings={settings} 
            onSettingsChange={onSettingsChange} 
          />
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast({ title: "Settings saved" })}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
      
      {/* Quotes Management */}
      <Card>
        <QuoteLibrary 
          quotes={quotes}
          onAddQuote={onAddQuote}
          onEditQuote={onEditQuote}
          onDeleteQuote={onDeleteQuote}
        />
      </Card>
    </div>
  );
};

export default SubscriptionManager;
