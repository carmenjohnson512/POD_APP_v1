//importing constants
import { 
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, 
  LOGOUT_REQUEST, LOGOUT_SUCCESS,LOGOUT_FAILURE,
  ADD_STUDENT_REQUEST, ADD_STUDENT_SUCCESS, ADD_STUDENT_FAILURE,
  ADD_COURSE_REQUEST, ADD_COURSE_SUCCESS, ADD_COURSE_FAILURE,
  GET_COURSES_REQUEST, GET_COURSES_SUCCESS, GET_COURSES_FAILURE,
  GET_LESSONS_REQUEST, GET_LESSONS_SUCCESS, GET_LESSONS_FAILURE,
  SET_COURSE_IDREQ , SET_COURSE_IDSUCCESS , SET_COURSE_IDFAIL,
  GET_ALL_INSTRUCTORS_REQUEST, GET_ALL_INSTRUCTORS_SUCCESS, GET_ALL_INSTRUCTORS_FAILURE,
  GET_ALL_STUDENTS_REQUEST, GET_ALL_STUDENTS_SUCCESS, GET_ALL_STUDENTS_FAILURE,
  GET_ROSTER_REQUEST, GET_ROSTER_SUCCESS, GET_ROSTER_FAILURE,
  DELETE_INSTRUCTOR_SUCCESS, DELETE_INSTRUCTOR_FAILURE,
  DELETE_STUDENT_SUCCESS, DELETE_STUDENT_FAILURE,
  GET_URL_REQUEST, GET_URL_SUCCESS, GET_URL_FAILURE,
  INSTRUCTOR_ACTIVATION_REQUEST,INSTRUCTOR_ACTIVATION_SUCCESS,INSTRUCTOR_ACTIVATION_FAILURE,
  INSTRUCTOR_DEACTIVATION_REQUEST,INSTRUCTOR_DEACTIVATION_SUCCESS,INSTRUCTOR_DEACTIVATION_FAILURE,
  STUDENT_ACTIVATION_REQUEST,STUDENT_ACTIVATION_SUCCESS,STUDENT_ACTIVATION_FAILURE,
  STUDENT_DEACTIVATION_REQUEST,STUDENT_DEACTIVATION_SUCCESS,STUDENT_DEACTIVATION_FAILURE,
} from "./constants";
import { createSession, destroySession, validateSession } from "./utils/sessions";
import axios from "axios";

//action: LOGIN_SUCCESS once backend call is successfull
const loginSuccess = (authObj) => ({
  type:    LOGIN_SUCCESS,
  isFetchingAuth: false,
  isAuthenticatedUser: true,
  payload: authObj,
});

//action: LOGIN_FAILURE if backend call is unsuccessful
const loginFailed = (error) => ({
  type:    LOGIN_FAILURE,
  isFetchingAuth: false,
  isAuthenticatedUser: false,
  payload: error,
});

//action: LOGIN_REQUEST  to backend REST api
export const loginAttempt = (creds) => {
  //function receives credentials
  return (dispatch, getState) => {
    //dispatch action to notify client
    //of login request in progress
    dispatch({
        type: LOGIN_REQUEST,
        isFetchingAuth: true,
        isAuthenticatedUser: false
      });
    //use axios to query REST api for login.
    axios
      .post("/api/auth/signin", creds)
      .then( (response) => {
        //if request is successful, persist a session and dispatch
        //login success action
        if(response.status === 200){
          createSession(response.data);
          dispatch(loginSuccess(response.data));
        }
      })
      .catch( (error) => {
        dispatch(loginFailed(error.message));
      });
  }
}

///Action to load courses
const getCourseSuccess = (courses) => ({
  type: GET_COURSES_SUCCESS,
  payload: courses
})
//When Request from API fails
const getCourseFailure = (error) => ({
  type: GET_COURSES_FAILURE,
  payload: error,
})


//courses Api request for instructor
export const getCourses = (token) => {
 
  return (dispatch, getState) => {
    dispatch({type: GET_COURSES_REQUEST});
    axios
      .get("/api/user/instructor/courses", {
        headers: {
          'x-access-token': token
        }
      })
      .then((response) => {
        dispatch(getCourseSuccess(response.data))
     
      })
      .catch((error) => {
        dispatch(getCourseFailure(error.message))
      })
  }
}


