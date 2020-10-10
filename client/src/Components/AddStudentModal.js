import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import "../App.css";
//import addStudentAttempt action
import { addStudentAttempt } from "../actions";
import { useDispatch, useSelector } from "react-redux";

function AddStudentModal(props) {
  //instantiating dispacther
  const dispatch = useDispatch();

  //form validation state declaration -- initial form state of validation: false
  const [validated, setValidated] = useState(false);
  const [studentData, setStudentData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "STUDENT",
    crsid: "1"
  });

  //importing global state
  const [isAuthenticatedUser, authObj, error] = useSelector((gState) => [
    gState.isAuthenticatedUser,
    gState.authObj,
    gState.error
   
  ]);

  //event handlers
  //----------------
  const handleInputChange = (e) => {
    //save current state
    const currState = {...studentData};
    //retrieve "name" attribute values form input changed
    const {name, value} = e.target;
    currState[name] = value;
    //update current State backup
    setStudentData(currState);
    // console.log("This is what we entered in form", currState)
  }

  //handleSubmit function to send student data
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    //checking validation on Submit event
    if(form.checkValidity() !== false && isAuthenticatedUser){
      //dispatch addStudentAttempt action and pass studentData
      dispatch(addStudentAttempt(studentData, authObj.accessToken));
      return <Alert variant="success">Student Added!</Alert>
    } 
    setValidated(true);
  
    if(error) {return <Alert variant="danger">{error}</Alert>}
  }

    return (
      <Modal
        {...props} className="signup-modal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="contained-modal-title-vcenter">
            Sign-up
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate validated={validated}>
                <Form.Group className="signup-first-name" >
                    <Form.Label>First Name</Form.Label>
                    <Form.Control id="signup-first-name" type="text" placeholder="First name" 
                        name="first_name"
                        value={studentData.first_name}
                        onChange={handleInputChange}
                        required />
                </Form.Group>
                <Form.Group className="signup-last-name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control id="signup-last-name" type="text" placeholder="Last name" 
                        name="last_name"
                        value={studentData.last_name}
                        onChange={handleInputChange}
                        required />
                </Form.Group>
                <Form.Group className="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control id="userID-Login" type="email" placeholder="Enter email"
                      name="email"
                      value={studentData.email}
                      onChange={handleInputChange}
                      required/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="exampleForm.ControlSelect1">
                  <Form.Label>Select Course</Form.Label>
                    <Form.Control as="select" 
                    name="crsid"
                    value={studentData.crsid} 
                    onChange={handleInputChange} 
                    required>
                      <option value="1">Test Course One</option>
                      <option value="2">Test Course Two</option>
                      <option value="3">Test Course Three</option>
                    </Form.Control>
                </Form.Group>
                <Button className="primary-button add-student"  onClick={ handleSubmit } >Add Student</Button>
            </Form>
        </Modal.Body>   
      </Modal>
    );
  }

  export default AddStudentModal;