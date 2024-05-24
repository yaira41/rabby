import React, { useState } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import './App.css';
import Layout from './components/layout/layout';
import Home from './pages/home';
import LessonView from './pages/lesson-view';
import Login from './pages/login';
import NotFound from './pages/not-found';
import Register from './pages/register';
import SelfTesting from './pages/self-testing';
import StudentPersonalArea from './pages/student-personal-area';
import TeacherPersonalArea from './pages/teacher-personal-area';
import UploadLessonPage from './pages/upload-lesson';


const App: React.FC = () => {
  const login = true;
  let routes: RouteObject[] = [];


  const [currLesson, setCurrLesson] = useState<string>();

  const handleAudioRecorded = (audio64: string) => {
    setCurrLesson(audio64);
  };


  if (login) {
    routes = [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/register",
            element: <Register />
          },
          {
            path: "/student-self-testing",
            element: <SelfTesting />
          },
          {
            path: "/student-personal-area",
            element: <StudentPersonalArea currLesson={currLesson} />
          },
          {
            path: "/teacher-personal-area",
            element: <TeacherPersonalArea />
          },
          {
            path: "/lesson/:id",
            element: <LessonView currLesson={currLesson} />
          },
          {
            path: "/upload-lesson",
            element: <UploadLessonPage setCurrLesson={handleAudioRecorded} />
          },
          {
            path: '*',
            element: <NotFound />
          }
        ]
      }
    ];
  }

  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
