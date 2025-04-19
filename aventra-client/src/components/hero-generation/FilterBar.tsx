import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/searchStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  MapPin, Calendar, Users, IndianRupee, Compass, Check 
} from "lucide-react";
import { BudgetOption} from "@/types/hero";
import { LocationFilter } from "./location-filter";
import { DateFilter } from "./date-filter";
import { GroupSizeFilter } from "./group-size-filter";
import { BudgetFilter } from "./budget-filter";
import { TravelStyleFilter } from "./travel-style-filter";
import { JSX } from "react";

/**
 * @component FilterBar
 * @description An interactive filter bar that allows users to refine their trip search
 * with various criteria including location, dates, group size, budget, and travel style.
 * Each filter opens a dialog with more detailed options.
 * @returns {JSX.Element} Rendered filter bar component
 */
export const FilterBar = (): JSX.Element => {
  const { filterOptions, openDialog, setFilterOptions, setOpenDialog } = useSearchStore();

  /**
   * Formats a date range for display in the filter button
   * @param {Object | null} range - Date range object with from and to properties
   * @returns {string | null} - Formatted date range string or null if no range
   */
  const formatDateRange = (range: { from: Date; to: Date } | null): string | null => {
    if (!range || !range.from) return null;

    const fromDate = format(range.from, "MMM d");
    const toDate = range.to ? format(range.to, "MMM d") : "";

    return toDate ? `${fromDate} - ${toDate}` : fromDate;
  };

  /**
   * Toggles the dialog open/closed state
   * @param {string} name - The name of the dialog to toggle
   */
  const toggleDialog = (name: string): void => {
    setOpenDialog(openDialog === name ? null : name);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <TooltipProvider delayDuration={200}>
        {/* Location Filter */}
        <Dialog 
          open={openDialog === "location"} 
          onOpenChange={(open) => setOpenDialog(open ? "location" : null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    "transition-all duration-200",
                    (openDialog === "location" || !!filterOptions.location) && 
                      "bg-primary/20 border-primary/30 shadow-sm"
                  )}
                  onClick={() => toggleDialog("location")}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline ml-1 mr-0.5">
                    {filterOptions.location || "Location"}
                  </span>
                  {filterOptions.location && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {filterOptions.location || "Select location"}
            </TooltipContent>
          </Tooltip>
          
          <DialogContent className="sm:max-w-[425px]">
            {openDialog === "location" && (
              <LocationFilter
                onClose={() => setOpenDialog(null)}
                selectedLocation={filterOptions.location}
                setSelectedLocation={(location: string | null) =>
                  setFilterOptions({ location })
                }
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dates Filter */}
        <Dialog 
          open={openDialog === "dates"} 
          onOpenChange={(open) => setOpenDialog(open ? "dates" : null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    "transition-all duration-200",
                    (openDialog === "dates" || !!filterOptions.dateRange) && 
                      "bg-primary/20 border-primary/30 shadow-sm"
                  )}
                  onClick={() => toggleDialog("dates")}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline ml-1 mr-0.5">
                    {formatDateRange(filterOptions.dateRange) || "Dates"}
                  </span>
                  {filterOptions.dateRange && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {formatDateRange(filterOptions.dateRange) || "Select dates"}
            </TooltipContent>
          </Tooltip>
          
          <DialogContent className="sm:max-w-[425px]">
            {openDialog === "dates" && (
              <DateFilter
                onClose={() => setOpenDialog(null)}
                selectedDate={filterOptions.dateRange}
                setSelectedDate={(dateRange: { from: Date; to: Date } | null) =>
                  setFilterOptions({ dateRange })
                }
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Group Size Filter */}
        <Dialog 
          open={openDialog === "group"} 
          onOpenChange={(open) => setOpenDialog(open ? "group" : null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    "transition-all duration-200",
                    (openDialog === "group" || filterOptions.groupSize !== 2) && 
                      "bg-primary/20 border-primary/30 shadow-sm"
                  )}
                  onClick={() => toggleDialog("group")}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline ml-1 mr-0.5">
                    {`${filterOptions.groupSize} ${filterOptions.groupSize === 1 ? "Person" : "People"}`}
                  </span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {`${filterOptions.groupSize} ${filterOptions.groupSize === 1 ? "Person" : "People"}`}
            </TooltipContent>
          </Tooltip>
          
          <DialogContent className="sm:max-w-[425px]">
            {openDialog === "group" && (
              <GroupSizeFilter
                onClose={() => setOpenDialog(null)}
                groupSize={filterOptions.groupSize}
                setGroupSize={(groupSize: number) =>
                  setFilterOptions({ groupSize })
                }
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Budget Filter */}
        <Dialog 
          open={openDialog === "budget"} 
          onOpenChange={(open) => setOpenDialog(open ? "budget" : null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    "transition-all duration-200",
                    (openDialog === "budget" || !!filterOptions.budget) && 
                      "bg-primary/20 border-primary/30 shadow-sm"
                  )}
                  onClick={() => toggleDialog("budget")}
                >
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline ml-1 mr-0.5">
                    {filterOptions.budget ? filterOptions.budget.label : "Budget"}
                  </span>
                  {filterOptions.budget && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {filterOptions.budget ? filterOptions.budget.label : "Select budget"}
            </TooltipContent>
          </Tooltip>
          
          <DialogContent className="sm:max-w-[425px]">
            {openDialog === "budget" && (
              <BudgetFilter
                onClose={() => setOpenDialog(null)}
                selectedBudget={filterOptions.budget}
                setSelectedBudget={(budget: BudgetOption | null) =>
                  setFilterOptions({ budget })
                }
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Travel Style Filter */}
        <Dialog 
          open={openDialog === "style"} 
          onOpenChange={(open) => setOpenDialog(open ? "style" : null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    "transition-all duration-200",
                    (openDialog === "style" || filterOptions.travelStyle.length > 0) && 
                      "bg-primary/20 border-primary/30 shadow-sm"
                  )}
                  onClick={() => toggleDialog("style")}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline ml-1 mr-0.5">
                    {filterOptions.travelStyle.length > 0
                      ? `${filterOptions.travelStyle.length} ${
                          filterOptions.travelStyle.length === 1 ? "Style" : "Styles"
                        }`
                      : "Travel Style"}
                  </span>
                  {filterOptions.travelStyle.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {filterOptions.travelStyle.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {filterOptions.travelStyle.length 
                ? `${filterOptions.travelStyle.length} travel ${filterOptions.travelStyle.length === 1 ? "style" : "styles"} selected`
                : "Select travel styles"}
            </TooltipContent>
          </Tooltip>
          
          <DialogContent className="sm:max-w-[425px]">
            {openDialog === "style" && (
              <TravelStyleFilter
                onClose={() => setOpenDialog(null)}
                selectedStyles={filterOptions.travelStyle}
                setSelectedStyles={(styles: string[]) =>
                  setFilterOptions({ travelStyle: styles })
                }
              />
            )}
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </div>
  );
};