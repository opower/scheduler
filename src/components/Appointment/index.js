import React, { useState } from 'react';
import './styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import useVisualMode from '../../hooks/useVisualMode';
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";


export default function Appointment (props){
  
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  const interviewers = [];

  const onAdd = ()=>{
    transition(CREATE);
  }

  const onCancel = () => {
    back();
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>

      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={onCancel}/>}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}

    </article>
  )
}