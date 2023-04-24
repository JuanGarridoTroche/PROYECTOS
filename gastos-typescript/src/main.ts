import { Account, Entry, CategoryEnum } from './Account.js';
declare var Swal: any;

let account: Account;
const initialAccount = getAccountFromStorage();

if (initialAccount) {
  account = new Account(initialAccount as Account);
  updateBalanceAmount(account);
} else {
  account = createInitialAccount();
  updateBalanceAmount(account);
}

function createInitialAccount(): Account {
  const setupAccount = new Account();
  const expenseEjemplo = new Entry(
    'Ejemplo de gasto',
    100,
    CategoryEnum.expense
  );
  const incomeEjemplo = new Entry(
    'Ejemplo de ingreso',
    250,
    CategoryEnum.income
  );

  setupAccount.addEntry(expenseEjemplo);
  setupAccount.addEntry(incomeEjemplo);

  return setupAccount;
}

function getAccountFromStorage(): Account | boolean {
  const accountFromStorage = localStorage.getItem('account');
  return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}

function setAccountToStorage(account: Account): void {
  localStorage.setItem('account', JSON.stringify(account));
}

function updateBalanceAmount(account: Account) {
  const balanceAmountHtmlElement = document.querySelector(
    '#balanceAmount'
  ) as HTMLElement;
  const balanceAccount = account.getBalance();
  balanceAmountHtmlElement.textContent = `${balanceAccount}€`;
}

const entryTemplate = document.querySelector(
  '#entryTemplate'
) as HTMLTemplateElement;
const fragment = document.createDocumentFragment();
const recordsContainer = document.querySelector(
  '#recordsContainer'
) as HTMLElement;

recordsContainer.onclick = function (event) {
  if (event.target instanceof SVGElement && event.target.dataset.id) {
    const elementId = event.target.dataset.id;
    const entryElement = document.querySelector(`[data-id="${elementId}"]`);
    deleteElement(elementId as string, entryElement as HTMLElement);
  }
};

const entries = account.getEntries();
entries.forEach((entry) => {
  printEntry(entry);
});

function printEntry(entry: Entry) {
  const { concept, amount, category, id } = entry;

  const entryConceptTemplate =
    entryTemplate.content.querySelector('.entryConcept');
  const entryAmountTemplate =
    entryTemplate.content.querySelector('.entryAmount');
  const entryContainerTemplate = entryTemplate.content.querySelector('div');
  const iconSvg = entryTemplate.content.querySelector('svg');
  const svgPath = entryTemplate.content.querySelector('path');

  if (
    !entryConceptTemplate ||
    !entryAmountTemplate ||
    !entryContainerTemplate ||
    !iconSvg ||
    !svgPath
  ) {
    return;
  }

  entryConceptTemplate.textContent = concept;
  entryContainerTemplate.setAttribute('data-id', String(id));
  iconSvg.setAttribute('data-id', String(id));
  svgPath.setAttribute('data-id', String(id));

  if (category === CategoryEnum.expense) {
    entryAmountTemplate.classList.add('text-indigo-500');
    entryAmountTemplate.classList.remove('text-blue-500');
    entryAmountTemplate.textContent = `-${amount} €`;
  } else {
    entryAmountTemplate.classList.add('text-blue-500');
    entryAmountTemplate.classList.remove('text-indigo-500');
    entryAmountTemplate.textContent = `${amount} €`;
  }

  const clone = entryTemplate.content.cloneNode(true);
  fragment.appendChild(clone);
  recordsContainer.appendChild(fragment);
}

function deleteElement(id: string, entryElement: HTMLElement) {
  const entryConcept = entryElement.querySelector('.entryConcept')?.textContent;
  const entryAmount = entryElement.querySelector('.entryAmount')?.textContent;

  Swal.fire({
    title: '¿Quieres borrar esta entrada?',
    text: `Concepto: ${entryConcept}
           Cantidad: ${entryAmount}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#63b5f7',
    cancelButtonColor: '#7240ff',
    confirmButtonText: 'Sí, borrar entrada',
  }).then((result: any) => {
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

const entryConceptInput = document.querySelector(
  '#entryName'
) as HTMLInputElement;
const entryAmountInput = document.querySelector(
  '#entryAmount'
) as HTMLInputElement;

const addIncomeButton = document.querySelector(
  '#addIncomeButton'
) as HTMLButtonElement;
const addExpenseButton = document.querySelector(
  '#addExpenseButton'
) as HTMLButtonElement;

addIncomeButton.addEventListener(
  'click',
  addEntryFromTemplate.bind(this, CategoryEnum.income)
);
addExpenseButton.addEventListener(
  'click',
  addEntryFromTemplate.bind(this, CategoryEnum.expense)
);

function addEntryFromTemplate(category: CategoryEnum) {
  const conceptValue = entryConceptInput.value;
  const amountValue = entryAmountInput.value;

  if (conceptValue && amountValue) {
    const entryFromValues = new Entry(
      conceptValue,
      Number(amountValue),
      category
    );

    account.addEntry(entryFromValues);
    setAccountToStorage(account);
    printEntry(entryFromValues);
    updateBalanceAmount(account);
  }
}
