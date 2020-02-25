import { useReducer, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(){

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const lookUp = {
    SET_DAY: (state, action) => {
      const { day } = action;
      return {...state, day}
    },
    SET_APPLICATION_DATA: (state, action) => {
      const { days, appointments, interviewers } = action;
      return {...state, days, appointments, interviewers}
    },
    SET_INTERVIEW: (state, action) => {
      const { interview, appointments, days} = action;
      return interview ? {...state, appointments, days} : {...state, appointments, days};
    }
  }

  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: {},
    interviewer: {}
  });

  function reducer(state, action) {
    return lookUp[action.type](state, action);
  }

  const setDay = day => dispatch({type: SET_DAY, day});
  
  useEffect(()=>{
    let days = axios.get('api/days');
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
    .catch(err => console.log(err))
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
    .catch(err => console.log(err))
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


