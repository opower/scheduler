import React, { useReducer, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(){

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";


  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: {},
    interviewer: {}
  });

function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        const { day } = action;
        return {...state, day}
      case SET_APPLICATION_DATA:
        const { all } = action;
        return {days: all[0].data, appointments: all[1].data, interviewers: all[2].data}
      case SET_INTERVIEW: {
        const { interview, appointments } = action;
        return interview ? {...state, appointments} : state;
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const setDay = day => dispatch({type: SET_DAY, day});
  
  useEffect(()=>{
    let days = axios.get('api/days');
    let appointments = axios.get('/api/appointments');
    let interviewers = axios.get('/api/interviewers');
    Promise.all([days, appointments, interviewers])
    .then(all => {
      dispatch({type: SET_APPLICATION_DATA, days, interviewers, appointments, all});
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
    .then(() => dispatch({type: SET_INTERVIEW, id, interview, appointments}))
  }
  
  function cancelInterview(id){
    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({type: SET_INTERVIEW, id, interview: null}))
  }
  
  return {state, setDay, bookInterview, cancelInterview};
}

