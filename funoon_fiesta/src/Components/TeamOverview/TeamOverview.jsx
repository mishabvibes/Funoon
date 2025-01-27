import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResults } from '../../../context/DataContext';

// Define team colors and styling
const TEAM_COLORS = {
  'ALEXANDRIA': {
    primary: '#4cad4e',
    gradient: 'from-[#4cad4e] to-[#3d8c3f]',
    light: '#e8f5e9'
  },
  'SHATIBIYA': {
    primary: '#c9194a',
    gradient: 'from-[#c9194a] to-[#a1143b]',
    light: '#fce4ec'
  },
  'SHAMIYA': {
    primary: '#6b3f24',
    gradient: 'from-[#6b3f24] to-[#4e2e1a]',
    light: '#efebe9'
  },
  'HIJAZIYYA': {
    primary: '#5a199b',
    gradient: 'from-[#5a199b] to-[#461477]',
    light: '#f3e5f5'
  },
  'QADISIYYA': {
    primary: '#33658a',
    gradient: 'from-[#33658a] to-[#254c68]',
    light: '#e3f2fd'
  },
  'KAZIMIYYA': {
    primary: '#ffb703',
    gradient: 'from-[#ffb703] to-[#cc9202]',
    light: '#fff8e1'
  }
};

// TeamCard Component remains the same
const TeamCard = ({ team, index, totalPoints }) => {
  const getMedalColor = (index) => {
    switch (index) {
      case 0: return '#FFD700';
      case 1: return '#C0C0C0';
      case 2: return '#CD7F32';
      default: return 'transparent';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group"
    >
      <div className={`bg-gradient-to-br ${team.colors.gradient} rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] transform-gpu`}>
        <div className="bg-white dark:bg-[#2D2D2D] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: team.colors.light }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: team.colors.primary }}
                >
                  {team.teamName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold ">
                    {team.teamName}
                  </h3>
                  {index < 3 && (
                    <Medal
                      className="w-5 h-5"
                      style={{ color: getMedalColor(index) }}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Rank #{index + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg ">
                {team.totalPoints.toLocaleString()}
              </span>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-100 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(team.totalPoints / totalPoints) * 100}%` }}
                className="h-full rounded-full transition-all duration-500"
                style={{ backgroundColor: team.colors.primary }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Progress</span>
              <span className="font-medium">
                {((team.totalPoints / totalPoints) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// DistributionChart Component remains the same
const DistributionChart = ({ teams }) => {
  const maxPoints = Math.max(...teams.map(team => team.totalPoints));

  return (
    <div className="p-12 rounded-lg sm:rounded-xl order-1 lg:order-2 h-[300px] sm:h-[400px] lg:h-auto ">
      <h4 className="text-xs sm:text-sm font-medium text-gray-600 sm:mb-6 ms-[-20px] mt-[-20px] pb-4 mb-4">
        Points Distribution
      </h4>
      <div className="relative h-48 sm:h-60 lg:h-72">
        {teams.map((team, index) => (
          <motion.div
            key={team.teamName}
            initial={{ height: 0 }}
            animate={{ height: `${(team.totalPoints / maxPoints) * 100}%` }}
            className="absolute bottom-0 rounded-t-lg transition-all duration-300 hover:opacity-100 group"
            style={{
              left: `${(index * 100 / (teams.length - 1))}%`,
              width: '40px',
              transform: 'translateX(-50%)',
              backgroundColor: team.colors.primary,
              opacity: 0.85
            }}
          >
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {team.teamName}: {team.totalPoints.toLocaleString()} pts
            </div>

            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                {team.totalPoints.toLocaleString()}
              </span>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 whitespace-nowrap">
                {team.teamName.slice(0, 3)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Updated Main TeamOverview Component
const TeamOverview = () => {
  const navigate = useNavigate();
  const { results } = useResults();

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results && results.length > 0) {
      localStorage.setItem('teamResults', JSON.stringify(results));
    }
  }, [results]);

  // Calculate team points using context or localStorage
  const calculateTeamPoints = () => {
    let currentResults = results;

    if (!currentResults || currentResults.length === 0) {
      const storedResults = localStorage.getItem('teamResults');
      currentResults = storedResults ? JSON.parse(storedResults) : [];
    }

    const teamPoints = {};
    currentResults.forEach((result) => {
      const teamName = result.teamName.toUpperCase();
      if (!teamPoints[teamName]) {
        teamPoints[teamName] = 0;
      }
      teamPoints[teamName] += result.points;
    });

    return Object.entries(teamPoints)
      .map(([teamName, totalPoints]) => ({
        teamName,
        totalPoints,
        colors: TEAM_COLORS[teamName] || {
          primary: '#6B7280',
          gradient: 'from-gray-500 to-gray-600',
          light: '#F9FAFB'
        }
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const teams = calculateTeamPoints();
  const totalPoints = teams.reduce((sum, team) => sum + team.totalPoints, 0);

  return (
    <section className="min-h-screen w-full flex justify-center flex-col">
      <div className="flex justify-center items-center w-full py-4 sm:py-6 md:py-8 lg:py-12 flex-col px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl"
        >
          <div className="backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg sm:flex">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg lg:text-xl">Live Results</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Real-time team rankings</p>
                </div>
              </div>
              {/* <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg w-full sm:w-auto">
                <span className="text-xs sm:text-sm font-medium block text-center sm:text-left">
                  Total Points: {totalPoints.toLocaleString()}
                </span>
              </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {teams.map((team, index) => (
                    <TeamCard
                      key={team.teamName}
                      team={team}
                      index={index}
                      totalPoints={totalPoints}
                    />
                  ))}
                </div>
              </div>

              <DistributionChart teams={teams} totalPoints={totalPoints} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center items-center mt-6 sm:mt-8"
        >
          <div className='flex justify-between gap-4'>
            <button
              onClick={() => navigate('/scoretable')}
              className="bg-secondery hover:bg-red-700 transition-colors py-2 sm:py-3 px-3 sm:px-8 md:px-12 lg:px-16 rounded-l-full text-base sm:text-lg md:text-xl text-white shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 hover:scale-105"
            >
             ‎ ‎ ‎ ‎ ‎ ‎  More Results
            </button>
            <button
              onClick={() => navigate('/toppartficipants')}
              className="bg-secondery hover:bg-red-700 transition-colors py-2 sm:py-3 px-3 sm:px-8 md:px-12 lg:px-16 rounded-r-full text-base sm:text-lg md:text-xl text-white shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 hover:scale-105"
            >
              Top Participants
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamOverview;