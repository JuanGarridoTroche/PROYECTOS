import { Account, Entry, CategoryEnum } from './Account.js';
var account;
var initialAccount = getAccountFromStorage();
if (initialAccount) {
    account = new Account(initialAccount);
    updateBalanceAmount(account);
}
else {
    account = createInitialAccount();
    updateBalanceAmount(account);
}
function createInitialAccount() {
    var setupAccount = new Account();
    var expenseEjemplo = new Entry('Ejemplo de gasto', 100, CategoryEnum.expense);
    var incomeEjemplo = new Entry('Ejemplo de ingreso', 250, CategoryEnum.income);
    setupAccount.addEntry(expenseEjemplo);
    setupAccount.addEntry(incomeEjemplo);
    return setupAccount;
}
function getAccountFromStorage() {
    var accountFromStorage = localStorage.getItem('account');
    return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}
function setAccountToStorage(account) {
    localStorage.setItem('account', JSON.stringify(account));
}
function updateBalanceAmount(account) {
    var balanceAmountHtmlElement = document.querySelector('#balanceAmount');
    var balanceAccount = account.getBalance();
    balanceAmountHtmlElement.textContent = "".concat(balanceAccount, "\u20AC");
}
var entryTemplate = document.querySelector('#entryTemplate');
var fragment = document.createDocumentFragment();
var recordsContainer = document.querySelector('#recordsContainer');
recordsContainer.onclick = function (event) {
    if (event.target instanceof SVGElement && event.target.dataset.id) {
        var elementId = event.target.dataset.id;
        var entryElement = document.querySelector("[data-id=\"".concat(elementId, "\"]"));
        deleteElement(elementId, entryElement);
    }
};
var entries = account.getEntries();
entries.forEach(function (entry) {
    printEntry(entry);
});
function printEntry(entry) {
    var concept = entry.concept, amount = entry.amount, category = entry.category, id = entry.id;
    var entryConceptTemplate = entryTemplate.content.querySelector('.entryConcept');
    var entryAmountTemplate = entryTemplate.content.querySelector('.entryAmount');
    var entryContainerTemplate = entryTemplate.content.querySelector('div');
    var iconSvg = entryTemplate.content.querySelector('svg');
    var svgPath = entryTemplate.content.querySelector('path');
    if (!entryConceptTemplate ||
        !entryAmountTemplate ||
        !entryContainerTemplate ||
        !iconSvg ||
        !svgPath) {
        return;
    }
    entryConceptTemplate.textContent = concept;
    entryContainerTemplate.setAttribute('data-id', String(id));
    iconSvg.setAttribute('data-id', String(id));
    svgPath.setAttribute('data-id', String(id));
    if (category === CategoryEnum.expense) {
        entryAmountTemplate.classList.add('text-indigo-500');
        entryAmountTemplate.classList.remove('text-blue-500');
        entryAmountTemplate.textContent = "-".concat(amount, " \u20AC");
    }
    else {
        entryAmountTemplate.classList.add('text-blue-500');
        entryAmountTemplate.classList.remove('text-indigo-500');
        entryAmountTemplate.textContent = "".concat(amount, " \u20AC");
    }
    var clone = entryTemplate.content.cloneNode(true);
    fragment.appendChild(clone);
    recordsContainer.appendChild(fragment);
}
function deleteElement(id, entryElement) {
    var _a, _b;
    var entryConcept = (_a = entryElement.querySelector('.entryConcept')) === null || _a === void 0 ? void 0 : _a.textContent;
    var entryAmount = (_b = entryElement.querySelector('.entryAmount')) === null || _b === void 0 ? void 0 : _b.textContent;
    Swal.fire({
        title: '¿Quieres borrar esta entrada?',
        text: "Concepto: ".concat(entryConcept, "\n           Cantidad: ").concat(entryAmount),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#63b5f7',
        cancelButtonColor: '#7240ff',
        confirmButtonText: 'Sí, borrar entrada',
    }).then(function (result) {
        if (result.isConfirmed) {
            account.deleteEntryById(Number(id));
            console.log(account);
            setAccountToStorage(account);
            entryElement.remove();
            updateBalanceAmount(account);
            Swal.fire('Borrado!', 'La entrada ha sido borrada.', 'success');
        }
    });
}
var entryConceptInput = document.querySelector('#entryName');
var entryAmountInput = document.querySelector('#entryAmount');
var addIncomeButton = document.querySelector('#addIncomeButton');
var addExpenseButton = document.querySelector('#addExpenseButton');
addIncomeButton.addEventListener('click', addEntryFromTemplate.bind(this, CategoryEnum.income));
addExpenseButton.addEventListener('click', addEntryFromTemplate.bind(this, CategoryEnum.expense));
function addEntryFromTemplate(category) {
    var conceptValue = entryConceptInput.value;
    var amountValue = entryAmountInput.value;
    if (conceptValue && amountValue) {
        var entryFromValues = new Entry(conceptValue, Number(amountValue), category);
        account.addEntry(entryFromValues);
        setAccountToStorage(account);
        printEntry(entryFromValues);
        updateBalanceAmount(account);
    }
}
