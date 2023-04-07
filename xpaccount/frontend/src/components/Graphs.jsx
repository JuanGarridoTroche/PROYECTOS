import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,  Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);               
import {Bar} from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { readingAccountService } from '../services';
import { AuthContext } from '../context/AuthContext';

export const Graphs = ()=> {
  const {idAccount} = useParams();
  const {token} = useContext(AuthContext);
  const [myAccount, setMyAccount] = useState({})

  useEffect(()=>{
    const loadAccountData = async()=>{
      // Leemos los datos de la cuenta
      const readingAccount = await readingAccountService({idAccount, token})
      
      setMyAccount(readingAccount);

    }
    if(token) {loadAccountData()};

  },[])


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
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        id: 2,
        label: 'Transferencias',
        data: [122.5, 1338.9, 730.74, 928.12],
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        id: 3,
        label: 'Recibos',
        data: [212.5, 123.89, 201.11, 728.45],
        backgroundColor: "rgb(53, 162, 235)",
      }
    ]
  }


  return <Bar options={options} data={data} />
}