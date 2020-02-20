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
      const { all } = action;
      return {days: all[0].data, appointments: all[1].data, interviewers: all[2].data}
    },
    SET_INTERVIEW: (state, action) => {
      const { interview, appointments } = action;
      return interview ? {...state, appointments} : state;
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

// function updateArray(id, appointments){
//   return appointments.map(appointment => {
//     if(appointment.id !== id){
//       return appointment;
//     }
//   });
// }

