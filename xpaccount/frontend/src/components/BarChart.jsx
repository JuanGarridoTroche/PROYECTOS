import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useContext, useEffect, useState } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import {Bar} from "react-chartjs-2";
// import faker from 'faker';
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { readEntriesByAccountService, readingAccountService } from "../services";

export const BarChart = ()=> {
  const {idAccount} =useParams();
  const {token} = useContext(AuthContext);
  const [myAccount, setMyAccount] = useState([]);
  const [myEntries, setMyEntries] = useState([]);
  const [options, setOptions] = useState({});
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  // Cargamos los asientos de la cuenta
  useEffect(()=> {
    const loadEntriesByAccount = async ()=> {
      setError("");
      
      try {
        // Leer los datos de la cuenta
        const readingAccount = await readingAccountService({idAccount, token});
        setMyAccount(readingAccount);

        // Leer todos los asientos de la cuenta idAccount
        const readingEntries = await readEntriesByAccountService({idAccount, token})
        setMyEntries(readingEntries);
        console.log(readingEntries.length);
        if(readingEntries.length > 0) {
          const myOptions = {
            plugins: {
              title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked',
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
          };

          setOptions(myOptions);

          const labels = [Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, diciembre];
          const myGraphConfig = {
            labels,
            datasets: [
              {
                label: 'Dataset 1',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                backgroundColor: 'rgb(255, 99, 132)',
              },
              {
                label: 'Dataset 2',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                backgroundColor: 'rgb(75, 192, 192)',
              },
              {
                label: 'Dataset 3',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                backgroundColor: 'rgb(53, 162, 235)',
              },
            ]
          }
          setData(myGraphConfig);
        }
        
      } catch (err) {
        setError(err.message);
      }
    }
    if(token) {loadEntriesByAccount()};
  }, [])
  console.log(myEntries);
  console.log("data: ", data);
  console.log("options: ", options);
  // return <Bar data={data} options={options}/>
  return <h2>Gráficos de barra <span>{myAccount.alias}</span></h2>
}