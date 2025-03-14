"use client";

import { useState, useEffect } from "react";
import { useLogin } from "@/context/LoginContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Grid, Table, Plus, X } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  prompt: string;
  website: string | null;
  created_at: string;
}

export default function AgentsPage() {
  const { username, isSubaccount } = useLogin();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    const fetchDirectly = async () => {
      try {
        console.log("Fetching directly from useEffect");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/agents/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch agents");
        const data = await response.json();

        if (data.success) {
          setAgents(data.agents);
        } else {
          setError(data.message || "Failed to load agents");
        }
      } catch (err) {
        console.error("Direct fetch error:", err);
        setError("Failed to fetch agents directly");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectly();
  }, [username]);

  const handleQuickCreate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username,
            prompt: "New Agent",
            website: null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create agent");
      const data = await response.json();

      if (data.success) {
        window.location.href = `/agent/${data.agent_id}/edit`;
      } else {
        setError(data.message || "Failed to create agent");
      }
    } catch (err) {
      console.error("Error creating agent:", err);
      setError("Failed to create agent");
    }
  };

  const handleDeleteAgent = async (agentId: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/${agentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete agent");
      const data = await response.json();

      if (data.success) {
        setAgents(agents.filter((agent) => agent.id !== agentId));
      } else {
        setError(data.message || "Failed to delete agent");
      }
    } catch (err) {
      console.error("Error deleting agent:", err);
      setError("Failed to delete agent");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Your Agents</h1>
          <div className="flex gap-4">
            <Link
              href="/CompanyInfoForm"
              className={`${
                isSubaccount
                  ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
              } px-4 py-2 rounded-lg flex items-center gap-2`}
              onClick={(e) => isSubaccount && e.preventDefault()}
            >
              <Plus size={20} />
              Quick Create
            </Link>
            <button
              onClick={handleQuickCreate}
              disabled={isSubaccount}
              className={`${
                isSubaccount
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white px-4 py-2 rounded-lg flex items-center gap-2`}
            >
              <Plus size={20} />
              Create New Agent
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid" ? "bg-white shadow" : ""
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded ${
                  viewMode === "table" ? "bg-white shadow" : ""
                }`}
              >
                <Table size={20} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading agents...</p>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Link href={`/agent/${agent.id}`} key={agent.id}>
                <div className="relative border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <button
                    onClick={(e) => handleDeleteAgent(agent.id, e)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-500 hover:text-red-500" />
                  </button>
                  <h2 className="text-xl font-semibold mb-4">{agent.name}</h2>
                  <p className="text-gray-600 mb-4 truncate">{agent.prompt}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(agent.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prompt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">#{agent.id}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate">{agent.prompt}</div>
                    </td>
                    <td className="px-6 py-4">{agent.website || "-"}</td>
                    <td className="px-6 py-4">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
