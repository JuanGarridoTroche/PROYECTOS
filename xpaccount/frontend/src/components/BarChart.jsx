import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  );
import { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  readEntriesByAccountService,
  readingAccountService,
} from "../services";

export const BarChart = () => {
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [myAccount, setMyAccount] = useState([]);
  const [myEntries, setMyEntries] = useState([]);
  const [options, setOptions] = useState({});
  const [error, setError] = useState("");
  const [data, setData] = useState({});

  // Cargamos los asientos de la cuenta
  useEffect(() => {
    const loadEntriesByAccount = async () => {
      setError("");

      try {
        // Leer los datos de la cuenta
        const readingAccount = await readingAccountService({
          idAccount,
          token,
        });
        setMyAccount(readingAccount);

        // Leer todos los asientos de la cuenta idAccount
        const readingEntries = await readEntriesByAccountService({
          idAccount,
          token,
        });
        setMyEntries(readingEntries);

        if (readingEntries.length > 0) {
          const myOptions = {
            plugins: {
              title: {
                display: true,
                text: "Chart.js Bar Chart - Stacked",
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

          const labels = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
          ];
          const myGraphConfig = {
            labels,
            datasets: [
              {
                label: "Alimentación",
                data: [
                  100, 234, 567, 234, 121, 777, 234, 456, 710, 900, 205, 565,
                ],
                backgroundColor: "rgb(255, 99, 132)",
              },
              {
                label: "Recibos",
                data: [47, 89, 90, 95, 102, 34, 56, 50, 38, 12, 33, 62],
                backgroundColor: "rgb(75, 192, 192)",
              },
              {
                label: "Transferencias",
                data: [
                  102, 34, 56, 100, 214, 560, 235, 121, 650, 230, 340, 300,
                ],
                backgroundColor: "rgb(53, 162, 235)",
              },
            ],
          };
          setData(myGraphConfig);          
        }
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) {
      loadEntriesByAccount();
    }
  }, [token]);


  const fromDate = new Date("2023-04-01").getTime();
  const toDate = new Date("2023-04-30").getTime();
  myEntries.map((entry) => {
    // console.log(new Date(entry.dateEntry.split("/", 3).reverse().join("-")).getTime());
    // console.log(fromDate);
    if (Date.parse(entry.dateEntry) >= Date.parse("01/03/2023") && Date.parse(entry.dateEntry) <= Date.parse("31/03/2023")) {
      console.log(entry.dateEntry);
    }
  });
  const abril = myEntries.filter((entry) => {
    return (
      new Date(entry.dateEntry.split("/", 3).reverse().join("-")).getTime() >= fromDate && 
      new Date(entry.dateEntry.split("/", 3).reverse().join("-")).getTime() <= toDate
    );
  });
  console.log(abril);
  // console.log(myEntries);
  console.log("data: ", data);
  console.log("options: ", options);



  return <Bar data={data} options={options}/>
  // return (
  //   <h2>
  //     Gráficos de barra <span>{myAccount.alias}</span>
  //   </h2>
  // );
};
