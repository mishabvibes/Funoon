import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Pusher from 'pusher-js';
 
const ResultsContext = createContext();
const API = import.meta.env.VITE_API_URL.replace(/\/$/, '');

// Initialize Pusher
const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  encrypted: true
});

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [uniquePrograms, setUniquePrograms] = useState([]);
  const [groupPrograms, setGroupPrograms] = useState([]);
  const [singlePrograms, setSinglePrograms] = useState([]);
  const [topSingleParticipants, setTopSingleParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  // Calculate total points for a participant (new method)
  const calculateParticipantPoints = useCallback((data, studentName) => {
    return data
      .filter(result => result.studentName === studentName && result.category === "SINGLE")
      .reduce((sum, result) => sum + Number(result.points || 0), 0);
  }, []);

  // Get unique participants with their total points (new method)
  const getTopParticipants = useCallback((data) => {
    // Get unique participant names from SINGLE category
    const uniqueParticipants = [...new Set(
      data
        .filter(result => result.category === "SINGLE")
        .map(result => result.studentName)
    )];

    // Create participant objects with total points
    const participantsWithPoints = uniqueParticipants.map(studentName => {
      const participantResults = data.find(result => result.studentName === studentName);
      return {
        _id: participantResults._id, // Keep the _id from any result for this participant
        studentName,
        teamName: participantResults.teamName,
        totalPoints: calculateParticipantPoints(data, studentName)
      };
    });

    // Sort by total points and get top 3
    return participantsWithPoints
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 3);
  }, [calculateParticipantPoints]);

  // Process data and update all derived states
  const processData = useCallback((data) => {
    // Teams processing
    const teams = [...new Set(data.map(result =>
      result.teamName ? result.teamName.toUpperCase() : ""
    ))].filter(Boolean);
    setUniqueTeams(teams);

    // Programs processing
    const allPrograms = [...new Set(data.map(result =>
      result.programName ? result.programName.toUpperCase() : ""
    ))].filter(Boolean);

    const groupProgs = allPrograms.filter(program =>
      data.some(result =>
        result.programName?.toUpperCase() === program &&
        result.category === "GROUP"
      )
    );

    const singleProgs = allPrograms.filter(program =>
      data.some(result =>
        result.programName?.toUpperCase() === program &&
        result.category === "SINGLE"
      )
    );

    const generalProgs = allPrograms.filter(program =>
      data.some(result =>
        result.programName?.toUpperCase() === program &&
        result.category === "GENERAL"
      )
    );

    setGroupPrograms(groupProgs);
    setSinglePrograms(singleProgs);
    setUniquePrograms(generalProgs);

    // Update top participants using the new calculation method
    const topParticipants = getTopParticipants(data);
    setTopSingleParticipants(topParticipants);
  }, [getTopParticipants]);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api`);
      if (response.status !== 200) {
        throw new Error(`Unexpected status: ${response.status}`);
      }

      const data = response.data;
      if (!Array.isArray(data)) {
        throw new Error('Expected array response');
      }

      setResults(data);
      processData(data);
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsInitialFetch(false);
    }
  }, [processData]);

  // Setup Pusher listeners
  useEffect(() => {
    const channel = pusher.subscribe('results-channel');

    channel.bind('new-result', (data) => {
      // Only update if we've completed initial fetch
      if (!isInitialFetch) {
        setResults(prevResults => {
          // Check if result already exists
          if (!prevResults.some(r => r._id === data.result._id)) {
            const updatedResults = [...prevResults, data.result];
            processData(updatedResults);
            return updatedResults;
          }
          return prevResults;
        });
      }
    });

    channel.bind('update-result', (data) => {
      if (!isInitialFetch) {
        setResults(prevResults => {
          const updatedResults = prevResults.map(result =>
            result._id === data.result._id ? data.result : result
          );
          processData(updatedResults);
          return updatedResults;
        });
      }
    });

    channel.bind('delete-result', (data) => {
      if (!isInitialFetch) {
        setResults(prevResults => {
          const updatedResults = prevResults.filter(result =>
            result._id !== data.id
          );
          processData(updatedResults);
          return updatedResults;
        });
      }
    });

    // Initial fetch
    fetchResults();

    // Cleanup
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [fetchResults, processData, isInitialFetch]);

  const addResult = useCallback(async (newData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/api`, newData);
      // Don't update state here - let Pusher handle it
      return response;
    } catch (error) {
      console.error("Add error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const editResult = useCallback(async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API}/api/${id}`, updatedData);
      // Don't update state here - let Pusher handle it
      return response;
    } catch (error) {
      console.error("Edit error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteResult = useCallback(async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/api/${id}`);
      // Don't update state here - let Pusher handle it
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ResultsContext.Provider
      value={{
        API,
        results,
        uniqueTeams,
        uniquePrograms,
        groupPrograms,
        singlePrograms,
        topSingleParticipants,
        loading,
        error,
        deleteResult,
        editResult,
        addResult,
        refreshResults: fetchResults,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};