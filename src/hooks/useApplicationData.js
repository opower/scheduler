import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, reducer } from "reducers/application";

export default function useApplicationData(){

  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: {},
    interviewer: {}
  });

  const setDay = day => dispatch({type: SET_DAY, day});
  
  useEffect(()=>{
    let days = axios.get('/api/days');
    let appointments = axios.get('/api/appointments');
    let interviewers = axios.get('/api/interviewers');
    Promise.all([days, appointments, interviewers])
    .then(all => {
      dispatch({type: SET_APPLICATION_DATA, days: all[0].data, interviewers:all[2].data, appointments:all[1].data});
    })
    .catch(err => console.log(err));
  },[])
  
  function bookInterview(id, interview) {

    const days = updateSpots(id, true);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => dispatch({type: SET_INTERVIEW, interview, appointments, days}))
  }
  
  function cancelInterview(id){

    const days = updateSpots(id, false);

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({type: SET_INTERVIEW, id, appointments, interview: null, days}))
  }

  //appointment id is know when an interview is confirmed or canceled
  function updateSpots(id, flag){
    const filterDay = state.days.filter(day => day.appointments.includes(id));
    const dayId = filterDay[0].id;
    let newSpots = state.days[dayId - 1].spots;

    if(flag && state.appointments[id].interview === null){
      newSpots--;
    } else if (!flag){
      newSpots++;
    }

    return state.days.map(day => {
      if(day.id !== dayId){
        return day
      } return {
        ...day,
        spots: newSpots
      }
    })
  }

  return {state, setDay, bookInterview, cancelInterview};
}


