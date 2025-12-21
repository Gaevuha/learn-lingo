import React from 'react';
import { Teacher } from '../types/teacher';

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div>
      <h3>{teacher.name}</h3>
      <p>{teacher.subject}</p>
    </div>
  );
};

export default TeacherCard;