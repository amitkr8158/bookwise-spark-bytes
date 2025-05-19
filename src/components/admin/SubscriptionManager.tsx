
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Quote } from "@/components/subscription/DailyQuote";
import { Calendar, Plus, Pencil, Trash } from "lucide-react";
import { format } from "date-fns";

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
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteSource, setQuoteSource] = useState("");
  
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
  
  // Initialize quote form with quote data for editing
  const startEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteText(quote.text);
    setQuoteAuthor(quote.author);
    setQuoteSource(quote.source || "");
    setIsAddingQuote(true);
  };
  
  // Reset quote form
  const resetQuoteForm = () => {
    setQuoteText("");
    setQuoteAuthor("");
    setQuoteSource("");
    setEditingQuote(null);
    setIsAddingQuote(false);
  };
  
  // Handle quote form submission
  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteText.trim() || !quoteAuthor.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both quote text and author.",
        variant: "destructive",
      });
      return;
    }
    
    const quoteData = {
      text: quoteText,
      author: quoteAuthor,
      source: quoteSource || undefined,
    };
    
    if (editingQuote) {
      onEditQuote({ ...quoteData, id: editingQuote.id });
      toast({
        title: "Quote updated",
        description: "The quote has been updated successfully.",
      });
    } else {
      onAddQuote(quoteData);
      toast({
        title: "Quote added",
        description: "New quote has been added successfully.",
      });
    }
    
    resetQuoteForm();
  };
  
  // Handle quote deletion
  const handleDeleteQuote = (quoteId: string) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      onDeleteQuote(quoteId);
      toast({
        title: "Quote deleted",
        description: "The quote has been removed.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Subscription Settings</CardTitle>
          <CardDescription>
            Configure how and when daily quotes are sent to your subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast({ title: "Settings saved" })}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
      
      {/* Quotes Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quote Library</CardTitle>
            <CardDescription>
              Manage the quotes that will be sent to your subscribers
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingQuote(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Quote
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingQuote ? (
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quote-text">Quote Text</Label>
                <Textarea
                  id="quote-text"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="Enter the quote text..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quote-author">Author</Label>
                  <Input
                    id="quote-author"
                    value={quoteAuthor}
                    onChange={(e) => setQuoteAuthor(e.target.value)}
                    placeholder="Quote author"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quote-source">Source (Optional)</Label>
                  <Input
                    id="quote-source"
                    value={quoteSource}
                    onChange={(e) => setQuoteSource(e.target.value)}
                    placeholder="Book or source"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetQuoteForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuote ? "Update Quote" : "Add Quote"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No quotes added yet. Add your first quote to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="max-w-xs truncate">
                          {quote.text.length > 100
                            ? `${quote.text.substring(0, 100)}...`
                            : quote.text}
                        </TableCell>
                        <TableCell>{quote.author}</TableCell>
                        <TableCell>{quote.source || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => startEditQuote(quote)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteQuote(quote.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
