import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import badge01 from "@/assets/badge01.svg";
import badge02 from "@/assets/badge02.svg";
import {
  GitHubRepoCommitData,
  GitHubRepoCodeFrequency,
  GitHubRepoPunchCard,
} from "@/components/github";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { formatRelativeDate } from "@/lib/utils";

export const Route = createFileRoute("/it-help-desk")({
  component: SupportDashboard,
});

// Define types for the data
interface DailyInteraction {
  date: string;
  count: number;
}

interface IssueType {
  name: string;
  value: number;
}

interface CollaborationData {
  name: string;
  value: number;
}

function SupportDashboard() {
  // Count of interactions by date
  const dailyInteractions: DailyInteraction[] = [
    { date: "2025-08-23", count: 1 },
    { date: "2025-08-30", count: 10 },
    { date: "2025-09-13", count: 12 },
    { date: "2025-09-20", count: 5 },
    { date: "2025-10-04", count: 5 },
    { date: "2025-10-15", count: 1 },
    { date: "2025-10-25", count: 6 },
    { date: "2025-11-01", count: 1 },
  ];
  const dailyInteractionChartData = dailyInteractions.map((entry) => ({
    ...entry,
    dateLabel: formatRelativeDate(entry.date),
  }));

  // Types of issues helped with
  const issueTypes: IssueType[] = [
    { name: "SPSS/Software Access", value: 17 },
    { name: "Printing Issues", value: 12 },
    { name: "Network/WiFi", value: 5 },
    { name: "File/Document Issues", value: 4 },
    { name: "Other", value: 3 },
  ];

  // Collaboration stats
  const collaborationData: CollaborationData[] = [
    { name: "Solo Support", value: 28 },
    { name: "Collaborative Support", value: 13 },
  ];

  const COLORS = [
    "#1E3A8A",
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#BFDBFE",
  ];

  // State for active indices of the pie charts

  const [activeIndexCollaboration, setActiveIndexCollaboration] =
    useState<number>(0);

  const onPieEnterCollaboration = (_: any, index: number) => {
    setActiveIndexCollaboration(index);
  };
  const total = collaborationData.reduce((acc, cur) => acc + cur.value, 0);
  const activePercentage =
    activeIndexCollaboration !== null
      ? (
          (collaborationData[activeIndexCollaboration].value / total) *
          100
        ).toFixed(1)
      : null;
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      cornerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          cornerRadius={cornerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          cornerRadius={cornerRadius}
          fill={fill}
        />
      </g>
    );
  };
  const badgeImages = [
    {
      src: "https://images.credly.com/images/fc1352af-87fa-4947-ba54-398a0e63322e/security-compliance-and-identity-fundamentals-600x600.png",
      alt: "SC-900 Badge",
      url: "https://www.credly.com/users/jared-stanbrook",
      tooltip:
        "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    },
    {
      src: badge02,
      alt: "Microsoft Azure Fundamentals",
      url: "https://learn.microsoft.com/api/achievements/share/en-us/JaredStanbrook-5821/B6LGLXND?sharingId=B519DFD4EAAE8B7D",
      tooltip: "Microsoft Azure Fundamentals: Describe cloud concepts",
    },
    {
      src: badge01,
      alt: "MS-900 Badge",
      url: "https://learn.microsoft.com/api/achievements/share/en-us/JaredStanbrook-5821/B6LGLXND?sharingId=B519DFD4EAAE8B7D",
      tooltip:
        "MS-900 Microsoft 365 Fundamentals: Describe Microsoft 365 apps and services",
    },
  ];
  //<GitHubRepoStats owner="JaredStanbrook" repo="it-service-desk" />
  return (
    <>
      <div className="space-y-4 lg:py-20">
        <div className="lg:sticky lg:top-0 lg:flex lg:flex-col lg:py-24 gap-4">
          <Card className="mb-1">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-left gap-4">
                {badgeImages.map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-24 relative group"
                  >
                    <a
                      href={badge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={badge.src}
                        alt={badge.alt}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                    </a>
                    {/* Tooltip */}
                    <span className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {badge.tooltip}
                    </span>
                    <p className="mt-2 text-sm text-center break-words">
                      {badge.alt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mb-1">
            <CardHeader>
              <CardTitle>Daily Support Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full h-64">
                {/* Bar Chart Container */}
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyInteractionChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="dateLabel" stroke="#4a4a4a" />
                      <YAxis stroke="#4a4a4a" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          padding: "8px",
                          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{ color: "#1f2937" }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <defs>
                        <linearGradient
                          id="interactionGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor={COLORS[0]} />
                          <stop offset="50%" stopColor={COLORS[2]} />
                          <stop offset="100%" stopColor={COLORS[4]} />
                          {/* Add more stops if needed for a smoother gradient */}
                        </linearGradient>
                      </defs>
                      <Bar
                        dataKey="count"
                        fill="url(#interactionGradient)" // Set a solid fill color for the bars
                        name="Number of Interactions"
                        animationDuration={500}
                        animationEasing="ease-in-out"
                        radius={[10, 10, 0, 0]} // Rounded corners for the bars
                      >
                        {dailyInteractions.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Display Total Tickets */}
                <div className="flex flex-col justify-center mr-6 text-gray-700">
                  <p className="text-lg font-semibold">Total Tickets</p>
                  <p className="text-2xl font-bold">
                    {dailyInteractions.reduce(
                      (acc, entry) => acc + entry.count,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
            <Card>
              <CardHeader>
                <CardTitle>Types of Issues</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex flex-col items-center justify-between h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={issueTypes}
                    >
                      <PolarGrid
                        stroke="#d1d5db"
                        strokeDasharray="3 3" // Softer dashed lines
                      />
                      <PolarAngleAxis
                        dataKey="name"
                        stroke="#6b7280"
                        tick={{ fill: "#4b5563", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        stroke="#d1d5db"
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        tickCount={5}
                      />
                      <Radar
                        name="Issue Frequency"
                        dataKey="value"
                        stroke="#2563EB"
                        fill={COLORS[1]}
                        fillOpacity={0.4} // Softer fill opacity for rounded look
                        strokeWidth={2} // Thicker stroke for a rounder feel
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          padding: "8px",
                          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{ color: "#1f2937" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ color: "#374151", fontSize: 12 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row w-full h-auto">
                  {" "}
                  {/* Change to flex-col on small screens */}
                  {/* Chart Container */}
                  <div className="flex-grow w-full md:w-[70%]">
                    {" "}
                    {/* Allow it to take full width on mobile and 70% on larger screens */}
                    <ResponsiveContainer width="100%" height={300}>
                      {/* Set a specific height for better visibility */}
                      <PieChart>
                        <Pie
                          data={collaborationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={80}
                          cornerRadius={20}
                          dataKey="value"
                          activeIndex={activeIndexCollaboration}
                          activeShape={renderActiveShape}
                          onMouseEnter={onPieEnterCollaboration}
                        >
                          {collaborationData.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            color: "#374151",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Percentage display */}
                  <div className="flex flex-col justify-center w-full md:w-[30%] mt-4 md:mt-0 text-gray-700">
                    {" "}
                    {/* Allow it to take full width on mobile and 30% on larger screens */}
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {collaborationData[activeIndexCollaboration]?.name ||
                          "Select a section"}
                      </p>
                      <p className="text-2xl font-bold">
                        {activeIndexCollaboration !== null
                          ? `${activePercentage}%`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>GitHub Repository Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <GitHubRepoCommitData />
              <GitHubRepoCodeFrequency />
              <GitHubRepoPunchCard />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default SupportDashboard;
