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
import { LocationFilter } from "./location-filter";
import { DateFilter } from "./date-filter";
import { GroupSizeFilter } from "./group-size-filter";
import { BudgetFilter } from "./budget-filter";
import { TravelStyleFilter } from "./travel-style-filter";

export const FilterBar = () => {
  const { filterOptions, openDialog, setFilterOptions, setOpenDialog } = useSearchStore();

  // Format date to display in button
  const formatDateRange = (range: { from: Date; to: Date } | null) => {
    if (!range || !range.from) return null;

    const fromDate = format(range.from, "MMM d");
    const toDate = range.to ? format(range.to, "MMM d") : "";

    return toDate ? `${fromDate} - ${toDate}` : fromDate;
  };

  // Function to toggle dialogs
  const toggleDialog = (name: string) => {
    if (openDialog === name) {
      setOpenDialog(null);
    } else {
      setOpenDialog(name);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4">
      <TooltipProvider delayDuration={300}>
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
                    (openDialog === "location" || filterOptions.location) &&
                      "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => toggleDialog("location")}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
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
            <TooltipContent>{filterOptions.location || "Select location"}</TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <LocationFilter
              onClose={() => setOpenDialog(null)}
              selectedLocation={filterOptions.location}
              setSelectedLocation={(location) =>
                setFilterOptions({ location })
              }
            />
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
                    (openDialog === "dates" || filterOptions.dateRange) &&
                      "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => toggleDialog("dates")}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
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
            <TooltipContent>{formatDateRange(filterOptions.dateRange) || "Select dates"}</TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <DateFilter
              onClose={() => setOpenDialog(null)}
              selectedDate={filterOptions.dateRange}
              setSelectedDate={(dateRange) =>
                setFilterOptions({ dateRange })
              }
            />
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
                    (openDialog === "group" || filterOptions.groupSize !== 2) &&
                      "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => toggleDialog("group")}
                >
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {filterOptions.groupSize}{" "}
                    {filterOptions.groupSize === 1 ? "Person" : "People"}
                  </span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{filterOptions.groupSize} {filterOptions.groupSize === 1 ? "Person" : "People"}</TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <GroupSizeFilter
              onClose={() => setOpenDialog(null)}
              groupSize={filterOptions.groupSize}
              setGroupSize={(groupSize) =>
                setFilterOptions({ groupSize })
              }
            />
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
                    (openDialog === "budget" || filterOptions.budget) &&
                      "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => toggleDialog("budget")}
                >
                  <IndianRupee className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {filterOptions.budget
                      ? filterOptions.budget.label
                      : "Budget"}
                  </span>
                  {filterOptions.budget && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{filterOptions.budget ? filterOptions.budget.label : "Select budget"}</TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <BudgetFilter
              onClose={() => setOpenDialog(null)}
              selectedBudget={filterOptions.budget}
              setSelectedBudget={(budget) =>
                setFilterOptions({ budget })
              }
            />
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
                    (openDialog === "style" ||
                      filterOptions.travelStyle.length > 0) &&
                      "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => toggleDialog("style")}
                >
                  <Compass className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {filterOptions.travelStyle.length > 0
                      ? `${filterOptions.travelStyle.length} ${
                          filterOptions.travelStyle.length === 1
                            ? "Style"
                            : "Styles"
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
            <TooltipContent>
              {filterOptions.travelStyle.length 
                ? `${filterOptions.travelStyle.length} travel ${filterOptions.travelStyle.length === 1 ? "style" : "styles"} selected`
                : "Select travel styles"}
            </TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <TravelStyleFilter
              onClose={() => setOpenDialog(null)}
              selectedStyles={filterOptions.travelStyle}
              setSelectedStyles={(styles) =>
                setFilterOptions({ travelStyle: styles })
              }
            />
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </div>
  );
};