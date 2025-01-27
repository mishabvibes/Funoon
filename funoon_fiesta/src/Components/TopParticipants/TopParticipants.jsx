import React, { useState } from 'react';
import { Trophy, Medal, Award, ChevronRight, Star, Target, Calendar, ChevronsUp } from 'lucide-react';
import { useResults } from '../../../context/DataContext';

const TopParticipants = () => {
    const { topSingleParticipants, results, loading } = useResults();
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const medalIcons = [
        {
            icon: Trophy,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-100',
            label: '1st Place',
            gradient: 'from-yellow-400 to-yellow-600'
        },
        {
            icon: Medal,
            color: 'text-gray-400',
            bgColor: 'bg-gray-100',
            label: '2nd Place',
            gradient: 'from-gray-300 to-gray-500'
        },
        {
            icon: Award,
            color: 'text-amber-700',
            bgColor: 'bg-amber-100',
            label: '3rd Place',
            gradient: 'from-amber-600 to-amber-800'
        }
    ];

    // Calculate total points and get all programs for a participant
    const getParticipantDetails = (studentName) => {
        const participantResults = results.filter(r => r.studentName === studentName);
        const totalPoints = participantResults.reduce((sum, r) => sum + Number(r.points || 0), 0);
        
        return {
            totalPoints,
            programs: participantResults.map(r => ({
                name: r.programName,
                prize: r.prize || 'N/A',
                points: r.points || 0,
                category: r.category
            }))
        };
    };

    const ParticipantStats = ({ participant }) => {
        const details = getParticipantDetails(participant.studentName);
        
        return (
            <div className="space-y-6 mt-6 p-6 bg-gray-50 dark:bg-[#242424]/50 rounded-xl">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-white dark:bg-[#242424] rounded-lg shadow-sm">
                        <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-900/20 mb-3">
                            <ChevronsUp className="w-6 h-6 text-red-500 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</span>
                        <span className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {details.totalPoints}
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white dark:bg-[#242424]/50 rounded-lg shadow-sm">
                        <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-900/20 mb-3">
                            <Target className="w-6 h-6 text-red-500 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Programs</span>
                        <span className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {details.programs.length}
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white dark:bg-[#242424]/50 rounded-lg shadow-sm">
                        <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-900/20 mb-3">
                            <Calendar className="w-6 h-6 text-red-500 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Team</span>
                        <span className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {participant.teamName}
                        </span>
                    </div>
                </div>

                {/* Programs List */}
                <div className="bg-white dark:bg-[#242424]/50 rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Program Details</h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {details.programs.map((program, index) => (
                            <div key={index} className="p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{program.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Category: {program.category}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-red-600 dark:text-red-400">
                                            {program.points} points
                                        </div>
                                        <div className={`text-sm ${
                                            program.prize === 'FIRST' ? 'text-yellow-500' :
                                            program.prize === 'SECOND' ? 'text-gray-500' :
                                            program.prize === 'THIRD' ? 'text-amber-700' :
                                            'text-gray-400'
                                        }`}>
                                            {program.prize}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Keep your existing header and layout */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-secondery">
                    Top Participants
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Recognizing our outstanding achievers
                </p>
            </div>

            <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-600 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-transparent bg-clip-text">
                                Leaderboard
                            </span>
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {topSingleParticipants.length} Participants
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    {topSingleParticipants.length > 0 ? (
                        <div className="space-y-6">
                            {topSingleParticipants.map((participant, index) => {
                                const MedalIcon = medalIcons[index].icon;
                                const isSelected = selectedParticipant?._id === participant._id;
                                const details = getParticipantDetails(participant.studentName);

                                return (
                                    <div key={participant._id} className="transform transition-all duration-300">
                                        <div
                                            onClick={() => setSelectedParticipant(isSelected ? null : participant)}
                                            className={`group relative overflow-hidden rounded-xl 
                                                ${isSelected ? 'bg-red-50 dark:bg-[#270b0b] ring-2 ring-red-500' : 
                                                'bg-gray-50 dark:bg-[#242424] hover:bg-gray-100 dark:hover:bg-gray-750'}
                                                transition-all duration-300 cursor-pointer`}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center gap-6">
                                                    <div className={`flex-shrink-0 p-4 rounded-full ${medalIcons[index].bgColor}
                                                        transform transition-transform duration-300 group-hover:scale-110`}>
                                                        <MedalIcon className={`w-8 h-8 ${medalIcons[index].color}`} />
                                                    </div>

                                                    <div className="flex-grow">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white 
                                                                    ">
                                                                    {participant.studentName}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                    {medalIcons[index].label} • {details.programs.length} Programs
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-3 py-2 rounded-full bg-red-100 dark:bg-red-900 
                                                                    text-red-600 dark:text-red-400 font-semibold text-xs">
                                                                    {details.totalPoints} total points
                                                                </span>
                                                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform 
                                                                    duration-300 ${isSelected ? 'rotate-90' : ''}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div className="transform transition-all duration-300 ease-in-out">
                                                <ParticipantStats participant={participant} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
                            <p className="text-xl text-gray-500 dark:text-gray-400">
                                No participants data available yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopParticipants;