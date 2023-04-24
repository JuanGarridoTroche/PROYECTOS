import { Account, Entry, CategoryEnum } from "./Account.js";

console.log("Cargando typescript...⏱️");

const account = new Account();

console.log(account);

const expenseEjemplo = new Entry("Ejemplo de gasto", 100, CategoryEnum.expense);
const incomeEjemplo = new Entry("Ejemplo de gasto", 150, CategoryEnum.income);

account.addEntry(expenseEjemplo);
account.addEntry(incomeEjemplo);
console.log(account);
