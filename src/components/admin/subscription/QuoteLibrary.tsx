
import React, { useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Quote } from "@/components/subscription/DailyQuote";
import { useToast } from "@/hooks/use-toast";
import QuoteForm from "./QuoteForm";
import QuotesTable from "./QuotesTable";

interface QuoteLibraryProps {
  quotes: Quote[];
  onAddQuote: (quote: Omit<Quote, "id">) => void;
  onEditQuote: (quote: Quote) => void;
  onDeleteQuote: (quoteId: string) => void;
}

const QuoteLibrary: React.FC<QuoteLibraryProps> = ({
  quotes,
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
    <>
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
          <QuoteForm 
            quoteText={quoteText}
            quoteAuthor={quoteAuthor}
            quoteSource={quoteSource}
            editingQuote={editingQuote}
            setQuoteText={setQuoteText}
            setQuoteAuthor={setQuoteAuthor}
            setQuoteSource={setQuoteSource}
            resetQuoteForm={resetQuoteForm}
            handleSubmitQuote={handleSubmitQuote}
          />
        ) : (
          <QuotesTable 
            quotes={quotes}
            onEdit={startEditQuote}
            onDelete={handleDeleteQuote}
          />
        )}
      </CardContent>
    </>
  );
};

export default QuoteLibrary;
