"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { 
  Wallet, Banknote, TrendingUp, Search, X, Info, Check, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { BUDGET_RANGES, currencies } from "@/lib/constants/currencies";

export function BudgetInput() {
  const { setValue, watch } = useFormContext<TripFormValues>();
  
  const [open, setOpen] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const budget = watch("budget.ceiling") || 0;
  const currency = watch("budget.currency") || "USD";
  const [currencySearch, setCurrencySearch] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [budgetType, setBudgetType] = useState<string>(
    budget <= BUDGET_RANGES[currency as keyof typeof BUDGET_RANGES]?.budget ? "budget" :
    budget <= BUDGET_RANGES[currency as keyof typeof BUDGET_RANGES]?.moderate ? "moderate" :
    budget <= BUDGET_RANGES[currency as keyof typeof BUDGET_RANGES]?.luxury ? "luxury" : "custom"
  );
  
  // Get currency details
  const currencyDetails = currencies.find(c => c.code === currency) || 
                          { code: "USD", symbol: "$", name: "US Dollar" };
  
  // Get budget ranges for the selected currency
  const budgetRanges = BUDGET_RANGES[currency as keyof typeof BUDGET_RANGES] || BUDGET_RANGES.DEFAULT;
  
  // Filter currencies based on search term
  const filteredCurrencies = !currencySearch
    ? currencies
    : currencies.filter(curr => {
        const searchTerm = currencySearch.toLowerCase();
        return curr.code.toLowerCase().includes(searchTerm) ||
               curr.name.toLowerCase().includes(searchTerm);
      });

  /**
   * Format currency values considering different currency formats
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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
   * Get max value for the slider based on current currency
   */
  const getMaxSliderValue = () => {
    const multiplier = currency === "JPY" ? 10 :
                       currency === "INR" ? 2 : 5;
    return budgetRanges.luxury * multiplier;
  };

  /**
   * Handle currency change
   */
  const handleCurrencyChange = (newCurrency: string) => {
    setValue("budget.currency", newCurrency);
    setCurrencySearch("");
    setInputError(null);
    setShowCurrencyDropdown(false);
    
    // Adjust budget based on new currency
    const oldRanges = BUDGET_RANGES[currency as keyof typeof BUDGET_RANGES] || BUDGET_RANGES.DEFAULT;
    const newRanges = BUDGET_RANGES[newCurrency as keyof typeof BUDGET_RANGES] || BUDGET_RANGES.DEFAULT;
    
    if (budgetType !== "custom") {
      setValue("budget.ceiling", newRanges[budgetType as keyof typeof newRanges]);
    } else {
      // Approximate conversion for custom amount
      const ratio = newRanges.moderate / oldRanges.moderate;
      setValue("budget.ceiling", Math.round(budget * ratio));
    }
  };

  /**
   * Handle budget type change
   */
  const handleBudgetTypeChange = (value: string) => {
    setBudgetType(value);
    setInputError(null);
    
    if (value !== "custom") {
      setValue("budget.ceiling", budgetRanges[value as keyof typeof budgetRanges]);
    }
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
      setValue("budget.ceiling", val);
    }
  };

  /**
   * Get budget description
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

  // Display value for the button
  const getDisplayValue = () => {
    if (!budget) return 'Set budget';
    
    const icon = budgetType !== 'custom' ? 
      (budgetType === 'budget' ? '🌱' : budgetType === 'moderate' ? '✨' : '💎') : '';
      
    return `${icon} ${currencyDetails.symbol}${formatValue(budget)}`;
  };

  /**
   * Handle applying budget selections and closing dialog
   */
  const handleApply = () => {
    setOpen(false);
  };

  /**
   * Clear all selections and reset to defaults
   */
  const handleClear = () => {
    setValue("budget.ceiling", 0);
    setBudgetType("budget");
    setInputError(null);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="h-10 gap-2 px-3 font-normal relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/30 to-primary/10 group-hover:w-full transition-all duration-300 opacity-20" />
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {getDisplayValue()}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-auto" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Wallet className="h-4 w-4 text-primary" />
              Budget Preferences
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[70vh] overflow-auto pr-1 -mr-1">
            <div className="space-y-4">
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
                
                {/* Custom Currency Dropdown */}
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="w-full h-9 justify-between pl-3 pr-2 font-normal"
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-8 flex justify-center font-medium">
                        {currencyDetails.symbol}
                      </Badge>
                      <span className="font-medium">{currencyDetails.code}</span>
                      <span className="text-muted-foreground text-xs truncate">
                        {currencyDetails.name}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                  
                  {showCurrencyDropdown && (
                    <div className="absolute z-50 top-full left-0 w-full mt-1 rounded-md border bg-popover shadow-md">
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search currencies..."
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            className="pl-8 h-9"
                            aria-label="Search currencies"
                            autoComplete="off"
                          />
                          {currencySearch && (
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-7 w-7 p-0 rounded-full"
                              onClick={() => setCurrencySearch('')}
                              type="button"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <ScrollArea className="h-[200px]">
                        {filteredCurrencies.length === 0 ? (
                          <div className="py-6 text-center text-muted-foreground">
                            No currencies found
                          </div>
                        ) : (
                          <div className="p-1">
                            {filteredCurrencies.map((curr) => (
                              <Button
                                key={curr.code}
                                variant="ghost"
                                className="w-full justify-start py-1.5 px-2 h-auto"
                                onClick={() => handleCurrencyChange(curr.code)}
                                type="button"
                              >
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="w-8 flex justify-center font-medium">
                                    {curr.symbol}
                                  </Badge>
                                  <span className="font-medium">{curr.code}</span>
                                  <span className="text-muted-foreground text-xs truncate">
                                    {curr.name}
                                  </span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </div>
                
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
                  value={budgetType}
                  onValueChange={handleBudgetTypeChange}
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
                              {formatCurrency(budget)}
                            </Badge>
                          </div>
                          
                          <Slider
                            value={[budget]}
                            max={getMaxSliderValue()}
                            step={currency === "JPY" ? 1000 : currency === "INR" ? 500 : 50}
                            onValueChange={(vals) => {
                              setValue("budget.ceiling", vals[0]);
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
                              value={budget}
                              onChange={handleCustomAmountChange}
                              className="pl-6 h-9"
                              aria-label="Custom budget amount"
                              min={0}
                              max={getMaxSliderValue() * 2}
                            />
                          </div>
                          
                          {inputError ? (
                            <div className="flex items-center gap-1 text-destructive text-xs mt-1.5">
                              <X className="h-3 w-3" />
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
            </div>
          </div>
          
          <DialogFooter className="flex justify-between gap-4 pt-4 border-t mt-4">
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
              type="button"
              onClick={handleApply}
              size="sm"
              className="gap-1.5 px-5"
            >
              <Check className="h-3.5 w-3.5" />
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}