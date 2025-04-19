"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { BUDGET_RANGES, currencies } from "@/lib/constants/currencies";
import { Check, Wallet, Banknote, TrendingUp, Search, X, Info, AlertTriangle } from "lucide-react";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * @component BudgetFilter
 * @description A comprehensive budget selection component that allows users to
 * set their travel budget preferences with currency selection and various budget tiers.
 */
interface BudgetFilterProps {
  selectedBudget: BudgetOption | null;
  setSelectedBudget: (budget: BudgetOption | null) => void;
  onClose: () => void;
}

export interface BudgetOption {
  type: string;
  label: string;
  maxAmount?: number;
  currency: string;
}

export function BudgetFilter({ selectedBudget, setSelectedBudget, onClose }: BudgetFilterProps) {
  // Initialize state from props or defaults
  const [budgetType, setBudgetType] = useState<string>(
    selectedBudget?.type || "budget"
  );
  
  const [customAmount, setCustomAmount] = useState<number>(
    (selectedBudget?.type === "custom" && selectedBudget?.maxAmount) 
      ? selectedBudget.maxAmount 
      : 500
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    selectedBudget?.currency || "INR"
  );
  
  const [currencySearch, setCurrencySearch] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Get currency details for the selected currency
  const currencyDetails = currencies.find(c => c.code === selectedCurrency) || 
                         { code: "INR", symbol: "₹", name: "Indian Rupee" };

  // Get budget ranges for the selected currency
  const budgetRanges = BUDGET_RANGES[selectedCurrency as keyof typeof BUDGET_RANGES] || BUDGET_RANGES.DEFAULT;
  
  // Filter currencies based on search term
  const filteredCurrencies = !currencySearch 
    ? currencies
    : currencies.filter(currency => {
        const searchTerm = currencySearch.toLowerCase();
        return currency.code.toLowerCase().includes(searchTerm) || 
              currency.name.toLowerCase().includes(searchTerm);
      });
  
  /**
   * Apply the selected budget and close the dialog
   */
  const handleApply = () => {
    if (!budgetType) {
      setSelectedBudget(null);
      onClose();
      return;
    }
    
    if (budgetType === "custom") {
      // Validate custom amount
      if (customAmount <= 0) {
        setInputError("Please enter a valid amount greater than 0");
        return;
      }
      
      setSelectedBudget({
        type: "custom",
        label: `Custom (Max: ${currencyDetails.symbol}${formatValue(customAmount)})`,
        maxAmount: customAmount,
        currency: selectedCurrency
      });
    } else {
      const maxAmount = budgetRanges[budgetType as keyof typeof budgetRanges];
      const labels: Record<string, string> = {
        budget: "Budget",
        moderate: "Moderate",
        luxury: "Luxury"
      };
      
      setSelectedBudget({
        type: budgetType,
        label: `${labels[budgetType]} (${currencyDetails.symbol}${formatValue(maxAmount)})`,
        maxAmount: maxAmount,
        currency: selectedCurrency
      });
    }
    onClose();
  };

  /**
   * Clear all selections and reset to defaults
   */
  const handleClear = () => {
    setBudgetType("");
    setCustomAmount(500);
    setSelectedCurrency("INR");
    setInputError(null);
  };

  /**
   * Handle currency change and recalculate amounts
   */
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setCurrencySearch("");
    setInputError(null);
    
    // Adjust custom amount based on new currency
    if (budgetType === "custom") {
      const currentDetails = currencies.find(c => c.code === selectedCurrency);
      const newDetails = currencies.find(c => c.code === currency);
      
      if (currentDetails && newDetails) {
        const conversionFactor = 
          currency === "JPY" ? 100 : 
          currency === "INR" ? 75 : 1;
          
        setCustomAmount(Math.round(customAmount * conversionFactor));
      }
    }
  };

  /**
   * Get max value for the slider based on current currency
   */
  const getMaxSliderValue = () => {
    const multiplier = selectedCurrency === "JPY" ? 10 : 
                       selectedCurrency === "INR" ? 2 : 5;
    return budgetRanges.luxury * multiplier;
  };

  /**
   * Format currency values considering different currency formats
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  /**
   * Format a number value with commas without currency symbol
   */
  const formatValue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Handle custom amount input change with validation
   */
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError(null);
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      if (val < 0) {
        setInputError("Amount cannot be negative");
        return;
      }
      if (val > getMaxSliderValue() * 2) {
        setInputError("Amount exceeds reasonable limits");
        return;
      }
      setCustomAmount(val);
    }
  };

  /**
   * Get appropriate help text based on budget type
   */
  const getBudgetDescription = (type: string) => {
    switch (type) {
      case 'budget':
        return "Hostels, guesthouses, local street food, public transport";
      case 'moderate':
        return "3-star hotels, casual restaurants, some attractions";
      case 'luxury':
        return "4-5 star hotels, fine dining, premium experiences";
      default:
        return "Set a custom daily budget limit";
    }
  };

  // Icons for budget tiers
  const budgetIcons = {
    budget: <Banknote className="h-5 w-5 text-emerald-500" />,
    moderate: <Wallet className="h-5 w-5 text-blue-500" />,
    luxury: <TrendingUp className="h-5 w-5 text-purple-500" />
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="h-4 w-4 text-primary" />
            Budget Preferences
          </DialogTitle>
        </DialogHeader>
        
        {/* Currency Selection with Search */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="currency-select" className="text-sm font-medium block">
              Select Currency
            </Label>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs max-w-[220px]">
                Choose the currency you want to use for your budget planning.
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger 
              className="w-full h-9 border-muted-foreground/20" 
              id="currency-select"
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]" onCloseAutoFocus={(e) => e.preventDefault()}>
              <div className="p-2 border-b sticky top-0 bg-background z-10">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search currencies..."
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    className="pl-8 h-9"
                    aria-label="Search currencies"
                  />
                  {currencySearch && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-1 top-1 h-7 w-7 p-0 rounded-full"
                      onClick={() => setCurrencySearch('')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[200px] pr-3">
                {filteredCurrencies.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground">
                    No currencies found
                  </div>
                ) : (
                  <>
                    <SelectGroup>
                      <SelectLabel>Currencies</SelectLabel>
                      {filteredCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code} className="py-1.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-8 flex justify-center font-medium">
                              {currency.symbol}
                            </Badge>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground text-xs truncate">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </>
                )}
              </ScrollArea>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/30 rounded-md text-xs">
            <Badge variant="outline" className="bg-background h-5 px-1.5">
              {currencyDetails.symbol}
            </Badge>
            <span>
              All prices will be displayed in {currencyDetails.name}
            </span>
          </div>
        </div>
        
        {/* Budget Selection - Tabs UI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium block">
              Choose Budget Range
            </Label>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs max-w-[220px]">
                Select a budget category that matches your spending preferences.
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Tabs 
            defaultValue={budgetType || "budget"} 
            value={budgetType} 
            onValueChange={(value) => {
              setBudgetType(value);
              setInputError(null);
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="moderate">Moderate</TabsTrigger>
              <TabsTrigger value="luxury">Luxury</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <div className="mt-3 bg-card rounded-lg border shadow-sm overflow-hidden">
              <TabsContent value="budget" className="p-4 m-0 space-y-3">
                <div className="flex items-center gap-3">
                  {budgetIcons.budget}
                  <div>
                    <h3 className="font-medium">Budget Friendly</h3>
                    <p className="text-xs text-muted-foreground">For travelers on a budget</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Daily budget up to:</div>
                    <div className="font-semibold mt-0.5 text-emerald-600">{formatCurrency(budgetRanges.budget)}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Typically includes:</div>
                    <ul className="mt-0.5 list-disc pl-3 space-y-0.5">
                      <li>Budget accommodations</li>
                      <li>Affordable dining</li>
                      <li>Basic activities</li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {getBudgetDescription('budget')}
                </p>
              </TabsContent>
              
              <TabsContent value="moderate" className="p-4 m-0 space-y-3">
                <div className="flex items-center gap-3">
                  {budgetIcons.moderate}
                  <div>
                    <h3 className="font-medium">Moderate</h3>
                    <p className="text-xs text-muted-foreground">Balanced comfort and value</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Daily budget up to:</div>
                    <div className="font-semibold mt-0.5 text-blue-600">{formatCurrency(budgetRanges.moderate)}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Typically includes:</div>
                    <ul className="mt-0.5 list-disc pl-3 space-y-0.5">
                      <li>Mid-range accommodations</li>
                      <li>Quality dining options</li>
                      <li>Popular attractions</li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {getBudgetDescription('moderate')}
                </p>
              </TabsContent>
              
              <TabsContent value="luxury" className="p-4 m-0 space-y-3">
                <div className="flex items-center gap-3">
                  {budgetIcons.luxury}
                  <div>
                    <h3 className="font-medium">Luxury</h3>
                    <p className="text-xs text-muted-foreground">Premium experiences</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Daily budget up to:</div>
                    <div className="font-semibold mt-0.5 text-purple-600">{formatCurrency(budgetRanges.luxury)}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Typically includes:</div>
                    <ul className="mt-0.5 list-disc pl-3 space-y-0.5">
                      <li>Luxury accommodations</li>
                      <li>Fine dining experiences</li>
                      <li>Premium activities</li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {getBudgetDescription('luxury')}
                </p>
              </TabsContent>
              
              <TabsContent value="custom" className="p-4 m-0 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Custom Budget</h3>
                    <p className="text-xs text-muted-foreground">Set your own daily limit</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Daily budget maximum:</span>
                      <Badge className="text-sm font-semibold" variant="secondary">
                        {formatCurrency(customAmount)}
                      </Badge>
                    </div>
                    
                    <Slider
                      value={[customAmount]}
                      max={getMaxSliderValue()}
                      step={selectedCurrency === "JPY" ? 1000 : selectedCurrency === "INR" ? 500 : 50}
                      onValueChange={(vals) => {
                        setCustomAmount(vals[0]);
                        setInputError(null);
                      }}
                      className="my-3"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(0)}</span>
                      <span>{formatCurrency(getMaxSliderValue() / 2)}</span>
                      <span>{formatCurrency(getMaxSliderValue())}</span>
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-muted-foreground text-sm">{currencyDetails.symbol}</span>
                      </div>
                      <Input
                        type="number"
                        id="custom-amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="pl-6 h-9"
                        aria-label="Custom budget amount"
                        min={0}
                        max={getMaxSliderValue() * 2}
                      />
                    </div>
                    
                    {inputError ? (
                      <div className="flex items-center gap-1 text-destructive text-xs mt-1.5">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{inputError}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Enter your maximum daily budget amount
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      
        {/* Action buttons in dialog footer */}
        <DialogFooter className="flex justify-between gap-4 pt-3 border-t mt-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleClear}
            size="sm"
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
          <Button 
            type="submit"
            onClick={handleApply}
            size="sm"
            className="gap-1.5 px-5"
            disabled={!budgetType || (budgetType === "custom" && (customAmount <= 0 || !!inputError))}
          >
            <Check className="h-3.5 w-3.5" />
            Apply Budget
          </Button>
        </DialogFooter>
      </div>
    </TooltipProvider>
  );
}