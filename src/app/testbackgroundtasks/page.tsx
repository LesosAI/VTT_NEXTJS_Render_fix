"use client";

import React, { useState, useEffect } from "react";
import { useLogin } from "@/context/LoginContext";
import { useBackgroundTask } from "@/hooks/useBackgroundTask";

interface TestTableState {
  processing: boolean;
  result: string;
  created_at: string;
}

const TestBackgroundTask: React.FC = () => {
  const { username } = useLogin();
  const [testTableState, setTestTableState] = useState<TestTableState | null>(
    null
  );
  const { startTask, response, isLoading, error } = useBackgroundTask();

  // Update test table state whenever response changes
  useEffect(() => {
    if (response?.test_table) {
      setTestTableState({
        processing: response.test_table.processing,
        result: response.test_table.result,
        created_at: response.test_table.created_at,
      });
    }
  }, [response]);

  const handleStartTask = () => {
    if (!username) return;
    startTask(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/threadingtest?user_id=${username}`
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Test Background Task</h1>

      {!username ? (
        <div className="text-red-500">Please log in to use this feature</div>
      ) : (
        <>
          <button
            onClick={handleStartTask}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Start Task"}
          </button>

          {response?.background_task && (
            <div className="mt-4 space-y-4">
              <div>
                <h2 className="text-xl mb-2">Background Task Status:</h2>
                <p>
                  Processing:{" "}
                  {response.background_task.processing ? "Yes" : "No"}
                </p>
                <p>Result: {response.background_task.result || "N/A"}</p>
                <p>
                  Created:{" "}
                  {new Date(
                    response.background_task.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {testTableState && (
            <div className="mt-4">
              <h2 className="text-xl mb-2">Test Table Status:</h2>
              <p>Processing: {testTableState.processing ? "Yes" : "No"}</p>
              <p>Result: {testTableState.result || "N/A"}</p>
              <p>
                Created: {new Date(testTableState.created_at).toLocaleString()}
              </p>
            </div>
          )}

          {error && <div className="mt-4 text-red-500">Error: {error}</div>}
        </>
      )}
    </div>
  );
};

export default TestBackgroundTask;
