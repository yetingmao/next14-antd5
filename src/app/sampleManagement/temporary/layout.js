"use client";
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ViewContext from '@/component/viewContext';




export default function RootLayout({ children }) {

  return (
    <>
      {children}
    </>
  )
};