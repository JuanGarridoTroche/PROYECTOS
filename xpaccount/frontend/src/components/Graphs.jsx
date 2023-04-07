import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,  Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);               
import {Bar} from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { readingAccountService, readEntriesByAccountService } from '../services';
import { AuthContext } from '../context/AuthContext';

export const Graphs = ()=> {
  const {idAccount} = useParams();
  const {token} = useContext(AuthContext);
  const [myAccount, setMyAccount] = useState({})
  const [entries, setEntries] = useState([]);

  useEffect(()=>{
    const loadAccountData = async()=>{
      // Leemos los datos de la cuenta
      const readingAccount = await readingAccountService({idAccount, token})
      
      setMyAccount(readingAccount);

      // Leer todos los asientos de la cuenta idAccount
      const readingEntries = await readEntriesByAccountService({idAccount, token});
      console.log(readingEntries);
      setEntries(readingEntries)
      const allCategories = readingEntries.map((category) => {
        return category.category; 
      })
      const ObjCategories = new Set(allCategories)
      const categories = [...ObjCategories];
      console.log(categories);
      for(let i = 0; i < categories.length ; i++) {
        
      } 
      const myDatasets = [
        
        {
          id: '0',
          label : categories[i]
        }
       ]
    }
    if(token) {loadAccountData()};

  },[])


  const colors =  ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226']

  const options = {
    plugins: {
      title: {
        display: true,
        text: `${myAccount.alias}`,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }
  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril' ];
  const data = {
    labels,
    datasets: [
      {
        id: 1,
        label: 'Alimentación',
        data: [312.5, 423.89, 234.17, 328.45],
        backgroundColor: colors[0],
      },
      {
        id: 2,
        label: 'Transferencias',
        data: [122.5, 1338.9, 730.74, 928.12],
        backgroundColor: colors[1],
      },
      {
        id: 3,
        label: 'Recibos',
        data: [212.5, 123.89, 201.11, 728.45],
        backgroundColor: colors[2],
      }
    ]
  }


  return <Bar options={options} data={data} />
}