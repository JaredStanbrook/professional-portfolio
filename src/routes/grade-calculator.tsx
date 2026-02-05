import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// NOTE: All Firebase/Firestore imports have been removed.

// --- Type Definitions ---
type Assignment = {
  id: number;
  mark: string;
  weight: string;
};

type AssignmentField = "mark" | "weight";

// --- Routing ---
export const Route = createFileRoute("/grade-calculator")({
  component: Assignments,
});

/**
 * Core calculation logic to determine current progress and required mark.
 */
const calculateStats = (assignments: Assignment[], expected: number) => {
  let completedWeight = 0;
  let weightedSum = 0;
  let remainingWeight = 0;

  assignments.forEach((a) => {
    const mark = parseFloat(a.mark);
    const weight = parseFloat(a.weight);

    // Only process rows with a valid positive weight
    if (isNaN(weight) || weight <= 0) return;

    if (!isNaN(mark)) {
      // Assignment is graded (has a mark)
      weightedSum += mark * (weight / 100);
      completedWeight += weight;
    } else {
      // Assignment is not yet graded (mark is blank/NaN)
      remainingWeight += weight;
    }
  });

  const currentAverage = completedWeight > 0 ? weightedSum / (completedWeight / 100) : 0;

  let requiredAverageForRemaining = 0;
  let message = "Enter assignment details and expected mark to calculate the required average.";

  if (expected > 0 && remainingWeight > 0) {
    // Expected total weighted mark (Target % * 100)
    const expectedWeightedTarget = expected;

    // Remaining weighted sum needed to reach the target
    const remainingWeightedTarget = expectedWeightedTarget - weightedSum;

    // Target needed on remaining portion / remaining weight percentage
    requiredAverageForRemaining = remainingWeightedTarget / (remainingWeight / 100);

    if (requiredAverageForRemaining <= 0) {
      message = "Goal achieved! Your current average already exceeds your target!";
    } else if (requiredAverageForRemaining > 100) {
      message = `You need an impossible ${requiredAverageForRemaining.toFixed(2)}% on the remaining ${remainingWeight}% weight to reach your goal.`;
    } else {
      message = `You need an average of ${requiredAverageForRemaining.toFixed(2)}% on the remaining ${remainingWeight}% weight to reach your goal.`;
    }
  } else if (completedWeight > 0 && completedWeight <= 100) {
    message = `Current overall average: ${currentAverage.toFixed(2)}%.`;
    if (completedWeight === 100) {
      message = `All assignments accounted for. Your final average is ${currentAverage.toFixed(2)}%.`;
    }
  }

  return {
    currentAverage,
    completedWeight,
    remainingWeight,
    requiredAverageForRemaining,
    message,
  };
};

// --- Component ---

function Assignments() {
  // Initial state is hardcoded and managed locally
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, mark: "85", weight: "20" },
    { id: 2, mark: "92", weight: "30" },
    { id: 3, mark: "", weight: "25" },
    { id: 4, mark: "", weight: "25" },
  ]);
  const [expected, setExpected] = useState<string>("80");
  const [nextId, setNextId] = useState(5); // Start next ID after initial assignments

  // Handlers now only update local state
  const handleInputChange = (index: number, field: AssignmentField, value: string) => {
    // Basic validation to prevent negative numbers or marks > 100
    if (parseFloat(value) < 0 || parseFloat(value) > 100) return;

    const updatedAssignments = assignments.map((assignment, i) =>
      i === index ? { ...assignment, [field]: value } : assignment
    );
    setAssignments(updatedAssignments);
  };

  const handleExpectedChange = (value: string) => {
    // Basic validation
    if (parseFloat(value) < 0 || parseFloat(value) > 100) return;
    setExpected(value);
  };

  const addAssignment = () => {
    const newAssignments = [...assignments, { id: nextId, mark: "", weight: "" }];
    setAssignments(newAssignments);
    setNextId(nextId + 1);
  };

  const removeAssignment = (idToRemove: number) => {
    // Ensure at least one assignment remains
    if (assignments.length <= 1) return;

    const newAssignments = assignments.filter((a) => a.id !== idToRemove);
    setAssignments(newAssignments);
  };

  const { currentAverage, completedWeight, remainingWeight, message } = calculateStats(
    assignments,
    parseFloat(expected)
  );

  // Removed loading state since there is no data fetching

  return (
    <div className="container flex-grow flex flex-col items-center justify-center py-12">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-full max-w-4xl p-8 border rounded-lg shadow-xl bg-card">
        {/* Header */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Grade Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Calculate your required average to meet your target grade. Data is not saved.
          </p>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-muted/30">
          <StatBox label="Current Average" value={`${currentAverage.toFixed(2)}%`} />
          <StatBox label="Completed Weight" value={`${completedWeight.toFixed(1)}%`} />
          <StatBox label="Remaining Weight" value={`${remainingWeight.toFixed(1)}%`} />
          <StatBox label="Expected Final Mark" value={`${expected || "N/A"}%`} isTarget={true} />
        </div>

        {/* Main Calculation Table */}
        <Table className="border rounded-lg">
          <TableCaption>
            Enter assignment marks and weights. Only numbers 0-100 are accepted.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12 text-center">#</TableHead>
              <TableHead className="w-6/12">Assignment Mark (%)</TableHead>
              <TableHead className="w-4/12">Weight (%)</TableHead>
              <TableHead className="w-1/12 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={assignment.mark}
                    onChange={(e) => handleInputChange(index, "mark", e.target.value)}
                    placeholder="Mark (Leave blank if ungraded)"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={assignment.weight}
                    onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                    placeholder="Weight"
                    required
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAssignment(assignment.id)}
                    // Disable if only one row remains
                    disabled={assignments.length === 1}
                    title={
                      assignments.length === 1
                        ? "Minimum one assignment required"
                        : "Remove assignment"
                    }>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Action Buttons and Expected Mark Input */}
        <div className="flex justify-between items-center gap-4 pt-2">
          {/* Add Assignment Button */}
          <Button onClick={addAssignment} variant="outline" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
          <div className="flex items-center gap-2 w-full max-w-xs ml-auto">
            <label htmlFor="expected-mark" className="whitespace-nowrap">
              Expected Final %:
            </label>
            <Input
              id="expected-mark"
              type="number"
              min="0"
              max="100"
              value={expected}
              onChange={(e) => handleExpectedChange(e.target.value)}
              placeholder="Target Mark"
            />
          </div>
        </div>

        {/* Result Message */}
        <div className="mt-4 p-4 rounded-lg bg-primary text-primary-foreground font-semibold text-center shadow-md">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

// Helper component for statistics boxes
function StatBox({
  label,
  value,
  isTarget = false,
}: {
  label: string;
  value: string;
  isTarget?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-lg ${isTarget ? "bg-secondary" : "bg-background"}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={`text-lg font-bold ${isTarget ? "text-secondary-foreground" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
