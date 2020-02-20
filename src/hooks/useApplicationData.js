import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(){

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewer: {}
  });
  const setDay = day => setState({...state, day});
  
  useEffect(()=>{
    let days = axios.get('api/days');
    let appointments = axios.get('/api/appointments');
    let interviewers = axios.get('/api/interviewers');
    Promise.all([days, appointments, interviewers])
    .then(all => {
      setState(prev => ({days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    .catch(err => console.log(err));
  },[])
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => setState({...state, appointments}))
  }
  
  function cancelInterview(id){
    return axios.delete(`/api/appointments/${id}`)
    .then(res => console.log(res))
  
  }

  return {state, setDay, bookInterview, cancelInterview};
}

