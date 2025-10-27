import React from 'react';
import './PersonClassHierarchy.css';

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getInfo() {
    return `Name: ${this.name}, Age: ${this.age}`;
  }
}

class Student extends Person {
  constructor(name, age, course) {
    super(name, age);
    this.course = course;
  }

  getInfo() {
    return `${super.getInfo()}, Course: ${this.course}`;
  }
}

class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  getInfo() {
    return `${super.getInfo()}, Subject: ${this.subject}`;
  }
}

export default function PersonHierarchy() {
  const student = new Student('Aryan', 20, 'Computer Science');
  const teacher = new Teacher('Hardik', 19, 'Mathematics');

  return (
    <div className="container">
      <h1 className="title">Person Class Hierarchy</h1>
      <div className="card">
        <h2 className="subtitle">Student Details</h2>
        <p className="details">{student.getInfo()}</p>
      </div>
      <div className="card">
        <h2 className="subtitle">Teacher Details</h2>
        <p className="details">{teacher.getInfo()}</p>
      </div>
    </div>
  );
}
