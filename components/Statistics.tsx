
import React from 'react';
import { UserStats, Deck } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface StatisticsProps {
  stats: UserStats;
  decks: Deck[];
}

const Statistics: React.FC<StatisticsProps> = ({ stats, decks }) => {
  const activityData = [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 72 },
    { day: 'Wed', count: 38 },
    { day: 'Thu', count: 89 },
    { day: 'Fri', count: 56 },
    { day: 'Sat', count: 120 },
    { day: 'Sun', count: stats.cardsStudied % 100 },
  ];

  const deckCompletionData = decks.map(d => ({
    name: d.title.substring(0, 10) + '...',
    cards: d.cards.length
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Studied', value: stats.cardsStudied, sub: 'Cards total', color: 'indigo' },
          { label: 'Accuracy', value: `${Math.round((stats.correctAnswers / stats.cardsStudied) * 100)}%`, sub: 'Average', color: 'green' },
          { label: 'Streak', value: stats.streakDays, sub: 'Current days', color: 'orange' },
          { label: 'Points', value: stats.totalPoints, sub: 'Lifetime total', color: 'purple' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
            <p className={`text-3xl font-bold text-${item.color}-600 mt-1`}>{item.value}</p>
            <p className="text-xs text-gray-400 mt-2">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Weekly Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Library Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deckCompletionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="cards" radius={[0, 4, 4, 0]}>
                  {deckCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#ec4899', '#f43f5e'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