//Get Courses Student API request
export const getStuCourses = (token) => {
  return (dispatch, getState) => {
    dispatch({type: GET_COURSES_REQUEST});
    axios
      .get("/api/user/student/courses", {
        headers: {
          'x-access-token': token
        }
      })
      .then((response) => {
        // console.log(response)
        let stuResponse = response.data.data.Courses
        dispatch(getCourseSuccess(stuResponse))
        // console.log(response)

      })
      .catch((error) => {
        dispatch(getCourseFailure(error.message))
      })
  }
}


//Actions to get lessons for the instructors page
///Action to load courses
const getLessonsSuccess = (lessons) => ({
  type: GET_LESSONS_SUCCESS,
  payload: lessons
})
//When Request from API fails
const getLessonsFailure = (error) => ({
  type: GET_LESSONS_FAILURE,
  payload: error,
})


//courses Api request for instructor
export const getLessons = (token, id) => {
  return (dispatch, getState) => {
    dispatch({type: GET_LESSONS_REQUEST});
    axios
      .get("/api/user/instructor/lessons/" + id , {
        headers: {
          'x-access-token': token
        }
      })
      .then((response) => {
        
        dispatch(getLessonsSuccess(response.data))
        
      })
      .catch((error) => {
        dispatch(getLessonsFailure(error.message))
      })
  }
}

//Get Lessons for students pages
export const getStuLessons = (token, id) => {
  return (dispatch, getState) => {
    dispatch({type: GET_LESSONS_REQUEST});
    axios
      .get("/api/user/student/courses/" + id +"/lessons", {
        headers: {
          'x-access-token': token
        }
      })
      .then((response) => {
        // console.log(response)
        dispatch(getLessonsSuccess(response.data))
        
      })
      .catch((error) => {
        dispatch(getLessonsFailure(error.message))
      })
  }
}


const setCourseIdSuccess = (id) => {
 
return {
  type: SET_COURSE_IDSUCCESS,
  payload: id
}
}

//When Request from API fails
const setCourseIdFailure = (error) => ({
  type: SET_COURSE_IDFAIL,
  payload: error,
})

export const setCourseId = (id) => {
  return (dispatch, getState) => {
    if(id){
      dispatch(setCourseIdSuccess(id))

    } else {
      dispatch(setCourseIdFailure())
    }

  }
}


//Action to get Students Roster
const getRosterSuccess = (stuRoster) => (
  {
    type: GET_ROSTER_SUCCESS,
    payload: stuRoster
  }
)
const getRosterFailure = (error) => ({
  type: GET_ROSTER_FAILURE,
  payload: error
})

export const getStuRoster = (token) => {
  return (dispatch, getState) => {
    dispatch({type: GET_ROSTER_REQUEST})
    axios
    .get("/api/user/instructor/courses", {
      headers: {
        'x-access-token': token
      }
    })
    .then((response) => {
      let roster = response.data.data
      // console.log(response.data)
      dispatch(getRosterSuccess(roster))

      
    })
    .catch((error) => {
      dispatch(getRosterFailure(error.message))
    })
  }
}

///Action to get all instructors
const getAllInstructorsSuccess = (allInstructors) => ({
  type: GET_ALL_INSTRUCTORS_SUCCESS,
  payload: allInstructors
})
//When Request from API fails
const getAllInstructorsFailure = (error) => ({
  type: GET_ALL_INSTRUCTORS_FAILURE,
  payload: error,
})

//view instructor Api request for admin
export const getAllInstructors = (token) => {
 
  return (dispatch, getState) => {
    dispatch({type: GET_ALL_INSTRUCTORS_REQUEST});
    axios
      .get("/api/user/admin/instructors", {
        headers: {
          'x-access-token': token
        }
      })
      .then((response) => {
        dispatch(getAllInstructorsSuccess(response.data))
     
      })
      .catch((error) => {
        dispatch(getAllInstructorsFailure(error.message))
      })
  }
}

///Action to get all student
const getAllStudentsSuccess = (allStudents) => ({
  type: GET_ALL_STUDENTS_SUCCESS,
  payload: allStudents
})
//When Request from API fails
const getAllStudentsFailure = (error) => ({
  type: GET_ALL_STUDENTS_FAILURE,
  payload: error,
})


//view students Api request for admin
export const getAllStudents = (token) => {
 
  return (dispatch, getState) => {
    dispatch({type: GET_ALL_STUDENTS_REQUEST});
    axios
      .get("/api/user/admin/students", {
        headers: {
          'x-access-token': token
        }
      })
      .then((response) => {
        dispatch(getAllStudentsSuccess(response.data))
     
      })
      .catch((error) => {
        dispatch(getAllStudentsFailure(error.message))
      })
  }
}

