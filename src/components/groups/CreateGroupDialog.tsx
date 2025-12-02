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
  const [isAnyDay, setIsAnyDay] = useState(true);
  const [time, setTime] = useState("");
  const [isAnyTime, setIsAnyTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAnyDayToggle = (checked: boolean) => {
    setIsAnyDay(checked);
    if (checked) {
      setSelectedDays([]);
    }
  };

  const handleAnyTimeToggle = (checked: boolean) => {
    setIsAnyTime(checked);
    if (checked) {
      setTime("");
    }
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

    if (!isAnyDay && selectedDays.length === 0) {
      toast({
        title: "Day selection required",
        description: "Please select at least one day or choose 'Any Day'",
        variant: "destructive",
      });
      return;
    }

    if (!isAnyTime && !time) {
      toast({
        title: "Time required",
        description: "Please enter a time or choose 'Any Time'",
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
          preferred_days: isAnyDay ? ["any"] : selectedDays,
          preferred_time: isAnyTime ? "any" : time,
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
      setIsAnyDay(true);
      setTime("");
      setIsAnyTime(true);
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
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="any-day"
                checked={isAnyDay}
                onCheckedChange={handleAnyDayToggle}
              />
              <label
                htmlFor="any-day"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Any Day
              </label>
            </div>
            {!isAnyDay && (
              <div className="grid grid-cols-2 gap-2">
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
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="any-time"
                checked={isAnyTime}
                onCheckedChange={handleAnyTimeToggle}
              />
              <label
                htmlFor="any-time"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Any Time
              </label>
            </div>
            {!isAnyTime && (
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Select time"
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