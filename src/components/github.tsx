// src/GitHubRepoStats.tsx
import {
  ScatterChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";

import {
  getGitHubCommitDataQueryOptions,
  getGitHubCodeFrequencyQueryOptions,
  getGitHubPunchCardQueryOptions,
} from "@/api/githubApi";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatNumberForAxis = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`; // Format positive numbers over 1,000
  } else if (num <= -1000) {
    return `${(num / 1000).toFixed(1)}k`; // Format negative numbers under -1,000
  }
  return num.toString(); // Return numbers between -999 and 999 as-is
};

export function GitHubRepoCommitData() {
  const { data, isLoading, error } = useQuery(
    getGitHubCommitDataQueryOptions("JaredStanbrook", "it-service-desk")
  );
  if (!data) return null; // Handle the case where data is not available
  if (error) return "An error has occurred: " + error.message;

  const processWeeklyData = (data: { week: number; total: number }[]) => {
    return data
      .filter((activity) => activity.total > 0) // Only include weeks with commits
      .map((activity) => ({
        week: new Date(activity.week * 1000).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        }), // Format as MMM-DD-YY
        total: activity.total,
      }));
  };

  return (
    <>
      <h2>Weekly Commits</h2>
      {!isLoading ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processWeeklyData(data)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 13 }} />
            <YAxis tickFormatter={formatNumberForAxis} tick={{ fontSize: 13 }}>
              <Label value="Contributions" angle={-90} position="center" fontSize={13} />
            </YAxis>
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke={COLORS[1]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-red-500 hover:underline">Error retrieving commit data.</div>
      )}
    </>
  );
}

export function GitHubRepoCodeFrequency() {
  const { data, isLoading, error } = useQuery(
    getGitHubCodeFrequencyQueryOptions("JaredStanbrook", "it-service-desk")
  );
  if (!data) return null; // Handle the case where data is not available
  if (error) return "An error has occurred: " + error.message;

  const processCodeFrequency = (data: [number, number, number][]) => {
    return data
      .filter(([, additions, deletions]) => additions !== 0 || deletions !== 0) // Keep only entries with changes
      .map(([date, additions, deletions]) => ({
        week: new Date(date * 1000).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        }),
        additions,
        deletions,
      }));
  };

  return (
    <>
      <h2>Code Frequency</h2>
      {!isLoading ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processCodeFrequency(data)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 13 }} />
            <YAxis tickFormatter={formatNumberForAxis} tick={{ fontSize: 13 }}>
              <Label value="Contributions" angle={-90} position="center" fontSize={13} />
            </YAxis>
            <Tooltip />
            <Line
              type="monotone"
              dataKey="deletions"
              stroke="#FF0000"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="additions"
              stroke={COLORS[1]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-red-500 hover:underline">Error retrieving frequency data.</div>
      )}
    </>
  );
}

export function GitHubRepoPunchCard() {
  const { data, isLoading, error } = useQuery(
    getGitHubPunchCardQueryOptions("JaredStanbrook", "it-service-desk")
  );

  if (isLoading) return <p className="text-sm text-gray-500">Loading punch card...</p>;
  if (error) return <p className="text-red-500">Error loading data: {error.message}</p>;
  if (!data) return null;

  const punchData = data
    .filter(([, , commits]: [number, number, number]) => commits > 0)
    .map(([day, hour, commits]: [number, number, number]) => ({
      day: DAYS[day],
      dayIndex: day,
      hour,
      commits,
    }));

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Commits by Hour and Day</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 10, right: 20, left: 30, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="hour"
            name="Hour"
            tickFormatter={(h) => `${h}:00`}
            domain={[0, 23]}
            label={{ value: "Hour of Day", position: "bottom", offset: 0 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="day"
            name="Day"
            tick={{ fontSize: 12 }}
            label={{
              value: "Day of Week",
              angle: -90,
              position: "insideLeft",
              fontSize: 13,
            }}
          />
          <ZAxis
            type="number"
            dataKey="commits"
            name="Commits"
            range={[60, 300]} // Bubble size range
          />
          <Tooltip
            formatter={(value: number | string, name: string, props: { payload: { day: number; hour: number } }) => {
              if (name === "Commits") {
                const { payload } = props;
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                return [`${value} commits`, `${days[payload.day]} @ ${payload.hour}:00`];
              }
              return value;
            }}
          />
          <Scatter name="Commits" data={punchData} fill="#3B82F6" />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
}