const logoutSuccess = () => ({
  type:    LOGOUT_SUCCESS,
  isAuthenticatedUser: false,
});

const logoutFail = (error) => ({
  type:    LOGOUT_FAILURE,
  isAuthenticatedUser: false,
  payload: error,
});

//action: LOGOUT_REQUEST
export const logoutAttempt = () => {
  //dispatch logout request
  return (dispatch, getState) => {
    dispatch({
      type: LOGOUT_REQUEST
    });
    //call helper function to remove session from localStorage
    destroySession();
    //validate session to check if it was properly deleted
    if(!validateSession()){
      dispatch(logoutSuccess());
    }
    else{
      //__session was not removed
      dispatch(logoutFail("Error deleting existing session."))
    }
  }
}

//action: Add_STUDENT_FAILURE if backend call is unsuccessful
const addStudentFailed = (error) => ({
  type:    ADD_STUDENT_FAILURE,
  isFetchingAuth: false,
  isAuthenticatedUser: false,
  payload: error,
});

//action: ADD_STUDENT_SUCCESS once backend call is successfull
const addStudentSuccess = (stuObj) => ({
  type:    ADD_STUDENT_SUCCESS,
  isFetchingAuth: false,
  isAuthenticatedUser: true,
  payload: stuObj,
});

//action: ADD_STUDENT_REQUEST to REST API
export const addStudentAttempt = (data, accessToken) => {
    //function receives credentials
    return (dispatch, getState) => {
      //dispatch action to notify client 
      //of add student request in progress
      dispatch({ 
          type: ADD_STUDENT_REQUEST, 
          isAddingNewUser: true, 
          isAuthenticatedUser: true 
        });
      //use axios to query REST api for add student.
      axios
        .post("/api/auth/signup", data, {
          headers: {
            "x-access-token": accessToken
          }
        })
        .then( (response) => {
          //if request is successful, persist a session and dispatch
          //login success action
          if(response.status === 200){
            dispatch(addStudentSuccess(response.data));
          }
        })
        .catch( (error) => {
          dispatch(addStudentFailed(error.message));
        });
      }
  }
//action: Add_COURSE_FAILURE if backend call is unsuccessful
const addCourseFailed = (error) => ({
  type:    ADD_COURSE_FAILURE,
  isFetchingAuth: false,
  isAuthenticatedUser: false,
  payload: error,
});

//action: ADD_COURSE_SUCCESS once backend call is successfull
const addCourseSuccess = (courseObj) => ({
  type:    ADD_COURSE_SUCCESS,
  isFetchingAuth: false,
  isAuthenticatedUser: true,
  payload: courseObj,
});

//action: ADD_COURSE_REQUEST to REST API
export const addCourseAttempt = (data, accessToken) => {
    //function receives credentials
    return (dispatch, getState) => {
      //dispatch action to notify client 
      //of add student request in progress
      dispatch({ 
          type: ADD_COURSE_REQUEST, 
          isAddingCourseUser: true, 
          isAuthenticatedUser: true 
        });
      //use axios to query REST api for add student.
      axios
        .post("/api/user/instructor/courses", data, {
          headers: {
            "x-access-token": accessToken
          }
        })
        .then( (response) => {
          //if request is successful, persist a session and dispatch
          //login success action
          if(response.status === 200){
            dispatch(addCourseSuccess(response.data));
          }
        })
        .catch( (error) => {
          dispatch(addCourseFailed(error.message));
        });

        
      }
  }

  const getUrlSuccess = (url) => {
 
    return {
      type: GET_URL_SUCCESS,
      payload: url
    }
  }

  const getUrlfailure = (error) => {
 
    return {
      type: GET_URL_FAILURE,
      payload: error
    }
  }

  export const getUrl = (url) => {
    return(dispatch, getState) => {
      if(url){
        dispatch(getUrlSuccess(url))
      }else {
        dispatch(getUrlfailure())
      }
    }
  }


///Action to delete instructor
const deleteInstructorSuccess = (id) => ({
  type: DELETE_INSTRUCTOR_SUCCESS,
  payload: id
})
//When Request from API fails
const deleteInstructorFailure = (error) => ({
  type: DELETE_INSTRUCTOR_FAILURE,
  payload: error,
})

