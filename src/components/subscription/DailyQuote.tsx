
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
}

interface DailyQuoteProps {
  quote: Quote;
  onShare?: () => void;
}

const DailyQuote: React.FC<DailyQuoteProps> = ({ quote, onShare }) => {
  return (
    <Card className="max-w-lg border shadow-md">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Quote of the Day</h3>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <blockquote className="border-l-4 border-primary pl-4 italic">
          <p className="text-lg">{quote.text}</p>
        </blockquote>
        
        <div className="flex justify-end mt-4">
          <p className="text-sm font-medium text-muted-foreground">
            — {quote.author}
            {quote.source && (
              <span className="font-normal">, {quote.source}</span>
            )}
          </p>
        </div>
      </CardContent>
      {onShare && (
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={onShare}>
            Share this quote
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DailyQuote;
