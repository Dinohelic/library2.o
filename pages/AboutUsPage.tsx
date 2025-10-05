import React from 'react';
import { TEAM_MEMBERS, MENTORS } from '../constants';
import type { TeamMember } from '../types';

const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" src={member.imageUrl} alt={member.name} loading="lazy" decoding="async" />
    <h3 className="text-xl font-bold text-brand-blue">{member.name}</h3>
    <p className="text-brand-orange font-semibold mb-2">{member.role}</p>
    <p className="text-slate-600 dark:text-slate-300 text-sm">{member.bio}</p>
  </div>
);

const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-brand-blue mb-2">About Living Library 2.0</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          We are a team of educators, technologists, and librarians passionate about making knowledge more accessible and engaging through the power of artificial intelligence.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200 mb-8">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map(member => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200 mb-8">Our Mentors</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {MENTORS.map(mentor => (
            <MemberCard key={mentor.name} member={mentor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;