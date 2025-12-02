import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
}

export const CreateGroupDialog = ({
  open,
  onOpenChange,
  onGroupCreated,
}: CreateGroupDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayPreference, setDayPreference] = useState<"any" | "custom">("any");
  const [time, setTime] = useState("");
  const [timePreference, setTimePreference] = useState<"any" | "custom">("any");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (dayPreference === "custom" && selectedDays.length === 0) {
      toast({
        title: "Day selection required",
        description: "Please select at least one day",
        variant: "destructive",
      });
      return;
    }

    if (timePreference === "custom" && !time) {
      toast({
        title: "Time required",
        description: "Please enter a time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          created_by: user.id,
          preferred_days: dayPreference === "any" ? ["any"] : selectedDays,
          preferred_time: timePreference === "any" ? "any" : time,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      toast({
        title: "Group created!",
        description: "Your group has been created successfully",
      });

      setName("");
      setDescription("");
      setSelectedDays([]);
      setDayPreference("any");
      setTime("");
      setTimePreference("any");
      onGroupCreated();
    } catch (error: any) {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a private group to chat with your pickleball friends
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Pickleball Squad"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A group for playing pickleball together"
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Preferred Days</Label>
            <RadioGroup value={dayPreference} onValueChange={(v) => setDayPreference(v as "any" | "custom")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="day-any" />
                <label
                  htmlFor="day-any"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Any Day
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="day-custom" />
                <label
                  htmlFor="day-custom"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Custom Days
                </label>
              </div>
            </RadioGroup>
            {dayPreference === "custom" && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <label
                      htmlFor={day.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Preferred Time</Label>
            <RadioGroup value={timePreference} onValueChange={(v) => setTimePreference(v as "any" | "custom")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="time-any" />
                <label
                  htmlFor="time-any"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Any Time
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="time-custom" />
                <label
                  htmlFor="time-custom"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Custom Time
                </label>
              </div>
            </RadioGroup>
            {timePreference === "custom" && (
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Select time"
                className="mt-2"
              />
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};