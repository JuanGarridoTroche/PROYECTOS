import { Account, Entry, CategoryEnum } from "./Account.js";
console.log("Cargando typescript...⏱️");
var account = new Account();
console.log(account);
var expenseEjemplo = new Entry("Ejemplo de gasto", 100, CategoryEnum.expense);
var incomeEjemplo = new Entry("Ejemplo de gasto", 150, CategoryEnum.income);
account.addEntry(expenseEjemplo);
account.addEntry(incomeEjemplo);
console.log(account);
