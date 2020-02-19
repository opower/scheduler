import React, { useState } from 'react';
import './styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import Status from './Status';
import useVisualMode from '../../hooks/useVisualMode';
import Confirm from './Confirm';
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = 'SAVING';
const DELETE = 'DELETING';
const CONFIRM = 'CONFIRM';
const msg = 'Are you sure you would like to delete?';
const EDIT = 'EDIT';


export default function Appointment (props){
  
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  function onAdd(){
    transition(CREATE);
  }

  function onEdit(){
    transition(EDIT);
  }

  function onCancel(){
    back();
  }

  function onConfirm(){
    transition(CONFIRM);
  }

  function onDelete(){
    transition(DELETE)
    props.cancelInterview(props.id)
    .then(res => transition(EMPTY))
  }


  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(res => transition(SHOW))
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>

      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save}/>}
      {mode === SAVING && <Status message={SAVING} />}
      {mode === SHOW && <Show student={props.interview.student}  interviewer={props.interview.interviewer} onDelete={onConfirm} onEdit={onEdit}/>}
      {mode === DELETE && <Status message={DELETE}/>}
      {mode === CONFIRM && <Confirm message={msg} onCancel={onCancel} onConfirm={onDelete} />}
      {mode === EDIT && <Form student={props.interview.student} interviewer={props.interview.interviewer} interviewers={props.interviewers} onCancel={onCancel} onSave={save} interviewer={props.interview.interviewer.id}/>}

    </article>
  )
}