//delete instructor Api request for admin
export const deleteInstructor = (token, id) => {

  return (dispatch, gState) => {
   axios.delete('/api/user/admin/instructor/?id=' + id, {
      headers: {
        'x-access-token': token
      }
    }).then((id) => {
      dispatch(deleteInstructorSuccess(id))
      dispatch(getAllInstructors(token))
    }).catch((err) => {
      dispatch(deleteInstructorFailure(err))
    })
  }
}

///Action to delete student
const deleteStudentSuccess = (id) => ({
  type: DELETE_STUDENT_SUCCESS,
  payload: id
})
//When Request from API fails
const deleteStudentFailure = (error) => ({
  type: DELETE_STUDENT_FAILURE,
  payload: error,
})

//delete student Api request for admin
export const deleteStudent = (token, id) => {

  return (dispatch, getState) => {
  axios.delete("/api/user/admin/student/?id=" + id, {
    headers: {
     'x-access-token': token
    }
  })
  .then((id) => {
    dispatch(deleteStudentSuccess(id))
    dispatch(getAllStudents(token))
  }).catch((err) => {
    dispatch(deleteStudentFailure(err))
  })
  }

}

///Action to delete student
const activateInstructorSuccess = (id) => ({
  type: INSTRUCTOR_ACTIVATION_SUCCESS,
  payload: id
})
//When Request from API fails
const activateInstructorFailure = (error) => ({
  type: INSTRUCTOR_ACTIVATION_FAILURE,
  payload: error,
})

//view instructor Api request for admin
export const activateInstructor = (token, id) => {

  return (dispatch, getState) => {
    dispatch({type: INSTRUCTOR_ACTIVATION_REQUEST})
  axios
  .put("/api/user/admin/user/instructor/activate/?id=" + id, {
    headers: {
     'x-access-token': token
    }
  })
  .then((id) => {
    dispatch(activateInstructorSuccess(id))
    dispatch(getAllInstructors(token))
    console.log(token)
  }).catch((err) => {
    dispatch(activateInstructorFailure(err))
  })
  }

}

///Action to delete student
const deactivateInstructorSuccess = (id) => ({
  type: INSTRUCTOR_DEACTIVATION_SUCCESS,
  payload: id
})
//When Request from API fails
const deactivateInstructorFailure = (error) => ({
  type: INSTRUCTOR_DEACTIVATION_FAILURE,
  payload: error,
})

//view instructor Api request for admin
export const deactivateInstructor = (token, id) => {

  return (dispatch, getState) => {
    dispatch({type: INSTRUCTOR_DEACTIVATION_REQUEST})
  axios
  .put("/api/user/admin/user/instructor/deactivate/?id=" + id, {
    headers: {
     'x-access-token': token
    }
  })
  .then((id) => {
    dispatch(deactivateInstructorSuccess(id))
    dispatch(getAllInstructors(token))
    console.log(token)
  }).catch((err) => {
    dispatch(deactivateInstructorFailure(err))
  })
  }

}

///Action to delete student
const deactivateStudentSuccess = (id) => ({
  type: STUDENT_DEACTIVATION_SUCCESS,
  payload: id
})
//When Request from API fails
const deactivateStudentFailure = (error) => ({
  type: STUDENT_DEACTIVATION_FAILURE,
  payload: error,
})

//view instructor Api request for admin
export const deactivateStudent = (token, id) => {

  return (dispatch, getState) => {
    dispatch({type: STUDENT_DEACTIVATION_REQUEST})
  axios
  .put("/api/user/admin/user/student/deactivate/?id=" + id, {
    headers: {
     'x-access-token': token
    }
  })
  .then((id) => {
    dispatch(deactivateStudentSuccess(id))
    dispatch(getAllStudents(token))
    console.log(token)
  }).catch((err) => {
    dispatch(deactivateStudentFailure(err))
  })
  }

}

///Action to delete student
const activateStudentSuccess = (id) => ({
  type: STUDENT_ACTIVATION_SUCCESS,
  payload: id
})
//When Request from API fails
const activateStudentFailure = (error) => ({
  type: STUDENT_ACTIVATION_FAILURE,
  payload: error,
})

//view instructor Api request for admin
export const activateStudent = (token, id) => {
  console.log(token)

  return (dispatch, getState) => {
    dispatch({type: STUDENT_ACTIVATION_REQUEST})
  axios
  .put("/api/user/admin/user/student/activate/?id=" + id, {
    headers: {
     'x-access-token': token
    }
  })
  .then((id) => {
    dispatch(activateStudentSuccess(id))
    dispatch(getAllStudents(token))
  }).catch((err) => {
    dispatch(activateStudentFailure(err))
  })
  }

}