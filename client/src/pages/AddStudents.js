import React, { useState, useEffect } from 'react';

const AddStudents = () => {
  const [studentData, setStudentData] = useState({
    date: '',
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    course: '',
    fees: '',
    duration: '',
    durationOption: '',
    photo: null,
    marksheet: null,
    aadhaar: null,
    reference: ''
  });

  const [registrationId, setRegistrationId] = useState(null);

  const courses = [
    { name: 'Office Automation', fee: 3600, duration: 3 },
    { name: 'Diploma in Computer Application and Accounts', fee: 7200, duration: 6 },
    { name: 'Advance Diploma in Computer Application', fee: 14400, duration: 12 },
    { name: 'Advance Excel', fee: 2500, duration: 2 },
    { name: 'Tally/Tally Prime', fee: 4000, duration: 2 },
    { name: 'Auto CAD', fee: 5000, duration: 3 },
    { name: 'Web Development using MERN', fee: 18000, duration: 14 },
    { name: 'Web Development using Java Springboot', fee: 18000, duration: 14 },
    { name: 'C Language', fee: 3500, duration: 4 },
    { name: 'C++ Language', fee: 3500, duration: 4 },
    { name: 'Core Java', fee: 5000, duration: 6 },
    { name: 'Advance Java', fee: 7000, duration: 6 },
    { name: 'Python', fee: 6000, duration: 6 },
    { name: 'Data Structure and Algorithms', fee: 6000, duration: 6 }
  ];

  useEffect(() => {
    const today = new Date();
    const oneWeekBack = new Date(today);
    oneWeekBack.setDate(today.getDate() - 7);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedOneWeekBack = oneWeekBack.toISOString().split('T')[0];

    setStudentData(prevData => ({
      ...prevData,
      date: formattedToday
    }));

    document.getElementById('date').setAttribute('min', formattedOneWeekBack);
    document.getElementById('date').setAttribute('max', formattedToday);
  }, []);

  useEffect(() => {
    const selectedCourse = courses.find(course => course.name === studentData.course);
    if (selectedCourse) {
      let adjustedDuration = selectedCourse.duration;
      if (studentData.durationOption === '2 hours') {
        if (selectedCourse.duration > 1) {
          adjustedDuration = selectedCourse.duration / 2;
        }
      }
      setStudentData(prevData => ({
        ...prevData,
        fees: selectedCourse.fee,
        duration: `${adjustedDuration} ${adjustedDuration > 1 ? 'Months' : 'Month'}`
      }));
    }
  }, [studentData.course, studentData.durationOption]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'dob') {
      const age = calculateAge(value);
      setStudentData({ ...studentData, dob: value, age });
    } else if (files) {
      setStudentData({ ...studentData, [name]: files[0] });
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  const handleDurationOptionChange = (e) => {
    const { value } = e.target;
    setStudentData(prevData => ({
      ...prevData,
      durationOption: value
    }));
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(studentData).forEach(key => {
      if (key !== 'photo' && key !== 'marksheet' && key !== 'aadhaar') {
        formData.append(key, studentData[key]);
      } else if (studentData[key]) {
        formData.append(key, studentData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/add-student', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        setRegistrationId(result.studentId); // Store the registration ID
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the student');
    }
  };

  const isProgrammingCourse = (courseName) => {
    return [
      'Web Development using MERN',
      'Web Development using Java Springboot',
      'C Language',
      'C++ Language',
      'Core Java',
      'Advance Java',
      'Python',
      'Data Structure and Algorithms'
    ].includes(courseName);
  };

  const durationOptions = [
    { value: '', label: 'Select Duration' },
    ...(!isProgrammingCourse(studentData.course) ? [
      { value: '1 hour', label: '1 hour' },
    ] : []),
    { value: '2 hours', label: '2 hours' }
  ];

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="date" className="form-label">Date</label>
            <input type="date" id="date" placeholder='date' name="date" value={studentData.date} className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" id="name" placeholder='name' name="name" value={studentData.name} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="fatherName" className="form-label">Father's Name</label>
            <input type="text" id="fatherName" placeholder='fatherName' name="fatherName" value={studentData.fatherName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="motherName" className="form-label">Mother's Name</label>
            <input type="text" id="motherName" placeholder='motherName' name="motherName" value={studentData.motherName} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input type="date" id="dob" placeholder='dob' name="dob" value={studentData.dob} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="age" className="form-label">Age</label>
            <input type="number" id="age" placeholder='age' name="age" value={studentData.age} className="form-control" readOnly />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" placeholder='email' name="email" value={studentData.email} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone No.</label>
            <input type="tel" id="phone" placeholder='phone' name="phone" value={studentData.phone} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea id="address" placeholder='address' name="address" value={studentData.address} onChange={handleChange} className="form-control" required></textarea>
          </div>
          <div className="col-md-6">
            <label htmlFor="course" className="form-label">Course</label>
            <select id="course" name="course" value={studentData.course} onChange={handleChange} className="form-control" required>
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="fees" className="form-label">Fees</label>
            <input type="text" id="fees" placeholder='fees' name="fees" value={studentData.fees} readOnly className="form-control" />
          </div>
          <div className="col-md-6">
            <label htmlFor="duration" className="form-label">Duration</label>
            <input type="text" id="duration" placeholder='duration' name="duration" value={studentData.duration} readOnly className="form-control" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="durationOption" className="form-label">Duration Option</label>
            <select id="durationOption" name="durationOption" value={studentData.durationOption} onChange={handleDurationOptionChange} className="form-control">
              {durationOptions.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="reference" className="form-label">Reference</label>
            <input type="text" id="reference" placeholder='reference' name="reference" value={studentData.reference} onChange={handleChange} className="form-control" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="photo" className="form-label">Photo</label>
            <input type="file" id="photo" name="photo" onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label htmlFor="marksheet" className="form-label">Marksheet</label>
            <input type="file" id="marksheet" name="marksheet" onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label htmlFor="aadhaar" className="form-label">Aadhaar</label>
            <input type="file" id="aadhaar" name="aadhaar" onChange={handleChange} className="form-control" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {registrationId && (
        <div className="alert alert-success mt-3">
          Student successfully registered! Registration ID: {registrationId}
        </div>
      )}
    </div>
  );
};

export default AddStudents;
