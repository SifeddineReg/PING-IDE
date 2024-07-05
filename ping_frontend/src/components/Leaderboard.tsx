import React, { useEffect, useState } from 'react';
import usersData from '../assets/data.json';
import './Leaderboard.css';
import { Navbar } from './navbar/navbar';

interface LeaderboardProps {
    avgCodeTidiness: number;
    avgTestCoverage: number;
    totalTasks: number;
}

export function Leaderboard({ avgCodeTidiness, avgTestCoverage, totalTasks }: LeaderboardProps) {
    const [sortedUsers, setSortedUsers] = useState<{
        id: number;
        name: string;
        password: string;
        poste: number;
        runtime: number;
        code_tidiness: number;
        total_tache: number;
        total_warnings: number;
        test_coverage: number;
        email: string;
        github: string;
        nb_file: number;
    }[]>([]);

    useEffect(() => {
        let sorted = usersData.users.sort((a: any, b: any) => {
            const scoreA = a.code_tidiness + a.test_coverage + a.total_tache;
            const scoreB = b.code_tidiness + b.test_coverage + b.total_tache;
            return scoreB - scoreA;
        });

        sorted = usersData.users.filter((user: any) => user.poste !== 1);
        setSortedUsers(sorted);

    }, []);

    const createClipPath = (percentage: number) => {
        if (percentage === 100) {
            return "M50,0 A50,50 0 1 1 49.999,0 Z";
        } else {
            const angle = (percentage / 100) * 360;
            const x = Math.cos((angle - 90) * (Math.PI / 180));
            const y = Math.sin((angle - 90) * (Math.PI / 180));
            const largeArcFlag = percentage > 50 ? 1 : 0;
            return `M50,50 L50,0 A50,50 0 ${largeArcFlag} 1 ${50 + 50 * x},${50 + 50 * y} Z`;
        }
    };

    function empty() {}

    return (
        <>
            <Navbar open_file={empty} open_folder={empty} />
            <div className='lead'>
                <div className='leaderboard'>
                    <div className="container podium">
                        {sortedUsers.length >= 3 ? (
                            <>
                                <div key={sortedUsers[1].id} className="podium_item second">
                                    <p className="podium_city">{sortedUsers[1].name}</p>
                                    <img src={`src/assets/second_place.png`} className='image_podum'></img>
                                    <div className="podium_rank second">
                                        <div className="points">{sortedUsers[1].code_tidiness + sortedUsers[1].test_coverage + sortedUsers[1].total_tache} pts</div>
                                    </div>
                                </div>
                                <div key={sortedUsers[0].id} className="podium_item first">
                                    <p className="podium_city">{sortedUsers[0].name}</p>
                                    <img src={`src/assets/first_place.png`} className='image_podum'></img>
                                    <div className="podium_rank first">
                                        <div className="points">{sortedUsers[0].code_tidiness + sortedUsers[0].test_coverage + sortedUsers[0].total_tache} pts</div>
                                    </div>
                                </div>
                                {sortedUsers.length > 2 && (
                                    <div key={sortedUsers[2].id} className="podium_item third">
                                        <p className="podium_city">{sortedUsers[2].name}</p>
                                        <img src={`src/assets/third_place.png`} className='image_podum'></img>
                                        <div className="podium_rank third">
                                            <div className="points">{sortedUsers[2].code_tidiness + sortedUsers[2].test_coverage + sortedUsers[2].total_tache} pts</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="container podium">
                            </div>
                        )}
                    </div>
                    {sortedUsers.length > 3 && (
                        <div className="placement" style={{ overflow: 'auto' }}>
                            {sortedUsers.slice(3).map((user: any, index: number) => (
                                <div key={user.id} className='podium_member'>
                                    <div className='podium_member align'>
                                        <p className='podium_member place'>{index + 4}</p>
                                        <p className='podium_member name'>{user.name}</p>
                                    </div>
                                    <div className='podium_member points'>{user.code_tidiness + user.test_coverage + user.total_tache} pts</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='deadline_text'>Deadline: {usersData.deadline}</div>
                </div>
                <div className='indicators'>
                    <div className='image-container cinquante'>
                        <div className="ind">
                            <svg viewBox="0 0 100 100">
                                <path d={createClipPath(avgCodeTidiness)} fill="rgba(69, 208, 19, 0.85)" />
                            </svg>
                            <div className='percentage'>{avgCodeTidiness}%</div>
                        </div>
                        <div className="ind_label">
                            <p>Avg Code tidiness</p>
                        </div>
                    </div>
                    <div className='image-container cinquante'>
                        <div className="ind">
                            <svg viewBox="0 0 100 100">
                                <path d={createClipPath(avgTestCoverage)} fill="rgba(61, 108, 227, 0.85)" />
                            </svg>
                            <div className='percentage'>{avgTestCoverage}%</div>
                        </div>
                        <div className="ind_label">
                            <p>Avg Test coverage</p>
                        </div>
                    </div>
                    <div className='image-container cinquante'>
                        <div className="ind">
                            <svg viewBox="0 0 100 100">
                                <path d={createClipPath(100)} fill="rgba(255, 0, 0, 0.85)" />
                            </svg>
                            <div className='percentage'>{totalTasks}</div>
                        </div>
                        <div className="ind_label">
                            <p>Avg Total tasks</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}