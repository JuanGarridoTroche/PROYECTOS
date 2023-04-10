import "../css/Graphs.css";
import React, { useContext, useEffect, useState } from "react";
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
  Legend
);
import { Bar } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import {
  readingAccountService,
  readEntriesByAccountService,
} from "../services";
import { AuthContext } from "../context/AuthContext";

export const Graphs = () => {
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myAccount, setMyAccount] = useState({});
  const [entries, setEntries] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  let myDatasets = [];
  let balanceByCategory = [];
  const month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const loadAccountData = async () => {
      // Leemos los datos de la cuenta
      const readingAccount = await readingAccountService({ idAccount, token });

      setMyAccount(readingAccount);

      // Leer todos los asientos de la cuenta idAccount
      const readingEntries = await readEntriesByAccountService({
        idAccount,
        token,
      });
      setEntries(readingEntries);

      // Seleccionamos todas las categorías existentes en nuestros asientos bancarios y creamos un array (categories) con las categorías sin repetir
      const allCategories = readingEntries.map((category) => {
        return category.category;
      });
      // Una vez tenemos todas las cateorías, guardamos las categorías únicas en un objeto
      const ObjCategories = new Set(allCategories);
      // Y ahora pasamos el objeto a un array
      const categories = [...ObjCategories];

      // Agrupamos todos los asientos bancarios por categoría
      const entriesByCategories = categories.map((catName) => {
        return readingEntries.filter((item) => item.category === catName);
      });
      // console.log(entriesByCategories);
      for (let i = 0; i < entriesByCategories.length; i++) {
        let suma = 0;
        // console.log(entriesByCategories[i]);
        // const fromDate = new Date((`01/${i}/` + year).split("/", 3).reverse().join("/")).getTime();
        // const toDate = new Date((`31/${i}/` + year).split("/", 3).reverse().join("/")).getTime();
        const date = new Date();
        console.log(date);
        for (let j = 0; j < entriesByCategories[i].length; j++) {
          // console.log(entriesByCategories[i][j].amount);
          const fecha = Date(
            entriesByCategories[i][j].dateEntry
              .split("/", 3)
              .reverse()
              .join("-")
          );
          console.log(fecha);
          const primerDia = new Date(
            fecha.getFullYear(fecha),
            fecha.getMonth(fecha),
            2
          );
          const ultimoDia = new Date(
            fecha.getFullYear(),
            fecha.getMonth() + 1,
            1
          );
          console.log(primerDia);
          console.log(ultimoDia);
          if (fecha >= primerDia && fecha <= ultimoDia) {
            console.log(entriesByCategories[i][j].dateEntry);
            suma = suma + parseFloat(entriesByCategories[i][j].amount);
          }
          // console.log(fecha);

          // console.log(thisDate);
          // const newDate = new Date().getTime();
          // console.log(newDate);
        }

        balanceByCategory.push([
          { year, month, category: categories[i], suma },
        ]);
      }
      console.log(balanceByCategory);

      // Agrupamos cada categoría por año y meses
      // console.log(year);

      // Sumamos el amount de cada mes

      const createData = () => {
        return (Math.random() * 1300).toFixed(2);
      };

      for (let i = 0; i < categories.length; i++) {
        const myObject = {
          id: i,
          label: categories[i],
          data: [balanceByCategory[i].suma],
          backgroundColor: backgroundColors[i],
        };
        myDatasets.push(myObject);
      }
      // console.log("datasets: ", myDatasets);
      setDatasets(myDatasets);
    };
    if (token) {
      loadAccountData();
    }
  }, [year]);

  const backgroundColors = [
    "rgb(249, 65, 68)",
    "rgb(144, 190, 109)",
    "rgb(243, 114, 44)",
    "rgb(67, 170, 139)",
    "rgb(248, 150, 30)",
    "rgb(77, 144, 142)",
    "rgb(249, 132, 74)",
    "rgb(87, 117, 144)",
    "rgb(249, 199, 79)",
    "rgb(39, 125, 161)",
  ];

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
  };
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
    "Diciembre",
  ];
  const data = {
    labels,
    datasets,
  };

  return (
    <section className="graphs">
      <h2>
        GRÁFICOS DE LA CUENTA <span>{myAccount.alias}</span>
      </h2>
      <button
        onClick={() => {
          navigate(`/account/${idAccount}`);
        }}
      >
        Volver
      </button>
      <select
        name="year"
        id="year"
        onClick={(e) => {
          setYear(e.target.value);
        }}
      >
        <option defaultValue="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>

      <Bar options={options} data={data} />
    </section>
  );
};
