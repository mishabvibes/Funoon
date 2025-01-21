import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";

const ResultsContext = createContext();
const API = import.meta.env.VITE_API_URL.replace(/\/$/, '');
const socket = io(API); // Initialize Socket.IO client

// Storage keys for different data types
const STORAGE_KEYS = {
  RESULTS: 'results',
  SCOREBOARD: 'scoreboardResults',
  PROGRAM: 'programResults',
  TEAM: 'teamResults'
};

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [uniquePrograms, setUniquePrograms] = useState([]);
  const [groupPrograms, setGroupPrograms] = useState([]);
  const [singlePrograms, setSinglePrograms] = useState([]);
  const [topSingleParticipants, setTopSingleParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update localStorage across all components
  const updateLocalStorage = useCallback((data) => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.setItem(key, JSON.stringify(data));
    });
  }, []);

  // Process data and update all derived states
  const processData = useCallback((data) => {
    // Update teams
    const teams = [...new Set(data.map(result =>
      result.teamName ? result.teamName.toUpperCase() : ""
    ))].filter(Boolean);
    setUniqueTeams(teams);

    // Update programs
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

    // Update top participants
    const topParticipants = data
      .filter(result => result.category === "SINGLE")
      .sort((a, b) => Number(b.points) - Number(a.points))
      .slice(0, 3);
    setTopSingleParticipants(topParticipants);
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API);
      if (response.status !== 200) {
        throw new Error(`Unexpected status: ${response.status}`);
      }

      const data = response.data;
      if (!Array.isArray(data)) {
        throw new Error('Expected array response');
      }

      setResults(data);
      processData(data);
      updateLocalStorage(data);
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [processData, updateLocalStorage]);

  // Socket.IO integration
  useEffect(() => {
    // Handle new result
    socket.on('newResult', (newResult) => {
      setResults(prevResults => {
        const updatedResults = [...prevResults, newResult];
        processData(updatedResults);
        updateLocalStorage(updatedResults);
        return updatedResults;
      });
    });

    // Handle result update
    socket.on('updateResult', (updatedResult) => {
      setResults(prevResults => {
        const updatedResults = prevResults.map(result =>
          result._id === updatedResult._id ? updatedResult : result
        );
        processData(updatedResults);
        updateLocalStorage(updatedResults);
        return updatedResults;
      });
    });

    // Handle result deletion
    socket.on('deleteResult', (deletedId) => {
      setResults(prevResults => {
        const updatedResults = prevResults.filter(result =>
          result._id !== deletedId
        );
        processData(updatedResults);
        updateLocalStorage(updatedResults);
        return updatedResults;
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off('newResult');
      socket.off('updateResult');
      socket.off('deleteResult');
    };
  }, [processData]);

  const deleteResult = useCallback(async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/${id}`);

      // Optimistically update local state
      const updatedResults = results.filter(result => result._id !== id);
      setResults(updatedResults);
      processData(updatedResults);
      updateLocalStorage(updatedResults);

      // Fetch fresh data from server
      await fetchResults();
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [results, fetchResults, processData, updateLocalStorage]);

  const editResult = useCallback(async (id, updatedData) => {
    try {
      setLoading(true);
      await axios.put(`${API}/${id}`, updatedData);
      await fetchResults();
    } catch (error) {
      console.error("Edit error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchResults]);

  const addResult = useCallback(async (newData) => {
    try {
      setLoading(true);
      await axios.post(API, newData);
      await fetchResults();
    } catch (error) {
      console.error("Add error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchResults]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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
