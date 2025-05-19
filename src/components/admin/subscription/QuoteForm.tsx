
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Quote } from "@/components/subscription/DailyQuote";

interface QuoteFormProps {
  quoteText: string;
  quoteAuthor: string;
  quoteSource: string;
  editingQuote: Quote | null;
  setQuoteText: (text: string) => void;
  setQuoteAuthor: (author: string) => void;
  setQuoteSource: (source: string) => void;
  resetQuoteForm: () => void;
  handleSubmitQuote: (e: React.FormEvent) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  quoteText,
  quoteAuthor,
  quoteSource,
  editingQuote,
  setQuoteText,
  setQuoteAuthor,
  setQuoteSource,
  resetQuoteForm,
  handleSubmitQuote,
}) => {
  return (
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
  );
};

export default QuoteForm;
